using OpenAI.Chat;
using OpenAI;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using ProjectLedg.Server.Data.Models;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;
    private readonly IBasAccountService _basAccountService;
    private readonly string _csvFilePath;
    private readonly string _directivesFilePath;

    public AssistantService(OpenAIClient openAiClient, ProjectLedgContext dbContext, IHttpContextAccessor httpContextAccessor, IIngoingInvoiceService invoiceService, IBasAccountService basAccountService)
    {
        _openAiClient = openAiClient;
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _ingoingInvoiceService = invoiceService;
        _basAccountService = basAccountService;
        _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");
        _directivesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "AssistantDirectives.txt");
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        // Commenting out authentication part for testing without login
        /*
        var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                            ?? _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            var claims = _httpContextAccessor.HttpContext?.User?.Claims
                .Select(c => $"{c.Type}: {c.Value}")
                .ToList() ?? new List<string> { "No claims found" };

            return $"User is not authenticated. Claims available: {string.Join(", ", claims)}";
        }
        */

         //Load BAS accounts and assistant directives
    var basAccounts = LoadBasAccounts();
    var basContext = string.Join("\n", basAccounts.Select(a =>
        $"Account {a.AccountNumber} ({a.Description}): Debit = {a.Debit}, Credit = {a.Credit}, Year = {a.Year}"));
    var assistantDirectives = LoadAssistantDirectives();

    //Combining assistant directives and BAS chart context
    var systemMessage = new Message(Role.System,
        $"{assistantDirectives}\n\nBAS Chart:\n{basContext}");

    var userMessage = new Message(Role.User, message);

    var messages = new List<Message> { systemMessage, userMessage };
    var chatRequest = new ChatRequest(messages, model: "gpt-4o-mini");

    var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

    // Retrieve and handle response content safely
    if (response.FirstChoice?.Message?.Content.ValueKind == JsonValueKind.String)
    {
        return response.FirstChoice.Message.Content.GetString();
    }
    
    return "No valid response from assistant.";
}

    private List<BasAccount> LoadBasAccounts()
    {
        var basAccounts = new List<BasAccount>();

        try
        {
            if (!File.Exists(_csvFilePath))
            {
                //Log a message or handle the missing file as needed
                Console.WriteLine($"BAS chart CSV file not found at path: {_csvFilePath}");
                return basAccounts; //Return an empty list if file is not found
            }

            var lines = File.ReadAllLines(_csvFilePath);
            foreach (var line in lines.Skip(1)) //Skip header line
            {
                var fields = line.Split(',');
                if (fields.Length >= 4) //Adjust based on actual CSV structure
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
            //Log or handle other exceptions if needed
            Console.WriteLine($"Error loading BAS accounts: {ex.Message}");
        }

        return basAccounts; //Always return the list, even if empty
    }

    private string LoadAssistantDirectives()
    {
        if (!File.Exists(_directivesFilePath))
        {
            throw new FileNotFoundException("Assistant directives file not found at path: " + _directivesFilePath);
        }
        return File.ReadAllText(_directivesFilePath);
    }


    private async Task<string> FetchUserInfoAsync(string userId)
    {
        var user = await _dbContext.Users
            .Where(u => u.Id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
            return "User not found.";

        return $"Name: {user.FirstName} {user.LastName}, Email: {user.Email}";
    }

    private async Task<string> FetchUserInvoicesAsync(string userId)
    {
        var invoices = await _ingoingInvoiceService.GetAllIngoingInvoicesAsync();
        var userInvoices = invoices.Where(i => i.CustomerId == userId).OrderByDescending(i => i.InvoiceDate).Take(5).ToList();

        if (!userInvoices.Any())
            return "No invoices found for the authenticated user.";

        var invoiceDetails = userInvoices.Select(i =>
            $"Invoice Number: {i.InvoiceNumber}, Date: {i.InvoiceDate.ToShortDateString()}, Total: {i.InvoiceTotal}, Due Date: {i.DueDate.ToShortDateString()}, Vendor: {i.VendorName}"
        ).ToList();

        return string.Join("\n\n", invoiceDetails);
    }
}
