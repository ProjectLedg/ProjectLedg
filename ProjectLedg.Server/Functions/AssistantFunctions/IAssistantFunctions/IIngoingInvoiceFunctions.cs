namespace ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions
{
    public interface IIngoingInvoiceFunctions
    {
        Task<string> GetUnpaidIngoingInvoicesForCompany(int companyId);
        Task<string> GetInvoices(string companyName, int? year = null, int? month = null);
    }
}
