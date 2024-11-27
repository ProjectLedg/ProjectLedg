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
        private readonly ILogger<PDFController> _logger;

        public PDFController(IPDFService pdfService, IFormRecognizerService formService, IUserService userService, ILogger<PDFController> logger)
        {
            _pdfService = pdfService;
            _formService = formService;
            _userService = userService;
            _logger = logger;
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
            _logger.LogInformation("Starting GenerateInvoicePdf for request: {@Request}", request);

            try
            {
                // Get claims from JWT and user id from that
                ClaimsPrincipal userClaims = User;
                string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    _logger.LogWarning("User ID not found in claims.");
                    return Unauthorized("No user ID in claims.");
                }

                _logger.LogInformation("User ID from claims: {UserId}", userId);

                // Verify that the company we want data for/from belongs to this user
                _logger.LogInformation("Verifying if company {CompanyId} belongs to user {UserId}.", request.CompanyId, userId);
                var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.CompanyId);

                if (!companyBelongsToUser.Success)
                {
                    _logger.LogWarning("Company {CompanyId} does not belong to user {UserId}. Reason: {Message}",
                        request.CompanyId, userId, companyBelongsToUser.Message);
                    return BadRequest(companyBelongsToUser.Message);
                }

                _logger.LogInformation("Company {CompanyId} verified for user {UserId}.", request.CompanyId, userId);

                // Generate the PDF
                _logger.LogInformation("Calling PDF service to generate invoice PDF for OutgoingInvoiceId: {OutgoingInvoiceId}.", request.OutgoingInvoiceId);

                byte[] pdfBytes = await _pdfService.GenerateInvoicePdf(request);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError("PDF generation returned null or empty byte array for OutgoingInvoiceId: {OutgoingInvoiceId}.", request.OutgoingInvoiceId);
                    return StatusCode(500, "Failed to generate PDF.");
                }

                _logger.LogInformation("PDF generated successfully for OutgoingInvoiceId: {OutgoingInvoiceId}. Returning PDF file.");

                // Return the generated PDF
                return File(pdfBytes, "application/pdf", $"{request.OutgoingInvoiceId}_Invoice.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during GenerateInvoicePdf for OutgoingInvoiceId: {OutgoingInvoiceId}.", request.OutgoingInvoiceId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
