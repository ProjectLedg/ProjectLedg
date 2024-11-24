public class IntentHelper
{
    private readonly Dictionary<string, Func<string[], Task<string>>> _commands;
    private readonly ILogger<IntentHelper> _logger;

    public IntentHelper(ILogger<IntentHelper> logger)
    {
        _commands = new Dictionary<string, Func<string[], Task<string>>>();
        _logger = logger;
    }

    public void RegisterCommand(string intent, Func<string[], Task<string>> command)
    {
        _logger.LogInformation("Registering intent: {Intent}", intent);
        _commands[intent.ToLowerInvariant().Trim()] = command;
    }


    public async Task<string> ProcessIntentAsync(string userInput)
    {
        _logger.LogInformation("Processing user input: {UserInput}", userInput);

        foreach (var (intent, command) in _commands)
        {
            _logger.LogInformation("Checking intent: {Intent} against input: {UserInput}", intent, userInput);

            var parameters = ExtractParameters(intent, userInput);
            if (parameters != null)
            {
                _logger.LogInformation("Matched intent: {Intent} with parameters: {Parameters}", intent, parameters);
                return await command(parameters);
            }
        }

        _logger.LogWarning("No intent matched for input: {UserInput}", userInput);
        return null;
    }

    private string[] ExtractParameters(string intent, string userInput)
    {
        _logger.LogInformation("Attempting to extract parameters for intent: {Intent} from input: {UserInput}", intent, userInput);

        var normalizedIntent = intent.Trim().ToLowerInvariant();
        var normalizedInput = userInput.Trim().ToLowerInvariant();

        if (normalizedInput.StartsWith(normalizedIntent, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogInformation("Intent '{Intent}' matched the input.", intent);

            // Extract parameters
            var remainingInput = normalizedInput.Substring(normalizedIntent.Length).Trim();

            if (remainingInput.StartsWith("för", StringComparison.OrdinalIgnoreCase))
            {
                remainingInput = remainingInput.Substring(3).Trim(); // Remove "för"
            }

            var parameters = remainingInput.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);
            _logger.LogInformation("Extracted parameters: {Parameters}", parameters);
            return parameters.Length > 0 ? parameters : null;
        }

        _logger.LogWarning("Intent '{Intent}' did not match the input.", intent);
        return null;
    }
}
