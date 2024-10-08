using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Company;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Services.IServices
{
    public interface ICompanyService
    {
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company> GetCompanyByIdAsync(int id);
        Task<CompanyDTO> CreateCompanyAsync(CreateCompanyDTO request);
        //Task<> UpdateCompanyAsync(Company company);
        //Task<> DeleteCompanyAsync(string password, ClaimsPrincipal currentUser);
        //Task<> LoginAsync(string email, string password);
        //Task<> SendEmailVerificationAsync(string userId, string code);
    }
}
