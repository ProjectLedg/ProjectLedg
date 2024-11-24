using ProjectLedg.Server.Data.Models.DTOs.Functions.IngoingInvoice;

namespace ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions
{
    public interface IIngoingInvoiceFunctions
    {
        Task<List<IngoingInvoiceFunctionDTO>> GetUnpaidInvoicesForCompanyAsync(int companyId);
        Task<string> GetInvoices(string companyName, int? year = null, int? month = null);
    }
}
