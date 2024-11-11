namespace ProjectLedg.Server.Options.Newsletter
{
    public class TargetedEmailRequest
    {
        public List<string> UserIds { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}
