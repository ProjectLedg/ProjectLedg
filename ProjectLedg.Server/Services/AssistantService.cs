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
    using ProjectLedg.Server.Helpers.Commands;

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
        private readonly CommandHelper _commandHelper;

        private readonly ILogger<AssistantService> _logger;

        //Functions
        private readonly IBasAccountFunctions _basAccountFunctions;
        private readonly IIngoingInvoiceFunctions _ingoingInvoiceFunctions;
        private readonly ITransactionFunctions _transactionFunctions;
        private readonly IOutgoingInvoiceFunctions _outgoingInvoiceFunctions;


        private readonly Dictionary<string, Func<string[], Task<string>>> _commandHandlers;

        public AssistantService(OpenAIClient openAiClient, ProjectLedgContext dbContext, IHttpContextAccessor httpContextAccessor, IIngoingInvoiceService invoiceService, IBasAccountService basAccountService, EncryptionHelper encryptionHelper, IBasAccountFunctions basAccountFunctions, IIngoingInvoiceFunctions ingoingInvoiceFunctions, ITransactionFunctions transactionFunctions, IOutgoingInvoiceFunctions outgoingInvoiceFunctions, ILogger<AssistantService> logger)
        {
            _openAiClient = openAiClient;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            _ingoingInvoiceService = invoiceService;
            _basAccountService = basAccountService;
            _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");
            _directivesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "AssistantDirectives.txt");
            _encryptionHelper = encryptionHelper;

            //Functions
            _ingoingInvoiceFunctions = ingoingInvoiceFunctions;
            _transactionFunctions = transactionFunctions;
            _basAccountFunctions = basAccountFunctions;
            _outgoingInvoiceFunctions = outgoingInvoiceFunctions;

            _commandHelper = new CommandHelper();

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

            _outgoingInvoiceFunctions = outgoingInvoiceFunctions;
            _logger = logger;
        }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        try
        {
            var session = _httpContextAccessor.HttpContext.Session;

            // Retrieve existing chat history from session, if any
            var chatHistoryEncrypted = session.GetString("ChatHistory");
            _logger.LogInformation("Retrieved chat history from session.");

            var messages = string.IsNullOrEmpty(chatHistoryEncrypted)
                ? new List<Message>()
                : JsonSerializer.Deserialize<List<Message>>(_encryptionHelper.DecryptData(chatHistoryEncrypted));

            // Clear chat history if it exceeds the maximum allowed size
            const int MaxMessages = 20;
            if (messages.Count > MaxMessages)
            {
                _logger.LogWarning("Chat history exceeded max size; truncating messages.");
                messages = messages.TakeLast(MaxMessages).ToList();
            }

            // Check if the message is a command
            var commandResult = await ProcessCommandAsync(message);
            if (commandResult != null)
            {
                _logger.LogInformation("Command processed successfully with result: {CommandResult}", commandResult);

                messages.Add(new Message(Role.Assistant, commandResult));

                // Encrypt and store updated chat history in session
                chatHistoryEncrypted = _encryptionHelper.EncryptData(JsonSerializer.Serialize(messages));
                session.SetString("ChatHistory", chatHistoryEncrypted);

                return commandResult;
            }

            // Ensure system message is added only once per session
            if (!messages.Any(m => m.Role == Role.System))
            {
                _logger.LogInformation("Adding system message with BAS Chart and assistant directives.");
                var basAccounts = LoadBasAccounts();
                var basContext = string.Join("\n", basAccounts.Select(a =>
                    $"Account {a.AccountNumber} ({a.Description}): Debit = {a.Debit}, Credit = {a.Credit}, Year = {a.Year}"));
                var assistantDirectives = LoadAssistantDirectives();

                var systemMessage = new Message(Role.System, $"{assistantDirectives}\n\nBAS Chart:\n{basContext}");
                messages.Insert(0, systemMessage);
            }

            // Add user's message
            _logger.LogInformation("Adding user's message: {UserMessage}", message);
            var userMessage = new Message(Role.User, message);
            messages.Add(userMessage);

            // Limit to recent messages again before sending
            var recentMessages = messages.TakeLast(10).ToList();
            var chatRequest = new ChatRequest(recentMessages, model: "gpt-4o-mini");

            // Process with OpenAI
            _logger.LogInformation("Sending message to OpenAI.");
            var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

            // Convert the response content to a string
            var assistantResponse = response.FirstChoice?.Message?.Content ?? "No valid response from assistant.";
            string assistantResponseString = assistantResponse.ToString();

            // Log the response as a string
            _logger.LogInformation("Received response from OpenAI: {AssistantResponse}", assistantResponseString);

            messages.Add(new Message(Role.Assistant, assistantResponseString));

            // Encrypt and store updated chat history in session
            var encryptedChatHistoryFinal = _encryptionHelper.EncryptData(JsonSerializer.Serialize(messages));
            session.SetString("ChatHistory", encryptedChatHistoryFinal);

            return assistantResponseString;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred in SendMessageToAssistantAsync.");
            return "An internal error occurred while processing your message.";
        }
    }



    public void ClearChatHistory()
        {
            var session = _httpContextAccessor.HttpContext.Session;
            session.Remove("ChatHistory");
        }


        private async Task<string> ProcessCommandAsync(string message)
        {
            foreach (var command in _commandHandlers)
            {
                if (message.Contains(command.Key, StringComparison.OrdinalIgnoreCase))
                {
                    // Extract arguments using the updated method
                    var args = ExtractArguments(message, command.Key);

                    // Handle company name or ID dynamically
                    if (int.TryParse(args[0], out int companyId))
                    {
                        // Company ID is provided, call the command directly
                        return await command.Value(new[] { companyId.ToString() });
                    }
                    else
                    {
                        // Company name is provided; lookup the company by name with case-insensitivity
                        var companyName = args[0].ToLower();
                        var company = await _dbContext.Companies
                            .FirstOrDefaultAsync(c => c.CompanyName.ToLower() == companyName);

                        if (company == null)
                        {
                            var allCompanies = await _dbContext.Companies
                                .Select(c => c.CompanyName)
                                .ToListAsync();

                            return $"Företaget med namnet '{args[0]}' hittades inte. Tillgängliga företag är: {string.Join(", ", allCompanies)}.";
                        }

                        return await command.Value(new[] { company.Id.ToString() });
                    }
                }
            }
            return null; // Return null if no command matches
        }


        private string[] ExtractArguments(string message, string commandKeyword)
        {
            // Find the position of the command keyword in the message
            int keywordPosition = message.IndexOf(commandKeyword, StringComparison.OrdinalIgnoreCase);
            if (keywordPosition == -1)
            {
                return Array.Empty<string>();
            }

            // Extract everything after the command keyword
            string arguments = message.Substring(keywordPosition + commandKeyword.Length).Trim();

            // Remove the "för" keyword and any extra spaces that may follow it
            if (arguments.StartsWith("för ", StringComparison.OrdinalIgnoreCase))
            {
                arguments = arguments.Substring(4).Trim();
            }

            // Return the cleaned-up argument as a single-element array
            return new[] { arguments };
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
    }
