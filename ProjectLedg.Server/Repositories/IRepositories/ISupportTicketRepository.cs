using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ISupportTicketRepository
    {
        Task<SupportTicket> CreateTicketAsync(SupportTicket ticket);
        Task<IEnumerable<SupportTicket>> GetAllTicketsAsync();
        Task<SupportTicket> GetTicketByIdAsync(int ticketId);
        Task UpdateTicketStatusAsync(int ticketId, string status);
    }
}
