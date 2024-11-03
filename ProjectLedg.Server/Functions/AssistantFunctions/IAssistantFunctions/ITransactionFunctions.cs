namespace ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions
{
    public interface ITransactionFunctions
    {
        Task<string> GetHighProfileTransactionsForCompany(int companyId, decimal threshold = 10000);
        Task<string> GetLatestTransactionsForCompany(int companyId, int count = 5);
    }
}
