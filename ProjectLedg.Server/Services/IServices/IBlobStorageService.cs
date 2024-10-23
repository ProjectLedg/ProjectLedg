namespace ProjectLedg.Server.Services.IServices
{
    public interface IBlobStorageService
    {
        Task<string> UploadBlobAsync(Stream fileStream, string fileName);
    }
}
