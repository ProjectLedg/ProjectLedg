using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PDFController : ControllerBase
    {
        private readonly IPDFService _pdfService;
        private readonly IFormRecognizerService _formService;
        private readonly IUserService _userService;

        public PDFController(IPDFService pdfService, IFormRecognizerService formService, IUserService userService)
        {
            _pdfService = pdfService;
            _formService = formService;
            _userService = userService;
        }

        //GET request to generate a simple annual report PDF and return the file for download
        [Authorize]
        [HttpPost("generate-annual-report")]
        public async Task<IActionResult> GenerateAnnualReportPdf([FromBody] AnnualReportGenerateToPdfDTO request)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.AnualReportRequest.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);


            //generate the PDF bytes using the service
            var pdf = await _pdfService.GenerateAnnualReportPdf(request);
            var currentYear = System.DateTime.Now.Year;

            //return the generated PDF as a file
            return File(pdf, "application/pdf", $"{currentYear}AnnualReport.pdf");
        }

        ////POST request to generate the PDF and store it on the server
        //[HttpPost("generatepdf/{fileName}")]
        //public async Task<IActionResult> GenerateAndSavePdf(string fileName)
        //{
        //    var temprequest = new FinanceRequestDTO { CompanyId = 1, Year = 2021 };

        //    //generate the PDF
        //    var pdfBytes = await _pdfService.GenerateAnnualReportPdf(temprequest);

        //    //define the directory path for saving the PDF
        //    var pdfDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/pdfs");
        //    var pdfFileName = $"{fileName}.pdf";  // Use the provided fileName
        //    var filePath = Path.Combine(pdfDirectory, pdfFileName);

        //    //ensure the directory exists
        //    if (!Directory.Exists(pdfDirectory))
        //    {
        //        Directory.CreateDirectory(pdfDirectory);
        //    }

        //    //save the PDF file
        //    await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);

        //    //return the URL to the saved PDF
        //    var pdfUrl = $"{Request.Scheme}://{Request.Host}/pdfs/{pdfFileName}";
        //    return Ok(new { pdfUrl });
        //}

        [Authorize]
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

        [Authorize]
        [HttpPost("generate-invoice-pdf")]
        public async Task<IActionResult> GenerateInvoicePdf([FromBody] OutgoingInvoiceGenerationDTO request)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);


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
