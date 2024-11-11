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

        //Statistics
        Task<int> GetOpenTicketsCountAsync();
        Task<int> GetInProgressTicketsCountAsync();
        Task<int> GetClosedTicketsCountAsync(TimeSpan timeSpan);
        Task<Dictionary<Category, int>> GetMostCommonCategoryAsync();
        Task<Dictionary<string, int>> GetTicketsCountByPriorityAsync(string status);
    }
}
