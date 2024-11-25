using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : ControllerBase
    {
        private readonly IBlobStorageService _blobStorageService;

        public BlobController(IBlobStorageService blobStorageService)
        {
            _blobStorageService = blobStorageService;
        }

        [Authorize]
        [HttpPost("UploadBlob")]
        public async Task<IActionResult> UploadBlob(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Get the file stream and file name
            using (var stream = file.OpenReadStream())
            {
                var blobName = file.FileName; // You can customize the blob name as needed

                // Upload the file to blob storage
                var blobUrl = await _blobStorageService.UploadBlobAsync(stream, blobName);

                return Ok(new { blobUrl });
            }
        }
    }
}
