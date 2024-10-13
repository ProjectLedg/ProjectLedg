using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectLedg.Server.Data.Models.DTOs.Transaction;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        //GET:api/transaction/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDTO>> GetTransactionById(int id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        //GET:api/transaction
        [HttpGet]
        public async Task<ActionResult<List<TransactionDTO>>> GetAllTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        //POST:api/transaction
        [HttpPost]
        public async Task<ActionResult<TransactionDTO>> CreateTransaction([FromBody] TransactionCreationDTO transactionDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var transaction = await _transactionService.CreateTransactionAsync(transactionDto);
            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
        }

        //PUT:api/transaction/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] TransactionUpdateDTO transactionDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            transactionDto.Id = id;
            await _transactionService.UpdateTransactionAsync(transactionDto);
            return NoContent();
        }

        //DELETE:api/transaction/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            await _transactionService.DeleteTransactionAsync(id);
            return NoContent();
        }

        //POST:api/transaction/calculate
        [HttpPost("calculate")]
        public ActionResult<decimal> CalculateProfitability([FromBody] List<TransactionDTO> transactions)
        {
            var profitability = _transactionService.CalculateProfitability(transactions);
            return Ok(profitability);
        }
    }
}
