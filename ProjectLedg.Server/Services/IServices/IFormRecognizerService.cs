namespace ProjectLedg.Server.Services.IServices
{
    public interface IFormRecognizerService
    {
        Task AnalyzeForm(string filePath);
    }
}
