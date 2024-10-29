namespace ProjectLedg.Server.Services.IServices
{
    public interface IAssistantService
    {
        Task<string> SendMessageToAssistantAsync(string message);
    }
}
