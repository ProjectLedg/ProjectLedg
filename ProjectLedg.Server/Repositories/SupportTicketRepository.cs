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
            return await _context.SupportTickets
                .Include(t => t.Company)
                .Include(t => t.User) // Include the User entity
                .FirstOrDefaultAsync(t => t.TicketId == ticketId);
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
        public async Task<int> CountTicketsByStatusAsync(string status)
        {
            return await _context.SupportTickets.CountAsync(t => t.Status == status);
        }

        public async Task<int> CountClosedTicketsSinceAsync(DateTime sinceDate)
        {
            return await _context.SupportTickets.CountAsync(t => t.Status == "Closed" && t.UpdatedAt >= sinceDate);
        }

        public async Task<Dictionary<Category, int>> GetCategoryCountsAsync()
        {
            return await _context.SupportTickets
                .GroupBy(t => t.Category)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<Dictionary<string, int>> GetTicketsCountByPriorityAsync(string status)
        {
            return await _context.SupportTickets
                .Where(t => t.Status == status)
                .GroupBy(t => t.Priority)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<SupportTicket> UpdateTicketAsync(SupportTicket ticket)
        {
            _context.SupportTickets.Update(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }
    }
}
