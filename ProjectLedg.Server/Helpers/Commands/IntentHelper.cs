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
        _logger.LogInformation("Extracting parameters for intent: '{Intent}' from input: '{UserInput}'", intent, userInput);

        var normalizedIntent = intent.ToLowerInvariant().Trim();
        var normalizedInput = userInput.ToLowerInvariant().Trim();

        if (normalizedInput.StartsWith(normalizedIntent))
        {
            var remainingInput = normalizedInput.Substring(normalizedIntent.Length).Trim();

            if (remainingInput.StartsWith("för", StringComparison.OrdinalIgnoreCase))
            {
                remainingInput = remainingInput.Substring(3).Trim();
            }

            _logger.LogInformation("Extracted parameters: {RemainingInput}", remainingInput);
            return string.IsNullOrWhiteSpace(remainingInput) ? null : new[] { remainingInput };
        }

        _logger.LogWarning("No parameters extracted. Intent '{Intent}' did not match input.", intent);
        return null;
    }
}
