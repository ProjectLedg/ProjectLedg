using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ProjectLedg.Server.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using ProjectLedg.Server.Data.Models.DTOs;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssistantController : ControllerBase
    {
        private readonly IAssistantService _assistantService;
        private readonly IBasAccountService _basAccountService;
        private readonly ILogger<AssistantController> _logger;

        public AssistantController(IAssistantService assistantService, IBasAccountService basAccountService, ILogger<AssistantController> logger)
        {
            _assistantService = assistantService;
            _logger = logger;
        }

        //Endpoint to send a message to the assistant and receive a response
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] string message)
        {
            _logger.LogInformation("Received message: {Message}", message);

            if (string.IsNullOrWhiteSpace(message))
            {
                _logger.LogWarning("Empty message received in Chat endpoint.");
                return BadRequest("Message cannot be empty.");
            }

            try
            {
                // Call the AssistantService to process the message
                var response = await _assistantService.SendMessageToAssistantAsync(message);

                if (string.IsNullOrEmpty(response))
                {
                    _logger.LogWarning("Received empty response from AssistantService.");
                    return Ok(new { response = "No response from the assistant. Please try again.", intentMatched = false });
                }

                _logger.LogInformation("Assistant response: {Response}", response);
                return Ok(new { response, intentMatched = true }); // Assume intent matches if response is non-empty
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in the Chat endpoint while processing the message.");
                return StatusCode(500, new { error = "An internal error occurred while processing your request." });
            }
        }


        [HttpPost("MapInvoiceDataToBasAccount")]
        public async Task<IActionResult> MapInvoiceDataToBasAccount([FromBody] InvoiceMapDTO invoiceMapData)
        {
            var response = await _assistantService.MapInvoiceToBasAccountsAsync(invoiceMapData);

            return Ok(response);
        }
    }
}
