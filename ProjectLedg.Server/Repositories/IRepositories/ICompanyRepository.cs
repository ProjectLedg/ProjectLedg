using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ICompanyRepository
    {
        Task<Company> CreateCompanyAsync(Company company);
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company> GetCompanyByIdAsync(int id);
        Task<IEnumerable<Company>> GetCompaniesForUserAsync(string userId);

        Task DeleteCompanyAsync(Company company);
    }
}
