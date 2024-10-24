using ProjectLedg.Server.Data.Models.DTOs.Customer;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        public CustomerService(ICustomerRepository customerRepository) 
        {
            _customerRepository = customerRepository;
        }
        public async Task<IEnumerable<CustomerListDTO>> GetAllCustomerAsync(int companyId)
        {
           var customerList = await _customerRepository.GetAllCustomerFromCompanyAsync(companyId);
            return customerList.Select(c => new CustomerListDTO
            {
                Id = c.Id,
                Name = c.Name,
                Address = c.Address,
                OrganizationNumber = c.OrganizationNumber,
                TaxId = c.TaxId


            }).ToList();
        }
    }
}
