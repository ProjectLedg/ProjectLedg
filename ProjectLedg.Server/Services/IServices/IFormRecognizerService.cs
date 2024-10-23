namespace ProjectLedg.Server.Services.IServices
{
    public interface IFormRecognizerService
    {
        Task<Dictionary<string, object>> AnalyzeInvoice(string filePath);
    }
}
