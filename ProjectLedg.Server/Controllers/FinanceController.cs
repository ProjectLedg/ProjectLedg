using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class FinanceController: ControllerBase
    {
        private readonly IFinanceService _financeService;
        private readonly IUserService _userService;
        private readonly ILogger<FinanceService> _logger;

        public FinanceController(IFinanceService financeService, ILogger<FinanceService> logger, IUserService userService)
        {
            _financeService = financeService;
            _logger = logger;
            _userService = userService;
        }

        // Endpoints
        [Authorize]
        [HttpPost("dashboardtopgraphs")]
        public async Task<IActionResult> GetYearToDateFinances(FinanceRequestDTO request)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var result = await _financeService.GetYearToDateFinancesAsync(request);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("GetFinancialReport")]
        public async Task<IActionResult> GetFinancialReport(FinanceRequestDTO request)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var result = await _financeService.GetFinancialReportAsync(request);
            
            return Ok(result);
        }

        [Authorize]
        [HttpPost("dashboardbottomgraphs")]
        public async Task<IActionResult> GetYearToDateInsights(FinanceRequestDTO request)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, request.CompanyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var result = await _financeService.GetFinanceInsightsYearAsync(request);
            
            return Ok(result);
        }
    }
}
