using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;


        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }


        [HttpGet("getall/{companyId}")]
        public async Task<IActionResult> GetAllCustomers(int companyId)
        {
            var customers = await _customerService.GetAllCustomerAsync(companyId);
            return Ok(customers);
        }






    }
}
