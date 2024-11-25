using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IIngoingInvoiceService _ingoingInvoiceService;
        private readonly IOutgoingInvoiceService _outgoingInvoiceService;
        private readonly IBasAccountService _basAccountService;
        private readonly IPDFService _pdfService;

        public StatisticsController(
            IUserService userService,
            IIngoingInvoiceService ingoingInvoiceService,
            IOutgoingInvoiceService outgoingInvoiceService,
            IBasAccountService basAccountService,
            IPDFService pdfService)
        {
            _userService = userService;
            _ingoingInvoiceService = ingoingInvoiceService;
            _outgoingInvoiceService = outgoingInvoiceService;
            _basAccountService = basAccountService;
            _pdfService = pdfService;
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("users/total")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var count = await _userService.GetTotalUsersAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("users/logins/today")]
        public async Task<IActionResult> GetLoginsToday()
        {
            var count = await _userService.GetLoginsTodayAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("users/logins/week")]
        public async Task<IActionResult> GetLoginsThisWeek()
        {
            var count = await _userService.GetLoginsThisWeekAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("users/logins/year")]
        public async Task<IActionResult> GetLoginsThisYear()
        {
            var count = await _userService.GetLoginsThisYearAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("invoices/ingoing/today")]
        public async Task<IActionResult> GetIngoingInvoicesToday()
        {
            var count = await _ingoingInvoiceService.GetIngoingInvoicesTodayAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("invoices/outgoing/today")]
        public async Task<IActionResult> GetOutgoingInvoicesToday()
        {
            var count = await _outgoingInvoiceService.GetOutgoingInvoicesTodayAsync();
            return Ok(count);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("bas-account/most-popular")]
        public async Task<IActionResult> GetMostPopularBasAccount()
        {
            var account = await _basAccountService.GetMostPopularBasAccountAsync();
            return Ok(account);
        }
    }
}
