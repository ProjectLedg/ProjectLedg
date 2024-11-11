using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.BasAccount;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IBasAccountService
    {
        List<BasAccount> GetBasAccounts();

        //statistics
        Task<KeyValuePair<string, int>> GetMostPopularBasAccountAsync();
      
     
        Task<ResultObject> AddBasAccountsToCompanyAsync(List<BasAccountDTO> basAccountsDTO, IngoingInvoice invoice, int companyId);

    }
}
