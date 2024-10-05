namespace ProjectLedg.Server.Options
{
    public class AccountCreationResult
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        //To support multiple errorMessages
        public IEnumerable<string>? Errors { get; set; }
    }
}
