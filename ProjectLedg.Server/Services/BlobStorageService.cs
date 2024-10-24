using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB size limit
        private readonly string _apiKey;

        // Constructor receives connectionString and containerName as arguments
        public BlobStorageService(string connectionString, string containerName, string apiKey)
        {
            _containerName = containerName;
            _blobServiceClient = new BlobServiceClient(connectionString);
            _apiKey = apiKey;
        }
        public async Task<string> UploadBlobAsync(Stream fileStream, string fileName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(fileName);

            // Upload the stream
            await blobClient.UploadAsync(fileStream, overwrite: true);

            // Build a SAS URL (Secured Access Signature)
            var sasBuilder = new BlobSasBuilder(BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddYears(100))
            {
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-15) // Make SAS effective immediately
            };

            // Generate a secure URL for the blob
            var sasUri = blobClient.GenerateSasUri(sasBuilder);

            return sasUri.AbsoluteUri;
        }
    }
}
