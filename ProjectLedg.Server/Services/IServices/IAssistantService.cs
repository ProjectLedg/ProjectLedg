using ProjectLedg.Server.Data.Models.DTOs;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IAssistantService
    {
        Task<string> SendMessageToAssistantAsync(string message);
        Task<string> MapInvoiceToBasAccountsAsync(InvoiceMapDTO invoice);

    }
}
