namespace ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions
{
    public interface IOutgoingInvoiceFunctions
    {
        Task<string> GetUnpaidOutgoingInvoicesForCompany(int companyId);
        Task<string> GetOutgoingInvoicesByCompanyNameAndYear(string companyName, int year);
    }
}
