using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IAzureAIService
    {
        Task<string> BookInvoice(Invoice invoice);
    }
}
