using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Helpers.File_Compressor;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.ComponentModel.Design;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngoingInvoiceController : ControllerBase
    {
        private readonly IIngoingInvoiceService _invoiceService;
        private readonly IFormRecognizerService _formService;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IUserService _userService;
        private readonly ILogger<IngoingInvoiceController> _logger;

        public IngoingInvoiceController(IIngoingInvoiceService invoiceService, IFormRecognizerService formService, IBlobStorageService blobStorageService, ILogger<IngoingInvoiceController> logger, IUserService userService)
        {
            _invoiceService = invoiceService;
            _formService = formService;
            _blobStorageService = blobStorageService;
            _logger = logger;
            _userService = userService;
        }

        [Authorize]
        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeForm(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            //Get the original file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (fileExtension != ".pdf" && fileExtension != ".jpg" && fileExtension != ".jpeg" && fileExtension != ".png")
            {
                return BadRequest($"Unsupported file type: {fileExtension}. Only PDFs and images (.jpg, .jpeg, .png) are supported.");
            }

            //Generate a temporary file path with the correct extension
            var tempFileName = $"{Path.GetRandomFileName()}{fileExtension}";
            var tempFilePath = Path.Combine(Path.GetTempPath(), tempFileName);
            string processedFilePath = tempFilePath;

            try
            {
                // Save the uploaded file with the correct extension
                using (var stream = System.IO.File.Create(tempFilePath))
                {
                    await file.CopyToAsync(stream);
                }

                Console.WriteLine($"Temp file created at: {tempFilePath}");

                if (fileExtension == ".pdf")
                {
                    //Compress the PDF using Ghostscript
                    processedFilePath = FileCompressor.CompressPdfWithGhostscript(tempFilePath);
                    Console.WriteLine($"Compressed PDF created at: {processedFilePath}");
                }
                else if (fileExtension == ".jpg" || fileExtension == ".jpeg" || fileExtension == ".png")
                {
                    //Compress large image files
                    processedFilePath = ImageCompressor.CompressImage(tempFilePath);
                    Console.WriteLine($"Compressed image created at: {processedFilePath}");
                }

                //Analyze the processed file
                var extractedData = await _formService.AnalyzeInvoice(processedFilePath);

                return Ok(extractedData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return BadRequest($"An error occurred: {ex.Message}");
            }
            finally
            {
                //Clean up temporary files
                if (System.IO.File.Exists(tempFilePath)) System.IO.File.Delete(tempFilePath);
                if (processedFilePath != tempFilePath && System.IO.File.Exists(processedFilePath))
                {
                    System.IO.File.Delete(processedFilePath);
                }
            }
        }

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> SaveIngoingInvoice([FromBody] InvoiceDTO invoiceDto)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, invoiceDto.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);


            var tempFilePath = HttpContext.Session.GetString("TempFilePath");

            if (string.IsNullOrEmpty(tempFilePath) || !System.IO.File.Exists(tempFilePath))
            {
                return BadRequest("Temporary file not found. Please upload the file again.");
            }

            var result = await _invoiceService.SaveIngoingInvoiceAsync(invoiceDto, tempFilePath, userId);

            return Ok(new { message = "Invoice saved successfully!" });
        }

        [Authorize]
        [HttpGet("all/Company/{companyId}")]
        public async Task<IActionResult> GetAllIngoingInvoicesForCompanyAsync(int companyId)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, companyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);


            try
            {
                var invoices = await _invoiceService.GetAllIngoingInvoicesForCompanyAsync(companyId);
                if (!invoices.Any())
                {
                    return NotFound("No ingoing invoices found");
                }

                List<InvoiceDTO> invoiceListDto = new List<InvoiceDTO>();
                foreach (var invoice in invoices) {

                    InvoiceDTO invoiceDto = new InvoiceDTO
                    {
                        CompanyId = invoice.CompanyId,
                        InvoiceNumber = invoice.InvoiceNumber,
                        InvoiceDate = invoice.InvoiceDate,
                        DueDate = invoice.DueDate,
                        InvoiceTotal = invoice.InvoiceTotal,
                        InvoiceFilePath = invoice.InvoiceFilePath,
                        CustomerAddress = invoice.CustomerAddress,
                        CustomerAddressRecipient = invoice.CustomerAddressRecipient,
                        VendorAddress = invoice.VendorAddress,
                        VendorAddressRecipient = invoice.VendorAddressRecipient,
                        CustomerId = invoice.CustomerId,
                        CustomerName = invoice.CustomerName,
                        IsBooked = invoice.IsBooked,
                        IsOutgoing = invoice.IsBooked,
                        IsPaid = invoice.IsPaid,
                        PaymentDetails = invoice.PaymentDetails,
                        TotalTax = invoice.TotalTax,
                        VendorName = invoice.VendorName,
                        VendorTaxId = invoice.VendorTaxId,
                        Items = invoice.Items.Select(i => new InvoiceItemDTO
                        {
                            Amount = i.Amount,
                            Description = i.Description,
                            Quantity = i.Quantity,
                            UnitPrice = i.UnitPrice,
                        }).ToList()
                    };   
                    invoiceListDto.Add(invoiceDto);
                }

                return Ok(invoiceListDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpectd error occurred.", Details = ex.Message });
            }
            
        }

        // Only accessible for Admins and not users - there already exists methods and endpoints to get all and specific invoices for companies
        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllIngoingInvoicesAsync();

            var testValue = Environment.GetEnvironmentVariable("LEDGEDB_CONNECTION_STRING");
            _logger.LogCritical($"Test value: {testValue}");
            return Ok(invoices);
        }


        [Authorize]
        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> GetInvoice(int invoiceId)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the invoice we want to access belongs to this user
            var invoiceBelongsToUser = await _userService.VerifyInvoiceBelongsToUserAsync(userId, invoiceId);
            if (!invoiceBelongsToUser.Success)
                return BadRequest(invoiceBelongsToUser.Message);

            var invoice = await _invoiceService.GetIngoingInvoiceByIdAsync(invoiceId);
            if (invoice == null)
            {
                return NotFound("Invoice not found.");
            }
            return Ok(invoice);
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDTO invoiceDto)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, invoiceDto.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var result = await _invoiceService.CreateIngoingInvoiceAsync(invoiceDto);
            if (result == null)
            {
                return StatusCode(500, "An error occurred while creating the invoice.");
            }

            return Ok(new { message = "Invoice created successfully!" });
        }

        [Authorize]
        [HttpPut("update/{invoiceId}")]
        public async Task<IActionResult> UpdateInvoice(int invoiceId, [FromBody] InvoiceDTO invoiceDto)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, invoiceDto.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            // Verify that the invoice we want to delete belongs to this user
            var invoiceBelongsToUser = await _userService.VerifyInvoiceBelongsToUserAsync(userId, invoiceId);
            if (!invoiceBelongsToUser.Success)
                return BadRequest(invoiceBelongsToUser.Message);

            var result = await _invoiceService.UpdateIngoingInvoiceAsync(invoiceId, invoiceDto);
            if (!result)
            {
                return StatusCode(500, "An error occurred while updating the invoice.");
            }

            return Ok(new { message = "Invoice updated successfully!" });
        }

        [Authorize]
        [HttpDelete("delete/{invoiceId}")]
        public async Task<IActionResult> DeleteInvoice(int invoiceId)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the invoice we want to delete belongs to this user
            var invoiceBelongsToUser = await _userService.VerifyInvoiceBelongsToUserAsync(userId, invoiceId);
            if (!invoiceBelongsToUser.Success)
                return BadRequest(invoiceBelongsToUser.Message);

            var result = await _invoiceService.DeleteIngoingInvoiceAsync(invoiceId);
            if (!result)
            {
                return StatusCode(500, "An error occurred while deleting the invoice.");
            }

            return Ok(new { message = "Invoice deleted successfully!" });
        }
    }
}
