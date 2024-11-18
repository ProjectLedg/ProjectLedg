using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ISupportTicketRepository
    {
        Task<SupportTicket> CreateTicketAsync(SupportTicket ticket);
        Task<IEnumerable<SupportTicket>> GetAllTicketsAsync();
        Task<SupportTicket> GetTicketByIdAsync(int ticketId);
        Task UpdateTicketStatusAsync(int ticketId, string status);
        Task<SupportTicket> UpdateTicketAsync(SupportTicket ticket);

        //statistical
        Task<int> CountTicketsByStatusAsync(string status);
        Task<int> CountClosedTicketsSinceAsync(DateTime sinceDate);
        Task<Dictionary<Category, int>> GetCategoryCountsAsync();
        Task<Dictionary<string, int>> GetTicketsCountByPriorityAsync(string status);
    }
}
