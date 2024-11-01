using OpenAI.Chat;
using OpenAI;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using ProjectLedg.Server.Data.Models;
using System.Security.Cryptography;
using System.Text;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;
    private readonly IBasAccountService _basAccountService;
    private readonly string _csvFilePath;
    private readonly string _directivesFilePath;
    private readonly byte[] _aesKey = Enumerable.Range(0, Environment.GetEnvironmentVariable("AES_KEY").Length)
        .Where(x => x % 2 == 0)
        .Select(x => Convert.ToByte(Environment.GetEnvironmentVariable("AES_KEY").Substring(x, 2), 16))
        .ToArray();
    private readonly byte[] _aesIV = Convert.FromBase64String(Environment.GetEnvironmentVariable("AES_IV"));

    private readonly Dictionary<string, Func<string[], Task<string>>> _commandHandlers;

    public AssistantService(OpenAIClient openAiClient, ProjectLedgContext dbContext, IHttpContextAccessor httpContextAccessor, IIngoingInvoiceService invoiceService, IBasAccountService basAccountService)
    {
        _openAiClient = openAiClient;
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _ingoingInvoiceService = invoiceService;
        _basAccountService = basAccountService;
        _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");
        _directivesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "AssistantDirectives.txt");

        _commandHandlers = new Dictionary<string, Func<string[], Task<string>>>
        {
            { "GetCompanyBasAccounts", async args => await HandleGetCompanyBasAccounts(args) }
        };
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        var session = _httpContextAccessor.HttpContext.Session;

        //Retrieve existing chat history from session, if any
        var chatHistoryEncrypted = session.GetString("ChatHistory");
        var messages = string.IsNullOrEmpty(chatHistoryEncrypted)
            ? new List<Message>()
            : JsonSerializer.Deserialize<List<Message>>(DecryptData(chatHistoryEncrypted));

        //Ensure system message is added only once per session
        if (!messages.Any(m => m.Role == Role.System))
        {
            var basAccounts = LoadBasAccounts();
            var basContext = string.Join("\n", basAccounts.Select(a =>
                $"Account {a.AccountNumber} ({a.Description}): Debit = {a.Debit}, Credit = {a.Credit}, Year = {a.Year}"));
            var assistantDirectives = LoadAssistantDirectives();

            var systemMessage = new Message(Role.System, $"{assistantDirectives}\n\nBAS Chart:\n{basContext}");
            messages.Insert(0, systemMessage);
        }

        //Add user's message
        var userMessage = new Message(Role.User, message);
        messages.Add(userMessage);

        //Limit to recent messages
        var recentMessages = messages.TakeLast(10).ToList();
        var chatRequest = new ChatRequest(recentMessages, model: "gpt-4o-mini");

        //Process with OpenAI
        var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);
        var assistantResponse = response.FirstChoice?.Message?.Content.GetString() ?? "No valid response from assistant.";
        messages.Add(new Message(Role.Assistant, assistantResponse));

        var encryptedChatHistory = EncryptData(JsonSerializer.Serialize(messages));
        //Encrypt and store in session
        session.SetString("ChatHistory", encryptedChatHistory);

        Console.WriteLine($"Encrypted Chat History: {encryptedChatHistory}");
        return assistantResponse;
    }

    //Encrypts the chat history directly
    private string EncryptData(string data)
    {
        using var aes = Aes.Create();
        aes.Key = _aesKey;
        aes.IV = _aesIV;

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(data);
        }

        return Convert.ToBase64String(ms.ToArray());
    }

    //Decrypts the chat history directly
    private string DecryptData(string encryptedData)
    {
        var encryptedBytes = Convert.FromBase64String(encryptedData);

        using var aes = Aes.Create();
        aes.Key = _aesKey;
        aes.IV = _aesIV;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(encryptedBytes);
        using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);

        return sr.ReadToEnd();
    }

    private List<BasAccount> LoadBasAccounts()
    {
        var basAccounts = new List<BasAccount>();

        try
        {
            if (!File.Exists(_csvFilePath))
            {
                Console.WriteLine($"BAS chart CSV file not found at path: {_csvFilePath}");
                return basAccounts;
            }

            var lines = File.ReadAllLines(_csvFilePath);
            foreach (var line in lines.Skip(1))
            {
                var fields = line.Split(',');
                if (fields.Length >= 4)
                {
                    basAccounts.Add(new BasAccount
                    {
                        AccountNumber = fields[0].Trim(),
                        Description = fields[1].Trim(),
                        Debit = decimal.TryParse(fields[2], out var debit) ? debit : 0,
                        Credit = decimal.TryParse(fields[3], out var credit) ? credit : 0,
                        Year = int.TryParse(fields[4], out var year) ? year : 0
                    });
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading BAS accounts: {ex.Message}");
        }

        return basAccounts;
    }

    private string LoadAssistantDirectives()
    {
        if (!File.Exists(_directivesFilePath))
        {
            throw new FileNotFoundException("Assistant directives file not found at path: " + _directivesFilePath);
        }
        return File.ReadAllText(_directivesFilePath);
    }

    private async Task<string> HandleGetCompanyBasAccounts(string[] args)
    {
        if (args.Length < 1 || !int.TryParse(args[0], out int companyId))
        {
            return "Please provide a valid company ID. Usage: GetCompanyBasAccounts [companyId]";
        }

        return await FetchCompanyBasAccountsAsync(companyId);
    }

    private async Task<string> FetchCompanyBasAccountsAsync(int companyId)
    {
        var company = await _dbContext.Companies
            .Include(c => c.BasAccounts)
            .FirstOrDefaultAsync(c => c.Id == companyId);

        if (company == null)
        {
            return $"Company with ID {companyId} not found.";
        }

        if (company.BasAccounts == null || !company.BasAccounts.Any())
        {
            return $"No BAS accounts found for company '{company.CompanyName}'.";
        }

        var basAccountsInfo = company.BasAccounts.Select(b =>
            $"Account {b.AccountNumber} ({b.Description}): Debit = {b.Debit}, Credit = {b.Credit}, Year = {b.Year}"
        );

        return $"BAS Accounts for company '{company.CompanyName}':\n" + string.Join("\n", basAccountsInfo);
    }
}
