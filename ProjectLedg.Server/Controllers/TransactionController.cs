using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class TransactionController: ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("GetTransactionsForBooking/companyId/{companyId}")]
        public async Task<IActionResult> GetAllTransactionsForBookingAsync(int companyId)
        {
            var result = await _transactionService.GetAllTransactionsForBookingAsync(companyId);

            return Ok(result);
        }
    }
}
