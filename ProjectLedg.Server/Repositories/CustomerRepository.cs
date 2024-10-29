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

        public async Task<Customer> CreateCustomerAsync(Customer customer,int companyId)
        {
            // Retrieve the company from the database by its ID
            var company = await _context.Companies
                                         .Where(c => c.Id == companyId)
                                         .Include(c => c.Customers) // Include customers to add new ones
                                         .FirstOrDefaultAsync();

            if (company == null)
            {
                throw new Exception("Company not found");
            }

            // Add the new customer to the company's customer collection
            company.Customers.Add(customer);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return customer;
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

        public async Task<Customer> GetCustomerByOrgNumber(string orgNumber)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.OrganizationNumber == orgNumber);
            if (customer == null)
            {
                return null;
            }
            return customer;
        }

        public async Task<Customer> UpdateCustomerWithInvoice(Customer customer)
        {
            // Check if the customer exists in the database
            var existingCustomer = await _context.Customers.FindAsync(customer.Id);

            if (existingCustomer == null)
            {
                throw new Exception("Customer not found");
            }

            // Update the existing customer's properties with the values from the input customer object
            existingCustomer = customer;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return existingCustomer;
        }
    }
}
