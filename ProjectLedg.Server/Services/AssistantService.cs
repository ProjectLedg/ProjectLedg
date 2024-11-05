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
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Functions.AssistantFunctions;
using ProjectLedg.Server.Data.Models.DTOs;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;
    private readonly IBasAccountService _basAccountService;
    private readonly EncryptionHelper _encryptionHelper;
    private readonly string _csvFilePath;
    private readonly string _directivesFilePath;
    private readonly string _mapDirectivesFilePath;
    private readonly string _basAccContextFilePath;

    //Functions
    private readonly IBasAccountFunctions _basAccountFunctions;
    private readonly IIngoingInvoiceFunctions _ingoingInvoiceFunctions;
    private readonly ITransactionFunctions _transactionFunctions;
    private readonly IOutgoingInvoiceFunctions _outgoingInvoiceFunctions;


    private readonly Dictionary<string, Func<string[], Task<string>>> _commandHandlers;

    public AssistantService(OpenAIClient openAiClient, ProjectLedgContext dbContext, IHttpContextAccessor httpContextAccessor, IIngoingInvoiceService invoiceService, IBasAccountService basAccountService, EncryptionHelper encryptionHelper, IBasAccountFunctions basAccountFunctions, IIngoingInvoiceFunctions ingoingInvoiceFunctions, ITransactionFunctions transactionFunctions, IOutgoingInvoiceFunctions outgoingInvoiceFunctions)
    {
        _openAiClient = openAiClient;
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _ingoingInvoiceService = invoiceService;
        _basAccountService = basAccountService;
        _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");
        _directivesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "AssistantDirectives.txt");
        _mapDirectivesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "AssistantBasAccMapDirectives.txt");
        _basAccContextFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BASAccTestContext.txt");
        _encryptionHelper = encryptionHelper;

        //Functions
        _ingoingInvoiceFunctions = ingoingInvoiceFunctions;
        _transactionFunctions = transactionFunctions;
        _basAccountFunctions = basAccountFunctions;
        _outgoingInvoiceFunctions = outgoingInvoiceFunctions;

        _commandHandlers = new Dictionary<string, Func<string[], Task<string>>>
        {
            { "GetCompanyBasAccounts", async args => await _basAccountFunctions.GetCompanyBasAccounts(int.Parse(args[0])) },
            { "GetPopularBasAccounts", async args => await _basAccountFunctions.GetPopularBasAccountsForCompany(int.Parse(args[0])) },
            { "GetLatestTransactions", async args => await _transactionFunctions.GetLatestTransactionsForCompany(int.Parse(args[0])) },
            { "GetHighProfileTransactions", async args => await _transactionFunctions.GetHighProfileTransactionsForCompany(int.Parse(args[0]), decimal.Parse(args[1])) },
            { "GetUnpaidIngoingInvoices", async args => await _ingoingInvoiceFunctions.GetUnpaidIngoingInvoicesForCompany(int.Parse(args[0])) },
            { "GetUnpaidOutgoingInvoices", async args => await _outgoingInvoiceFunctions.GetUnpaidOutgoingInvoicesForCompany(int.Parse(args[0])) },
            { "GetInvoicesByCompanyNameAndYear", async args => await _ingoingInvoiceFunctions.GetInvoices(args[0], int.Parse(args[1])) }
        };
        _outgoingInvoiceFunctions = outgoingInvoiceFunctions;
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        var session = _httpContextAccessor.HttpContext.Session;

        // Retrieve existing chat history from session, if any
        var chatHistoryEncrypted = session.GetString("ChatHistory");
        var messages = string.IsNullOrEmpty(chatHistoryEncrypted)
            ? new List<Message>()
            : JsonSerializer.Deserialize<List<Message>>(_encryptionHelper.DecryptData(chatHistoryEncrypted));

        // Ensure system message is added only once per session
        if (!messages.Any(m => m.Role == Role.System))
        {
            var basAccounts = LoadBasAccounts();
            var basContext = string.Join("\n", basAccounts.Select(a =>
                $"Account {a.AccountNumber} ({a.Description}): Debit = {a.Debit}, Credit = {a.Credit}, Year = {a.Year}"));
            var assistantDirectives = LoadAssistantDirectives();

            var systemMessage = new Message(Role.System, $"{assistantDirectives}\n\nBAS Chart:\n{basContext}");
            messages.Insert(0, systemMessage);
        }

        // Add user's message
        var userMessage = new Message(Role.User, message);
        messages.Add(userMessage);

        // Limit to recent messages
        var recentMessages = messages.TakeLast(10).ToList();
        var chatRequest = new ChatRequest(recentMessages, model: "gpt-4o-mini");

        // Process with OpenAI
        var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);
        var assistantResponse = response.FirstChoice?.Message?.Content.GetString() ?? "No valid response from assistant.";
        messages.Add(new Message(Role.Assistant, assistantResponse));

        // Encrypt and store in session
        var encryptedChatHistory = _encryptionHelper.EncryptData(JsonSerializer.Serialize(messages));
        session.SetString("ChatHistory", encryptedChatHistory);

        Console.WriteLine($"Encrypted Chat History: {encryptedChatHistory}");
        return assistantResponse;
    }

    public async Task<string> MapInvoiceToBasAccountsAsync(InvoiceMapDTO invoice)
    {
        // Load context and necessary info for the AI
        var basAccContext = LoadAssistantBasAccountContext();
        var basAccDict = ParseBasAccountContext(basAccContext);

        // Extract invoice item descriptions
        var itemDescriptions = invoice.Items.Select(i => i.Description).ToList();

        // Determine relevant BasAccounts by connecting keywords with descriptions
        var relevantBasAccs = FilterRelevantBasAccounts(basAccDict, itemDescriptions);

        // Create message list
        var messages = new List<Message>();

        // Load context and necessary info for the AI and give insructions
        var assistantDirectives = LoadAssistantMapDirectives();
        var systemMessage = new Message(Role.System, $"{assistantDirectives}\n\n Here is a reference BAS Account chart for categorization:\n{basAccContext}");
        messages.Add(systemMessage);


        // Extract invoice item descriptions and amounts in a readable format
        var invoiceDetails = $"{{ \"invoiceNumber\": \"{invoice.InvoiceNumber}\", \"invoiceTotal\": {invoice.InvoiceTotal}, \"totalTax\": {invoice.TotalTax}, \"Items\": [\n";

        foreach (var item in invoice.Items)
        {
            invoiceDetails += $"  {{ \"Description\": \"{item.Description}\", \"Quantity\": {item.Quantity}, \"UnitPrice\": {item.UnitPrice}, \"Amount\": {item.Amount} }},\n";
        }
        invoiceDetails += "] }";


        var mappingPromt = new Message(
            Role.User,
            $"Using the BAS Account chart with descriptions and keywords, categorize each invoice item to the most relevant BAS account. The invoice details are:\n\n{invoiceDetails}.\n\n"
        );

        messages.Add(mappingPromt);

        // Proccess request
        var chatRequest = new ChatRequest(messages, model: "gpt-4o-mini", temperature: 0.2, responseFormat: ChatResponseFormat.Json);
        var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

        var assistantResponse = response.Choices[0].Message.Content.GetString() ?? "No valid response from the assistant.";

        return assistantResponse;
    }


    // Helper methods

    // Parse BAS account context from UTF-8 string into a dictionary
    private Dictionary<string, (string description, List<string> keywords)> ParseBasAccountContext(string basAccContext)
    {
        var basAccDict = new Dictionary<string, (string description, List<string> keywords)>();

        // Split lines and handle UTF-8 specifically in parsing
        var lines = basAccContext.Split('\n');
        foreach (var line in lines)
        {
            // Ensure line is processed as UTF-8
            var utf8Line = Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(line));

            var parts = utf8Line.Split(" - keywords: ");
            if (parts.Length == 2)
            {
                var accountParts = parts[0].Split(": ");
                var accountNumber = accountParts[0].Trim();
                var description = accountParts[1].Trim();
                var keywords = parts[1].Split(", ").Select(k => k.Trim()).ToList();

                basAccDict[accountNumber] = (description, keywords);
            }
        }
        return basAccDict;
    }

    private List<string> FilterRelevantBasAccounts(Dictionary<string, (string description, List<string> keywords)> basAccountDict, List<string> itemDescriptions)
    {
        var relevantAccs = new HashSet<string>();

        foreach (var description in itemDescriptions)
        {
            // Ensure UTF-8 processing in descriptions
            var utf8Description = Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(description));

            foreach (var account in basAccountDict)
            {
                if (account.Value.keywords.Any(keyword => utf8Description.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
                {
                    relevantAccs.Add(account.Key);
                }
            }
        }

        return relevantAccs.ToList();
    }


    // Not used atm, uneccessary?
    // Creates a filtered BAS account context based on the relevant accounts for this invoice.
    private string CreateFilteredBasAccountContext(List<string> relevantBasAccs, Dictionary<string, (string description, List<string> keywords)> basAccDict)
    {
        var filteredContext = new StringBuilder();

        foreach (var accountNumber in relevantBasAccs)
        {
            (string description, List<string> keywords) = basAccDict[accountNumber];

            // Build UTF-8 encoded string and append it
            var contextLine = $"{accountNumber}: {description} - keywords: {string.Join(", ", keywords)}\n";
            filteredContext.Append(Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(contextLine)));
        }

        return filteredContext.ToString();
    }


    // Load files methods
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
        return File.ReadAllText(_directivesFilePath, Encoding.UTF8);
    }

    private string LoadAssistantMapDirectives()
    {
        if (!File.Exists(_mapDirectivesFilePath))
        {
            throw new FileNotFoundException("Assistant directives file not found at path: " + _mapDirectivesFilePath);
        }
        return File.ReadAllText(_mapDirectivesFilePath, Encoding.UTF8);
    }

    private string LoadAssistantBasAccountContext()
    {
        if (!File.Exists(_basAccContextFilePath))
        {
            throw new FileNotFoundException("Assistant directives file not found at path: " + _basAccContextFilePath);
        }
        return File.ReadAllText(_basAccContextFilePath, Encoding.UTF8);
    }

}