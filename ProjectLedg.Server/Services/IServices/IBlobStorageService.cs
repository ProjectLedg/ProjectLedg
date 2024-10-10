using Azure.Storage.Blobs;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IBlobStorageService
    {
        Task<string> UploadBlobAsync(IFormFile file);
    }
}
