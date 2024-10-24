using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        
        private readonly ProjectLedgContext _context;

        public CustomerRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public Task<Customer> CreateCustomerAsync(int companyId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteCustomerAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Customer>> GetAllCustomerFromCompanyAsync(int companyId)
        {
            return await _context.Companies
            .Where(c => c.Id == companyId)
            .SelectMany(c => c.Customers) // Flatten the collection of customers
            .ToListAsync(); // Convert the result to a list asynchronously
        }

        public Task<Customer> GetCustomerByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
