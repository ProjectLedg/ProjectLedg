using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;
using System.IO;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PDFController : ControllerBase
    {
        private readonly IPDFService _pdfService;

        public PDFController(IPDFService pdfService)
        {
            _pdfService = pdfService;
        }

        // GET request to generate a simple annual report PDF and return the file for download
        [HttpGet("generatepdf")]
        public IActionResult GenerateAnnualReportPdf()
        {
            // Generate the PDF bytes using the service
            var pdf = _pdfService.GenerateAnnualReportPdf();

            // Return the generated PDF as a file
            return File(pdf, "application/pdf", "AnnualReport.pdf");
        }

        // POST request to generate the PDF and store it on the server
        [HttpPost("generatepdf/{fileName}")]
        public async Task<IActionResult> GenerateAndSavePdf(string fileName)
        {
            // Generate the PDF
            var pdfBytes = _pdfService.GenerateAnnualReportPdf();

            // Define the directory path for saving the PDF
            var pdfDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/pdfs");
            var pdfFileName = $"{fileName}.pdf";  // Use the provided fileName
            var filePath = Path.Combine(pdfDirectory, pdfFileName);

            // Ensure the directory exists
            if (!Directory.Exists(pdfDirectory))
            {
                Directory.CreateDirectory(pdfDirectory);
            }

            // Save the PDF file
            await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);

            // Return the URL to the saved PDF
            var pdfUrl = $"{Request.Scheme}://{Request.Host}/pdfs/{pdfFileName}";
            return Ok(new { pdfUrl });
        }
    }
}
