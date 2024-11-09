using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Repositories
{
    public class SupportTicketRepository : ISupportTicketRepository
    {
        private readonly ProjectLedgContext _context;

        public SupportTicketRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<SupportTicket> CreateTicketAsync(SupportTicket ticket)
        {
            // Adds the ticket and saves changes
            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task<IEnumerable<SupportTicket>> GetAllTicketsAsync()
        {
            return await _context.SupportTickets.ToListAsync();
        }

        public async Task<SupportTicket> GetTicketByIdAsync(int ticketId)
        {
            return await _context.SupportTickets.FindAsync(ticketId);
        }

        public async Task UpdateTicketStatusAsync(int ticketId, string status)
        {
            var ticket = await _context.SupportTickets.FindAsync(ticketId);
            if (ticket != null)
            {
                ticket.Status = status;
                await _context.SaveChangesAsync();
            }
        }
    }
}
