using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs;
using ProjectLedg.Server.Services.IServices;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportTicketsController : ControllerBase
    {
        private readonly ISupportTicketService _supportTicketService;
        private readonly IBlobStorageService _blobStorageService;
        private readonly ProjectLedgContext _context;

        public SupportTicketsController(ISupportTicketService supportTicketService, IBlobStorageService blobStorageService, ProjectLedgContext context)
        {
            _supportTicketService = supportTicketService;
            _blobStorageService = blobStorageService;
            _context = context;
        }

        // Authroized to only allow logged in users
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] SupportTicketCreationDTO ticketDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("User not authenticated");

            if (!ticketDto.CompanyId.HasValue)
                return BadRequest("CompanyId is required for creating a support ticket.");

            var userCompany = await _context.Companies
                .Where(c => c.Id == ticketDto.CompanyId && c.Users.Any(u => u.Id == userId))
                .FirstOrDefaultAsync();

            if (userCompany == null)
                return BadRequest("The selected company is not associated with the user");

            var ticket = new SupportTicket
            {
                Category = (ProjectLedg.Server.Data.Models.Category)ticketDto.Category,
                Subject = ticketDto.Subject,
                Description = ticketDto.Description,
                UserId = userId,
                Company = userCompany,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };

            if (ticketDto.Image != null && ticketDto.Image.Length > 0)
            {
                using (var stream = ticketDto.Image.OpenReadStream())
                {
                    string fileName = $"{ticketDto.Subject}_{Path.GetRandomFileName()}";
                    string imageUrl = await _blobStorageService.UploadBlobAsync(stream, fileName);
                    ticket.ImageUrl = imageUrl;
                }
            }

            var createdTicket = await _supportTicketService.CreateTicketAsync(ticket, ticketDto.CompanyId.Value);

            // Map to response DTO
            var responseDto = new Data.Models.DTOs.SupportTicket.SupportTicketResponseDTO
            {
                TicketId = createdTicket.TicketId,
                Subject = createdTicket.Subject,
                Description = createdTicket.Description,
                Category = createdTicket.Category.ToString(),
                Priority = createdTicket.Priority,
                Status = createdTicket.Status,
                ImageUrl = createdTicket.ImageUrl,
                CreatedAt = createdTicket.CreatedAt,
                CompanyId = createdTicket.Company.Id,
            };

            return Ok(responseDto);
        }



        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _supportTicketService.GetAllTicketsAsync();
            return Ok(tickets);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] string status)
        {
            try
            {
                await _supportTicketService.UpdateTicketStatusAsync(id, status);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _context.SupportTickets
                .Include(t => t.Company)
                .FirstOrDefaultAsync(t => t.TicketId == id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        [HttpGet("statistics/open")]
        public async Task<IActionResult> GetOpenTicketsCount()
        {
            var count = await _supportTicketService.GetOpenTicketsCountAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("statistics/in-progress")]
        public async Task<IActionResult> GetInProgressTicketsCount()
        {
            var count = await _supportTicketService.GetInProgressTicketsCountAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("statistics/closed")]
        public async Task<IActionResult> GetClosedTicketsCount([FromQuery] string timeframe)
        {
            TimeSpan timeSpan = timeframe.ToLower() switch
            {
                "24h" => TimeSpan.FromHours(24),
                "week" => TimeSpan.FromDays(7),
                "month" => TimeSpan.FromDays(30),
                _ => throw new ArgumentException("Invalid timeframe. Use '24h', 'week', or 'month'.")
            };
            var count = await _supportTicketService.GetClosedTicketsCountAsync(timeSpan);
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("statistics/most-common-category")]
        public async Task<IActionResult> GetMostCommonCategory()
        {
            var categories = await _supportTicketService.GetMostCommonCategoryAsync();
            return Ok(categories);
        }

        [HttpGet("statistics/priority")]
        public async Task<IActionResult> GetTicketsCountByPriority([FromQuery] string status)
        {
            var priorityCounts = await _supportTicketService.GetTicketsCountByPriorityAsync(status);
            return Ok(priorityCounts);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandomTicket()
        {
            var ticket = await _supportTicketService.GetPrioritizedRandomTicketAsync();
            if (ticket == null)
                return NotFound("No open tickets available.");
            return Ok(ticket);
        }

        [HttpPost("{id}/respond")]
        public async Task<IActionResult> RespondToTicket(int id, [FromBody] string message)
        {
            try
            {
                await _supportTicketService.RespondToTicketAsync(id, message);
                return Ok("Response sent successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/close")]
        public async Task<IActionResult> CloseTicket(int id)
        {
            try
            {
                await _supportTicketService.CloseTicketAsync(id);
                return Ok("Ticket closed successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
