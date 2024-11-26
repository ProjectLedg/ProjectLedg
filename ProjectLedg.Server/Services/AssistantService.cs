using OpenAI.Chat;
using OpenAI;
using ProjectLedg.Server.Data.Models.DTOs;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Helpers.Commands;
using ProjectLedg.Server.Services.IServices;
using System.IO;
using System.Text.Json;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Services.AssistantFunctions;
using ProjectLedg.Server.Functions.AssistantFunctions;
using ProjectLedg.Server.Data.Models.DTOs.Functions.IngoingInvoice;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data.Models;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AssistantService> _logger;
    private readonly EncryptionHelper _encryptionHelper;
    private readonly IntentHelper _intentHelper;
    //Functions
    private readonly IIngoingInvoiceFunctions _ingoingInvoiceFunctions;
    private readonly IOutgoingInvoiceFunctions _outgoingInvoiceFunctions;
    private readonly ITransactionFunctions _transactionFunctions;
    private readonly IBasAccountFunctions _basAccountFunctions;

    private const string AssistantDirectivesPath = "Assets/assistantDirectives.env";
    private const string BasAccountContextPath = "Assets/BASAccContext.txt";
    private const string AssistantMapDirectivesPath = "Assets/AssistantBasAccMapDirectives.txt";

    public AssistantService(
     OpenAIClient openAiClient,
     ProjectLedgContext dbContext,
     IHttpContextAccessor httpContextAccessor,
     ILogger<AssistantService> logger,
     EncryptionHelper encryptionHelper,
     IntentHelper intentHelper,
     IBasAccountFunctions basAccountFunctions,
     IIngoingInvoiceFunctions ingoingInvoiceFunctions,
     IOutgoingInvoiceFunctions outgoingInvoiceFunctions,
     ITransactionFunctions transactionFunctions)
    {
        _openAiClient = openAiClient;
        _context = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _encryptionHelper = encryptionHelper;
        _intentHelper = intentHelper;

        _basAccountFunctions = basAccountFunctions;
        _transactionFunctions = transactionFunctions;
        _ingoingInvoiceFunctions = ingoingInvoiceFunctions;
        _outgoingInvoiceFunctions = outgoingInvoiceFunctions;
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        try
        {
            // Step 1: Process intent using IntentHelper
            var result = await _intentHelper.ProcessIntentAsync(message);
            if (!string.IsNullOrEmpty(result))
            {
                _logger.LogInformation("Processed intent successfully: {Result}", result);
                return result;
            }

            //Step 2: If no intent matched, fall back to OpenAI chat
            var session = _httpContextAccessor.HttpContext.Session;

            //Retrieve chat history from session
            var chatHistory = GetChatHistory();

            //Add user's message to chat history
            chatHistory.Add(new Message(Role.User, message));

            //Ensure system context is included
            if (!chatHistory.Any(m => m.Role == Role.System))
            {
                var systemMessage = CreateSystemMessage();
                chatHistory.Insert(0, systemMessage);
            }

            //Send chat request and get the assistant's response
            var assistantResponse = await SendChatRequestAsync(chatHistory);

            //Add assistant's response to chat history
            chatHistory.Add(new Message(Role.Assistant, assistantResponse));

            //Save updated chat history
            SaveChatHistory(chatHistory);

            return assistantResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred in SendMessageToAssistantAsync.");
            return "Ett internt fel uppstod vid bearbetning av din förfrågan.";
        }
    }



    public async Task<string> MapInvoiceToBasAccountsAsync(InvoiceMapDTO invoice)
    {
        try
        {
            var basAccContext = LoadAssistantBasAccountContext();
            var assistantDirectives = LoadAssistantMapDirectives();

            var systemMessage = new Message(Role.System, $"{assistantDirectives}\n\n{basAccContext}");
            var userMessage = new Message(Role.User, $"Analysera följande faktura: {JsonSerializer.Serialize(invoice)}");

            var chatRequest = new ChatRequest(new[] { systemMessage, userMessage }, model: "gpt-4o-mini");
            var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

            return response.FirstChoice?.Message?.Content ?? "Ingen giltigt svar från assistenten.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in MapInvoiceToBasAccountsAsync.");
            return "Ett internt fel uppstod vid kartläggning av BAS-konton.";
        }
    }

    // Helper Methods

    private List<Message> GetChatHistory()
    {
        var session = _httpContextAccessor.HttpContext.Session;
        var encryptedHistory = session.GetString("ChatHistory");
        return string.IsNullOrEmpty(encryptedHistory)
            ? new List<Message>()
            : JsonSerializer.Deserialize<List<Message>>(_encryptionHelper.DecryptData(encryptedHistory));
    }

    private async Task<string> SendChatRequestAsync(List<Message> chatHistory)
    {
        var recentMessages = chatHistory.TakeLast(10).ToList();
        var chatRequest = new ChatRequest(recentMessages, model: "gpt-4o-mini");

        try
        {
            var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

            if (response?.Choices == null || !response.Choices.Any())
            {
                _logger.LogWarning("Assistant response is null or empty.");
                return "The assistant did not provide a valid response.";
            }

            // Safely extract the response content
            var assistantChoice = response.Choices.First();
            var rawContent = assistantChoice.Message?.Content;

            // Ensure content is properly converted to a string
            if (rawContent.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                return rawContent.GetString();
            }

            _logger.LogWarning("Assistant response content is not a string.");
            return "The assistant did not provide a valid response.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in SendChatRequestAsync.");
            return "An internal error occurred while processing your request.";
        }
    }
    private void SaveChatHistory(List<Message> chatHistory)
    {
        var session = _httpContextAccessor.HttpContext.Session;

        // Serialize and encrypt the chat history
        var encryptedHistory = _encryptionHelper.EncryptData(JsonSerializer.Serialize(chatHistory));

        // Save the encrypted chat history in the session
        session.SetString("ChatHistory", encryptedHistory);
    }


    private Message CreateSystemMessage()
    {
        var assistantDirectives = LoadAssistantDirectives();
        var basAccountContext = LoadAssistantBasAccountContext();

        if (string.IsNullOrWhiteSpace(assistantDirectives) || string.IsNullOrWhiteSpace(basAccountContext))
        {
            _logger.LogWarning("Assistant context files are missing or empty.");
            return new Message(Role.System, "Standardriktlinjer för assistent.");
        }

        return new Message(Role.System, $"{assistantDirectives}\n\nBAS-kontoplan:\n{basAccountContext}");
    }

    private string LoadAssistantDirectives()
    {
        if (!File.Exists(AssistantDirectivesPath))
        {
            _logger.LogWarning("Assistant directives file not found at path: {Path}", AssistantDirectivesPath);
            return string.Empty;
        }

        return File.ReadAllText(AssistantDirectivesPath);
    }

    private string LoadAssistantBasAccountContext()
    {
        if (!File.Exists(BasAccountContextPath))
        {
            _logger.LogWarning("BAS account context file not found at path: {Path}", BasAccountContextPath);
            return string.Empty;
        }

        return File.ReadAllText(BasAccountContextPath);
    }

    private string LoadAssistantMapDirectives()
    {
        if (!File.Exists(AssistantMapDirectivesPath))
        {
            _logger.LogWarning("Assistant map directives file not found at path: {Path}", AssistantMapDirectivesPath);
            return string.Empty;
        }

        return File.ReadAllText(AssistantMapDirectivesPath);
    }


    private void RegisterIntents()
    {
        // Ingoing Invoices
        _intentHelper.RegisterCommand("obetalda fakturor", async args =>
        {
            _logger.LogInformation("Executing intent: 'obetalda fakturor' with arguments: {Args}", args);

            if (args.Length == 0)
            {
                return "Vänligen ange ett företagsnamn eller ID för att visa obetalda fakturor.";
            }

            if (int.TryParse(args[0], out var companyId))
            {
                var invoices = await _ingoingInvoiceFunctions.GetUnpaidInvoicesForCompanyAsync(companyId);
                return invoices == null || !invoices.Any()
                    ? "Inga obetalda fakturor hittades för det angivna företaget."
                    : FormatInvoices("Obetalda inkommande fakturor", invoices);
            }

            var companyName = string.Join(" ", args);
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.CompanyName.Equals(companyName, StringComparison.OrdinalIgnoreCase));

            if (company == null)
            {
                return $"Företaget '{companyName}' kunde inte hittas.";
            }

            var invoicesByName = await _ingoingInvoiceFunctions.GetUnpaidInvoicesForCompanyAsync(company.Id);
            return invoicesByName == null || !invoicesByName.Any()
                ? $"Inga obetalda fakturor hittades för företaget '{companyName}'."
                : FormatInvoices($"Obetalda inkommande fakturor för {companyName}", invoicesByName);
        });


        // Outgoing Invoices
        _intentHelper.RegisterCommand("obetald utgående faktura", args =>
            _outgoingInvoiceFunctions.GetUnpaidOutgoingInvoicesForCompany(int.Parse(args[0])));

        // BAS Accounts
        _intentHelper.RegisterCommand("visa bas konton", async args =>
        {
            if (args.Length == 0)
            {
                return "Ange ett företags-ID för att visa BAS konton.";
            }

            if (int.TryParse(args[0], out var companyId))
            {
                return await _basAccountFunctions.HandleGetCompanyBasAccounts(new[] { companyId.ToString() });
            }

            return "Företags-ID är ogiltigt.";
        });

        // Latest Transactions WORKS
        _intentHelper.RegisterCommand("senaste transaktioner", args =>
            _transactionFunctions.GetLatestTransactionsForCompany(int.Parse(args[0])));

        // High Profile Transactions
        _intentHelper.RegisterCommand("högprofilerade transaktioner", async args =>
        {
            if (args.Length == 0)
            {
                return "Vänligen ange ett företags-ID för att visa högprofilerade transaktioner.";
            }

            if (int.TryParse(args[0], out var companyId))
            {
                return await _transactionFunctions.GetHighProfileTransactionsForCompany(companyId);
            }

            return "Ogiltigt företags-ID. Vänligen ange ett numeriskt ID.";
        });
    }

    private string FormatInvoices(string title, List<IngoingInvoiceFunctionDTO> invoices)
    {
        if (invoices == null || !invoices.Any())
        {
            return $"{title}: Inga fakturor hittades.";
        }

        var formattedInvoices = invoices
            .Select((invoice, index) =>
                $"{index + 1}. Fakturanummer: {invoice.InvoiceNumber}\n" +
                $"   Förfallodatum: {invoice.DueDate:yyyy-MM-dd}\n" +
                $"   Total: {invoice.InvoiceTotal:C}")
            .ToList();

        return $"{title}:\n\n" + string.Join("\n\n", formattedInvoices);
    }
    private string FormatTransactions(string title, List<Transaction> transactions)
    {
        if (transactions == null || !transactions.Any())
        {
            return $"{title}: Inga transaktioner hittades.";
        }

        var formattedTransactions = transactions.Select((t, index) =>
            $"{index + 1}. **Datum:** {t.TransactionDate:yyyy-MM-dd}\n" +
            $"   - **Beskrivning:** {t.BasAccount?.Description ?? "Ingen beskrivning"}\n" +
            $"   - **BAS konto:** {t.BasAccount?.AccountNumber ?? "Okänt konto"}\n" +
            $"   - **Belopp:** {t.Amount:C}"
        ).ToList();

        return $"{title}:\n\n" + string.Join("\n\n", formattedTransactions);
    }
}
