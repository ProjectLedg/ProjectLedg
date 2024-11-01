using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Services;
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
        private readonly IFormRecognizerService _formService;

        public PDFController(IPDFService pdfService, IFormRecognizerService formService)
        {
            _pdfService = pdfService;
            _formService = formService;
        }

        //GET request to generate a simple annual report PDF and return the file for download
        [HttpGet("generatepdf")]
        public IActionResult GenerateAnnualReportPdf()
        {
            //generate the PDF bytes using the service
            var pdf = _pdfService.GenerateAnnualReportPdf();

            //return the generated PDF as a file
            return File(pdf, "application/pdf", "AnnualReport.pdf");
        }

        //POST request to generate the PDF and store it on the server
        [HttpPost("generatepdf/{fileName}")]
        public async Task<IActionResult> GenerateAndSavePdf(string fileName)
        {
            //generate the PDF
            var pdfBytes = _pdfService.GenerateAnnualReportPdf();

            //define the directory path for saving the PDF
            var pdfDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/pdfs");
            var pdfFileName = $"{fileName}.pdf";  // Use the provided fileName
            var filePath = Path.Combine(pdfDirectory, pdfFileName);

            //ensure the directory exists
            if (!Directory.Exists(pdfDirectory))
            {
                Directory.CreateDirectory(pdfDirectory);
            }

            //save the PDF file
            await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);

            //return the URL to the saved PDF
            var pdfUrl = $"{Request.Scheme}://{Request.Host}/pdfs/{pdfFileName}";
            return Ok(new { pdfUrl });
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeForm(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            //save the file to a temporary locations
            var filePath = Path.GetTempFileName();
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            //calling the FormRecognizerService to analyze the file and get the extracted data
            var extractedData = await _formService.AnalyzeInvoice(filePath);

            //return the extracted data as a JSON response
            return Ok(extractedData);
        }

        [HttpPost("generate-invoice-pdf")]
        public async Task<IActionResult> GenerateInvoicePdf([FromBody] OutgoingInvoiceGenerationDTO request)
        {
            

            try
            {
                var pdfBytes = await _pdfService.GenerateInvoicePdf(request);

                return File(pdfBytes, "application/pdf", $"{request.OutgoingInvoiceId}_Invoice.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
