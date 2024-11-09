using ProjectLedg.Server.Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectLedg.Server.Services.IServices
{
    public interface ISupportTicketService
    {
        Task<SupportTicket> CreateTicketAsync(SupportTicket ticket, int companyId);
        Task<IEnumerable<SupportTicket>> GetAllTicketsAsync();
        Task<SupportTicket> GetTicketByIdAsync(int ticketId);
        Task UpdateTicketStatusAsync(int ticketId, string status);
    }
}
