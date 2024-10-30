using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ICustomerRepository
    {
        Task<Customer> CreateCustomerAsync(Customer customer, int companyId);
        Task<IEnumerable<Customer>> GetAllCustomerFromCompanyAsync(int companyId);
        Task<Customer> UpdateCustomerWithInvoice(Customer customer);
        Task<Customer> GetCustomerByIdAsync(int id);
        Task<Customer> GetCustomerByOrgNumber(string orgNumber);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
