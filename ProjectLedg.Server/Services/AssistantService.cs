using OpenAI.Chat;
using OpenAI;
using ProjectLedg.Server.Data.Models.DTOs;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Helpers.Commands;
using ProjectLedg.Server.Services.IServices;
using System.Text.Json;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;
    private readonly IBasAccountService _basAccountService;
    private readonly EncryptionHelper _encryptionHelper;
    private readonly CommandHelper _commandHelper;
    private readonly ILogger<AssistantService> _logger;

    // Functions
    private readonly IBasAccountFunctions _basAccountFunctions;
    private readonly IIngoingInvoiceFunctions _ingoingInvoiceFunctions;
    private readonly ITransactionFunctions _transactionFunctions;
    private readonly IOutgoingInvoiceFunctions _outgoingInvoiceFunctions;

    // Command Handlers
    private readonly Dictionary<string, Func<string[], Task<string>>> _commandHandlers;

    private readonly string _assistantId;

    public AssistantService(
        OpenAIClient openAiClient,
        ProjectLedgContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IIngoingInvoiceService invoiceService,
        IBasAccountService basAccountService,
        EncryptionHelper encryptionHelper,
        IBasAccountFunctions basAccountFunctions,
        IIngoingInvoiceFunctions ingoingInvoiceFunctions,
        ITransactionFunctions transactionFunctions,
        IOutgoingInvoiceFunctions outgoingInvoiceFunctions,
        ILogger<AssistantService> logger)
    {
        _openAiClient = openAiClient ?? throw new ArgumentNullException(nameof(openAiClient));
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _ingoingInvoiceService = invoiceService ?? throw new ArgumentNullException(nameof(invoiceService));
        _basAccountService = basAccountService ?? throw new ArgumentNullException(nameof(basAccountService));
        _encryptionHelper = encryptionHelper ?? throw new ArgumentNullException(nameof(encryptionHelper));
        _basAccountFunctions = basAccountFunctions ?? throw new ArgumentNullException(nameof(basAccountFunctions));
        _ingoingInvoiceFunctions = ingoingInvoiceFunctions ?? throw new ArgumentNullException(nameof(ingoingInvoiceFunctions));
        _transactionFunctions = transactionFunctions ?? throw new ArgumentNullException(nameof(transactionFunctions));
        _outgoingInvoiceFunctions = outgoingInvoiceFunctions ?? throw new ArgumentNullException(nameof(outgoingInvoiceFunctions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Load AssistantId from environment
        _assistantId = Environment.GetEnvironmentVariable("OpenAI_Assistant_ID")
                       ?? throw new InvalidOperationException("Assistant ID is not configured in the environment variables.");

        // Initialize command handlers
        _commandHandlers = new Dictionary<string, Func<string[], Task<string>>>
        {
            { "visa alla bas konton", async args => await _basAccountFunctions.GetCompanyBasAccounts(int.Parse(args[0])) },
            { "visa mest populära bas konton", async args => await _basAccountFunctions.GetPopularBasAccountsForCompany(int.Parse(args[0])) },
            { "visa senaste transaktionerna", async args => await _transactionFunctions.GetLatestTransactionsForCompany(int.Parse(args[0])) },
            { "visa högprofilerade transaktioner", async args => await _transactionFunctions.GetHighProfileTransactionsForCompany(int.Parse(args[0]), decimal.Parse(args[1])) },
            { "visa obetalda inkommande fakturor", async args => await _ingoingInvoiceFunctions.GetUnpaidIngoingInvoicesForCompany(int.Parse(args[0])) },
            { "visa obetalda utgående fakturor", async args => await _outgoingInvoiceFunctions.GetUnpaidOutgoingInvoicesForCompany(int.Parse(args[0])) },
            { "hämta fakturor", async args => await _ingoingInvoiceFunctions.GetInvoices(args[0], int.Parse(args[1])) }
        };

        _logger.LogInformation("Command handlers initialized with the following commands: {Commands}", string.Join(", ", _commandHandlers.Keys));
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                _logger.LogWarning("Received an empty or null message.");
                return "Message cannot be empty.";
            }

            var session = _httpContextAccessor.HttpContext.Session;

            // Retrieve existing chat history from session, if any
            var chatHistoryEncrypted = session.GetString("ChatHistory");
            var messages = string.IsNullOrEmpty(chatHistoryEncrypted)
                ? new List<Message>()
                : JsonSerializer.Deserialize<List<Message>>(_encryptionHelper.DecryptData(chatHistoryEncrypted));

            // Clear chat history if it exceeds the maximum allowed size
            const int MaxMessages = 20;
            if (messages.Count > MaxMessages)
            {
                messages = messages.TakeLast(MaxMessages).ToList();
            }

            // Check if the message is a command
            var commandResult = await ProcessCommandAsync(message);
            if (commandResult != null)
            {
                messages.Add(new Message(Role.Assistant, commandResult));
                UpdateChatHistory(session, messages);
                return commandResult;
            }

            // Add user's message
            messages.Add(new Message(Role.User, message));

            // Limit to recent messages before sending
            var recentMessages = messages.TakeLast(10).ToList();
            _logger.LogInformation("Sending chat request with {MessageCount} messages.", recentMessages.Count);

            var chatRequest = new ChatRequest(recentMessages, model: "gpt-4o-mini");
            var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

            var assistantResponse = response.FirstChoice?.Message?.Content ?? "No valid response from assistant.";
            messages.Add(new Message(
                role: Role.Assistant,
                content: assistantResponse
            ));

            UpdateChatHistory(session, messages);

            return assistantResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in SendMessageToAssistantAsync. Details: {Message}, StackTrace: {StackTrace}", ex.Message, ex.StackTrace);
            return "An internal error occurred while processing your message.";
        }
    }


    private void UpdateChatHistory(ISession session, List<Message> messages)
    {
        var encryptedChatHistory = _encryptionHelper.EncryptData(JsonSerializer.Serialize(messages));
        session.SetString("ChatHistory", encryptedChatHistory);
    }

    public async Task<string> MapInvoiceToBasAccountsAsync(InvoiceMapDTO invoice)
    {
        try
        {
            var invoiceDetails = JsonSerializer.Serialize(invoice, new JsonSerializerOptions { WriteIndented = true });
            var userMessage = new Message(
                Role.User,
                $"Using the assistant context, map the following invoice items to BAS accounts. Details:\n\n{invoiceDetails}"
            );

            // Add system message for context
            var systemMessage = new Message(Role.System, "You are a BAS accounting assistant. Map invoice details to BAS accounts.");

            var messages = new List<Message> { systemMessage, userMessage };
            var chatRequest = new ChatRequest(messages, model: "gpt-4o-mini");

            var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);
            return response.FirstChoice?.Message?.Content ?? "No valid response from assistant.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in MapInvoiceToBasAccountsAsync.");
            return "An error occurred while mapping the invoice to BAS accounts.";
        }
    }

    private async Task<string> ProcessCommandAsync(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            _logger.LogWarning("Received an empty or null message for command processing.");
            return null;
        }

        foreach (var command in _commandHandlers)
        {
            try
            {
                if (message.Contains(command.Key, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInformation("Processing command: {Command}", command.Key);
                    var args = ExtractArguments(message, command.Key);
                    return await command.Value(args);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while processing command: {Command}", command.Key);
                return $"Failed to process command: {command.Key}";
            }
        }

        _logger.LogInformation("No matching command found for message: {Message}", message);
        return null;
    }

    private string[] ExtractArguments(string message, string commandKeyword)
    {
        int keywordPosition = message.IndexOf(commandKeyword, StringComparison.OrdinalIgnoreCase);
        if (keywordPosition == -1) return Array.Empty<string>();

        var arguments = message.Substring(keywordPosition + commandKeyword.Length).Trim();
        if (arguments.StartsWith("för ", StringComparison.OrdinalIgnoreCase))
        {
            arguments = arguments.Substring(4).Trim();
        }

        return new[] { arguments };
    }

    public void ClearChatHistory()
    {
        var session = _httpContextAccessor.HttpContext.Session;
        session.Remove("ChatHistory");
    }
}
