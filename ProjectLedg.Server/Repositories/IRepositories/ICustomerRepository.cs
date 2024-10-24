using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ICustomerRepository
    {
        Task<Customer> CreateCustomerAsync(int companyId);
        Task<IEnumerable<Customer>> GetAllCustomerFromCompanyAsync(int companyId);
        Task<Customer> GetCustomerByIdAsync(int id);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
