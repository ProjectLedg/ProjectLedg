using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly string _containerName;
        private readonly string _connectionString;
        private const long MaxFileSize = 10 * 1024 * 1024;

        public BlobStorageService(string connectionString, string containerName)
        {
            _connectionString = connectionString; 
            _containerName = containerName;      

            _blobServiceClient = new BlobServiceClient(connectionString);
            _blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);

            try
            {
                _blobContainerClient.CreateIfNotExists(); // only create the container if it doesnt exist
            }
            catch (Azure.RequestFailedException ex) when (ex.Status == 409)
            {
                Console.WriteLine("Container already exists, continuing...");
            }
        }

        //public async Task<string> UploadBlobAsync(IFormFile file)
        //{
        //    if (file.Length > MaxFileSize)
        //    {
        //        throw new InvalidOperationException($"Filstorleken överskrider: {MaxFileSize / (1024 * 1024)} MB.");
        //    }

        //    //generates a unique filename for the uploaded file
        //    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        //    var blobClient = _blobContainerClient.GetBlobClient(fileName);

        //    // upload the file to Azure Blob Storage
        //    using (var stream = file.OpenReadStream())
        //    {
        //        await blobClient.UploadAsync(stream, overwrite: true);
        //    }

        //    //check if the blob client can generate a SAS URI
        //    if (blobClient.CanGenerateSasUri)
        //    {
        //        // create sas with read permissions
        //        var sasBuilder = new BlobSasBuilder
        //        {
        //            BlobContainerName = _blobContainerClient.Name,
        //            BlobName = blobClient.Name,
        //            Resource = "b",
        //            ExpiresOn = DateTimeOffset.UtcNow.AddYears(100),
        //            StartsOn = DateTimeOffset.UtcNow.AddMinutes(-15)
        //        };

        //        // grants read permissions
        //        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        //        // generate the SAS URI and return it
        //        Uri sasUri = blobClient.GenerateSasUri(sasBuilder);
        //        return sasUri.AbsoluteUri;
        //    }
        //    else
        //    {
        //        throw new InvalidOperationException("SAS generation is not enabled for this blob.");
        //    }
        //}


        //testing towards Azurite instead for now

        public async Task<string> UploadBlobAsync(IFormFile file)
        {
            if (file.Length > MaxFileSize)
            {
                throw new InvalidOperationException($"File size exceeds the limit of {MaxFileSize / (1024 * 1024)} MB.");
            }

            // generate a unique name for the file
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var blobClient = _blobContainerClient.GetBlobClient(fileName);

            //upload the file to Azure Blob Storage (Azurite in your case)
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // instead of generating a SAS token, return the local URL to the blob
            // this URL will work locally with Azurite
            var blobUrl = $"{_blobServiceClient.Uri}/{_containerName}/{fileName}";

            return blobUrl; 
        }

    }
}
