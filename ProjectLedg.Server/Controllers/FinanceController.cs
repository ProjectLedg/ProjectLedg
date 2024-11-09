using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class FinanceController: ControllerBase
    {
        private readonly IFinanceService _financeService;
        private readonly ILogger<FinanceService> _logger;

        public FinanceController(IFinanceService financeService, ILogger<FinanceService> logger)
        {
            _financeService = financeService;
            _logger = logger;
        }

        // Endpoints
        [HttpPost("dashboardtopgraphs")]
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
        
        [HttpPost("dashboardbottomgraphs")]
        public async Task<IActionResult> GetYearToDateInsights(FinanceRequestDTO request)
        {
            var result = await _financeService.GetFinanceInsightsYearAsync(request);
            
            return Ok(result);
        }
    }
}
