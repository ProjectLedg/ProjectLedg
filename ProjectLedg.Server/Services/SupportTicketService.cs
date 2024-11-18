using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class SupportTicketService : ISupportTicketService
    {
        private readonly ISupportTicketRepository _supportTicketRepository;
        private readonly IEmailSender _emailSender;

        public SupportTicketService(ISupportTicketRepository supportTicketRepository, IEmailSender emailSender)
        {
            _supportTicketRepository = supportTicketRepository;
            _emailSender = emailSender;
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
        public async Task<int> GetOpenTicketsCountAsync()
        {
            return await _supportTicketRepository.CountTicketsByStatusAsync("Open");
        }

        public async Task<int> GetInProgressTicketsCountAsync()
        {
            return await _supportTicketRepository.CountTicketsByStatusAsync("In Progress");
        }

        public async Task<int> GetClosedTicketsCountAsync(TimeSpan timeSpan)
        {
            var sinceDate = DateTime.UtcNow - timeSpan;
            return await _supportTicketRepository.CountClosedTicketsSinceAsync(sinceDate);
        }

        public async Task<Dictionary<Category, int>> GetMostCommonCategoryAsync()
        {
            return await _supportTicketRepository.GetCategoryCountsAsync();
        }

        public async Task<Dictionary<string, int>> GetTicketsCountByPriorityAsync(string status)
        {
            return await _supportTicketRepository.GetTicketsCountByPriorityAsync(status);
        }

        public async Task<SupportTicket> GetPrioritizedRandomTicketAsync()
        {
            var openTickets = (await _supportTicketRepository.GetAllTicketsAsync())
                .Where(t => t.Status == "Open")
                .OrderByDescending(t => t.Priority)
                .ToList();

            return openTickets.FirstOrDefault();
        }

        public async Task RespondToTicketAsync(int ticketId, string message)
        {
            var ticket = await _supportTicketRepository.GetTicketByIdAsync(ticketId);
            if (ticket == null) throw new ArgumentException("Ticket not found.");

            // Ensure the user exists and has an email address
            if (ticket.User == null || string.IsNullOrEmpty(ticket.User.Email))
                throw new Exception("Ticket does not have an associated user with a valid email address.");

            // Compose the email
            string subject = $"[{ticket.TicketId}] - {ticket.Subject}";
            string htmlMessage = $"<p>Hej,</p><p>{message}</p><p>Vänliga hälsningar,</p><p>Teamet bakom Ledge</p>";

            // Send the email
            var emailResult = await _emailSender.SendEmailAsync(ticket.User.Email, subject, htmlMessage);
            if (!emailResult.Success)
            {
                throw new Exception($"Failed to send email: {emailResult.ErrorMessage}");
            }

            // Update the ticket status
            ticket.Status = "In Progress";
            ticket.UpdatedAt = DateTime.UtcNow;
            await _supportTicketRepository.UpdateTicketAsync(ticket);
        }

        public async Task CloseTicketAsync(int ticketId)
        {
            var ticket = await _supportTicketRepository.GetTicketByIdAsync(ticketId);
            if (ticket == null) throw new ArgumentException("Ticket not found.");

            ticket.Status = "Closed";
            ticket.UpdatedAt = DateTime.UtcNow;
            await _supportTicketRepository.UpdateTicketAsync(ticket);
        }
    }
}
