namespace ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;

public interface IBasAccountFunctions
{
    Task<string> HandleGetCompanyBasAccounts(string[] args);
    Task<string> FetchCompanyBasAccountsAsync(int companyId);
    Task<string> GetPopularBasAccountsForCompany(int companyId);
    Task<string> GetCompanyBasAccounts(int companyId);
}
