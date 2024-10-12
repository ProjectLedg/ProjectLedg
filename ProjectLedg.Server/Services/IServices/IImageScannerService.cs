namespace ProjectLedg.Server.Services.IServices
{
    public interface IImageScannerService
    {
        Task<Dictionary<string, string>> ScanImageForText(IFormFile imageFile);
        Task<string> ExtractRawTextFromImage(IFormFile imageFile);
    }
}
