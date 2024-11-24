using System.Runtime.CompilerServices;

namespace ProjectLedg.Server.Helpers.Commands
{
    public class CommandHelper
    {
        private readonly Dictionary<string, Func<string[], Task<string>>> _commandPatterns;
        private readonly ILogger<CommandHelper> _logger;

        public CommandHelper(ILogger<CommandHelper> logger)
        {
            _commandPatterns = new Dictionary<string, Func<string[], Task<string>>>();
            _logger = logger;
        }

        public void RegisterCommand(string pattern, Func<string[], Task<string>> commandFunction)
        {
            _commandPatterns[pattern] = commandFunction;
        }

        public (string MatchedCommand, string[] ExtractedArgs) MatchIntent(string message)
        {
            foreach (var pattern in _commandPatterns.Keys)
            {
                if (message.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                {
                    var args = ExtractArguments(message, pattern);
                    return (pattern, args);
                }
            }

            return (null, null); // No intent matched
        }

        public async Task<string> ExecuteCommandAsync(string command, string[] args)
        {
            if (_commandPatterns.TryGetValue(command, out var commandFunction))
            {
                return await commandFunction(args);
            }

            return null;
        }

        private string[] ExtractArguments(string message, string commandPattern)
        {
            var argumentString = message.Replace(commandPattern, "").Trim();
            return argumentString.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        }
    }
}
