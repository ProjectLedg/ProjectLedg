using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngoingInvoiceController : ControllerBase
    {
        private readonly IIngoingInvoiceService _invoiceService;
        private readonly IFormRecognizerService _formService;
        private readonly IBlobStorageService _blobStorageService;
        private readonly ILogger<IngoingInvoiceController> _logger;

        public IngoingInvoiceController(IIngoingInvoiceService invoiceService, IFormRecognizerService formService, IBlobStorageService blobStorageService, ILogger<IngoingInvoiceController> logger)
        {
            _invoiceService = invoiceService;
            _formService = formService;
            _blobStorageService = blobStorageService;
            _logger = logger;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeForm(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var tempFilePath = Path.GetTempFileName(); // Generate a temporary file path
            using (var stream = System.IO.File.Create(tempFilePath))
            {
                await file.CopyToAsync(stream);
            }

            HttpContext.Session.SetString("TempFilePath", tempFilePath);

            var extractedData = await _formService.AnalyzeInvoice(tempFilePath);

            return Ok(extractedData);
        }
        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> SaveIngoingInvoice([FromBody] InvoiceDTO invoiceDto)

        {
            var tempFilePath = HttpContext.Session.GetString("TempFilePath");

            if (string.IsNullOrEmpty(tempFilePath) || !System.IO.File.Exists(tempFilePath))
            {
                return BadRequest("Temporary file not found. Please upload the file again.");
            }

            //var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            //if (string.IsNullOrEmpty(userId))
            //{
            //    return Unauthorized("User not found in token.");
            //}

            var userId = "testUser"; 
            var result = await _invoiceService.SaveIngoingInvoiceAsync(invoiceDto, tempFilePath, userId);

            return Ok(new { message = "Invoice saved successfully!" });
        }

        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> GetInvoice(int invoiceId)
        {
            var invoice = await _invoiceService.GetIngoingInvoiceByIdAsync(invoiceId);
            if (invoice == null)
            {
                return NotFound("Invoice not found.");
            }
            return Ok(invoice);
        }

        [HttpGet("all/Company/{companyId}")]
        public async Task<IActionResult> GetAllIngoingInvoicesForCompanyAsync(int companyId)
        {
            try
            {
                var invoices = await _invoiceService.GetAllIngoingInvoicesForCompanyAsync(companyId);
                if (!invoices.Any())
                {
                    return NotFound("No ingoing invoices found");
                }
                return Ok(invoices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpectd error occurred.", Details = ex.Message });
            }
            
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllIngoingInvoicesAsync();

            var testValue = Environment.GetEnvironmentVariable("LEDGEDB_CONNECTION_STRING");
            _logger.LogCritical($"Test value: {testValue}");
            return Ok(invoices);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDTO invoiceDto)
        {
            var result = await _invoiceService.CreateIngoingInvoiceAsync(invoiceDto);
            if (result == null)
            {
                return StatusCode(500, "An error occurred while creating the invoice.");
            }

            return Ok(new { message = "Invoice created successfully!" });
        }

        [HttpPut("update/{invoiceId}")]
        public async Task<IActionResult> UpdateInvoice(int invoiceId, [FromBody] InvoiceDTO invoiceDto)
        {
            var result = await _invoiceService.UpdateIngoingInvoiceAsync(invoiceId, invoiceDto);
            if (!result)
            {
                return StatusCode(500, "An error occurred while updating the invoice.");
            }

            return Ok(new { message = "Invoice updated successfully!" });
        }

        [HttpDelete("delete/{invoiceId}")]
        public async Task<IActionResult> DeleteInvoice(int invoiceId)
        {
            var result = await _invoiceService.DeleteIngoingInvoiceAsync(invoiceId);
            if (!result)
            {
                return StatusCode(500, "An error occurred while deleting the invoice.");
            }

            return Ok(new { message = "Invoice deleted successfully!" });
        }
    }
}
