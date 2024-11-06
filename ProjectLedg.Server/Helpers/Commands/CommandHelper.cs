namespace ProjectLedg.Server.Helpers.Commands
{
    public class CommandHelper
    {
        private readonly Dictionary<string, Func<string[], Task<string>>> _commandPatterns;

        public CommandHelper()
        {
            _commandPatterns = new Dictionary<string, Func<string[], Task<string>>>();
        }

        //Method to dynamically add commands
        public void RegisterCommand(string pattern, Func<string[], Task<string>> commandFunction)
        {
            _commandPatterns[pattern] = commandFunction;
        }

        //Method to remove commands if needed
        public void UnregisterCommand(string pattern)
        {
            _commandPatterns.Remove(pattern);
        }

        public async Task<string> ProcessCommandAsync(string message)
        {
            foreach (var pattern in _commandPatterns)
            {
                if (message.Contains(pattern.Key, StringComparison.OrdinalIgnoreCase))
                {
                    var args = ExtractArguments(message, pattern.Key);
                    return await pattern.Value(args);
                }
            }

            return "Kommandot kunde inte tolkas. Försök igen med ett annat kommando.";
        }

        private string[] ExtractArguments(string message, string commandPattern)
        {
            var argumentString = message.Replace(commandPattern, "").Trim();
            return argumentString.Split(' ');
        }
    }
}
