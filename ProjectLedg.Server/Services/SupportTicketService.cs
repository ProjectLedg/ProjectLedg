using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class SupportTicketService : ISupportTicketService
    {
        private readonly ISupportTicketRepository _supportTicketRepository;

        public SupportTicketService(ISupportTicketRepository supportTicketRepository)
        {
            _supportTicketRepository = supportTicketRepository;
        }

        public async Task<SupportTicket> CreateTicketAsync(SupportTicket ticket, int companyId)
        {
            // Set priority based on the category
            ticket.Priority = DeterminePriority(ticket.Category);
            ticket.CreatedAt = DateTime.UtcNow;
            ticket.Status = "Open";

            // Save the ticket via repository
            return await _supportTicketRepository.CreateTicketAsync(ticket);
        }

        private string DeterminePriority(Category category)
        {
            return category switch
            {
                Category.Technical or Category.ProductSupport or Category.Billing => "High",
                Category.AccountManagement => "Medium",
                Category.GeneralInquiry or Category.Feedback => "Low",
                _ => "Low" // default priority if category is undefined
            };
        }

        public async Task<IEnumerable<SupportTicket>> GetAllTicketsAsync()
        {
            return await _supportTicketRepository.GetAllTicketsAsync();
        }

        public async Task<SupportTicket> GetTicketByIdAsync(int ticketId)
        {
            return await _supportTicketRepository.GetTicketByIdAsync(ticketId);
        }

        public async Task UpdateTicketStatusAsync(int ticketId, string status)
        {
            // Perform status validation if needed
            if (status == "Open" || status == "In Progress" || status == "Closed")
            {
                await _supportTicketRepository.UpdateTicketStatusAsync(ticketId, status);
            }
            else
            {
                throw new ArgumentException("Invalid status");
            }
        }
    }
}
