using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.BasAccount;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class BasAccountController : ControllerBase
    {
        private readonly IBasAccountService _basAccountService;
        private readonly IIngoingInvoiceService _ingoingInvoiceService;

        public BasAccountController(IBasAccountService basAccountService, IIngoingInvoiceService ingoingInvoiceService)
        {
            _basAccountService = basAccountService;
            _ingoingInvoiceService = ingoingInvoiceService;
        }


        // TODO: ADD AUTHORIZATION WHEN WERE DONE TESTING
        [HttpPost("")]
        public async Task<IActionResult> ProcessInvoiceWithBasAccounts([FromBody] InvoiceAndBasAccountDto invBaAccDto)
        {

            var invoice = await _ingoingInvoiceService.CreateIngoingInvoiceAsync(invBaAccDto.Invoice);
            if (invoice == null)
                return BadRequest("Failed to create invoice");

            var basAccountResult = _basAccountService.AddBasAccountsToCompanyAsync(invBaAccDto.Accounts, invoice, invBaAccDto.CompanyId);
            if (basAccountResult == null)
                return BadRequest("Failed to create BAS Account");

            return Ok("Invoice created and mapped to BAS Accounts");
        }

    }
}
