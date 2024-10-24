using ProjectLedg.Server.Data.Models.DTOs.Customer;

namespace ProjectLedg.Server.Services.IServices
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerListDTO>> GetAllCustomerAsync(int companyId);
    }
}
