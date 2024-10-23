using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("/api[controller]")]
    public class FinanceController: ControllerBase
    {
        private readonly IFinanceService _financeService;

        public FinanceController(IFinanceService financeService)
        {
            _financeService = financeService;
        }

        // Endpoints
        [HttpPost("DashboardDataYTD")]
        public async Task<IActionResult> GetYearToDateFinances(FinanceRequestDTO request)
        {
            var result = await _financeService.GetYearToDateFinancesAsync(request);

            return Ok(result);
        }

        [HttpPost("GetFinancialReport")]
        public async Task<IActionResult> GetFinancialReport(FinanceRequestDTO request)
        {
            var result = await _financeService.GetFinancialReportAsync(request);

            return Ok(result);
        }
    }
}
