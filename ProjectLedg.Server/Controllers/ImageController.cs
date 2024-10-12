using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.PDF;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageScannerService _imageScannerService;

        public ImageController(IImageScannerService imageScannerService)
        {
            _imageScannerService = imageScannerService;
        }

        [HttpPost]
        public async Task<IActionResult> ScanImageForText([FromForm] InvoiceUploadDTO dto)
        {
            if (dto == null || dto.InvoiceFile == null || dto.InvoiceFile.Length == 0)
            {
                return BadRequest("No image file uploaded.");
            }

            //scan the image and get the extracted data
            var extractedData = await _imageScannerService.ScanImageForText(dto.InvoiceFile);

            if (extractedData == null || extractedData.Count == 0)
            {
                return StatusCode(500, "Failed to extract text from the image.");
            }

            //returning the Data as JSOn
            return Ok(new { extractedData });
        }

        [HttpPost("extract-raw-text")]
        public async Task<IActionResult> ExtractRawTextFromImage([FromForm] InvoiceUploadDTO dto)
        {
            if (dto == null || dto.InvoiceFile == null || dto.InvoiceFile.Length == 0)
            {
                return BadRequest("No image file uploaded.");
            }

            try
            {
                //call the service to extract raw text
                var rawText = await _imageScannerService.ExtractRawTextFromImage(dto.InvoiceFile);

                //print the raw text to the console (or return it in the response)
                Console.WriteLine("Extracted Text:");
                Console.WriteLine(rawText);

                return Ok(new { extractedText = rawText });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
