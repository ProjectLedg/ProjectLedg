using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.BasAccount;
using ProjectLedg.Server.Services;
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
        private readonly IUserService _userService;

        public BasAccountController(IBasAccountService basAccountService, IIngoingInvoiceService ingoingInvoiceService, IUserService userService)
        {
            _basAccountService = basAccountService;
            _ingoingInvoiceService = ingoingInvoiceService;
            _userService = userService;
        }

        [Authorize]
        [HttpPost("ProcessInvoiceWithBasAccounts")]
        public async Task<IActionResult> ProcessInvoiceWithBasAccounts([FromBody] InvoiceAndBasAccountDto invBaAccDto)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, invBaAccDto.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var invoice = await _ingoingInvoiceService.CreateIngoingInvoiceAsync(invBaAccDto.Invoice);
            if (invoice == null)
                return BadRequest("Failed to create invoice");

            var basAccountResult = await _basAccountService.AddBasAccountsToCompanyAsync(invBaAccDto.Accounts, invoice, invBaAccDto.CompanyId);
            if (basAccountResult.Success == true)
                return Ok("Invoice created and mapped to BAS Accounts");

            return BadRequest($"Failed to create BAS Account: {basAccountResult.Message}");

        }

    }
}
