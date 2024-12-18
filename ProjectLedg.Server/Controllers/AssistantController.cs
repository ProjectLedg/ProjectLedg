﻿using Microsoft.AspNetCore.Mvc;
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
        [Authorize]
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] string message)
        {
            _logger.LogInformation($"Received message: {message}");
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest("Message cannot be empty.");
            }

            var response = await _assistantService.SendMessageToAssistantAsync(message);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("MapInvoiceDataToBasAccount")]
        public async Task<IActionResult> MapInvoiceDataToBasAccount([FromBody] InvoiceMapDTO invoiceMapData)
        {
            var response = await _assistantService.MapInvoiceToBasAccountsAsync(invoiceMapData);

            return Ok(response);
        }
    }
}
