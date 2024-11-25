using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class TransactionController: ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IUserService _userService;

        public TransactionController(ITransactionService transactionService, IUserService userService)
        {
            _transactionService = transactionService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("GetTransactionsForBooking/companyId/{companyId}")]
        public async Task<IActionResult> GetAllTransactionsForBookingAsync(int companyId)
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

            var result = await _transactionService.GetAllTransactionsForBookingAsync(companyId);

            return Ok(result);
        }
    }
}
