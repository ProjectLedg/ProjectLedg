﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ProjectLedg.Server.Services.IServices;
using Microsoft.AspNetCore.Authorization;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssistantController : ControllerBase
    {
        private readonly IAssistantService _assistantService;
        private readonly IBasAccountService _basAccountService;

        public AssistantController(IAssistantService assistantService, IBasAccountService basAccountService)
        {
            _assistantService = assistantService;
        }

        //Endpoint to send a message to the assistant and receive a response
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest("Message cannot be empty.");
            }

            var response = await _assistantService.SendMessageToAssistantAsync(message);
            return Ok(response);
        }
    }
}
