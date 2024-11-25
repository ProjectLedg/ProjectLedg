using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnualReportController : ControllerBase
    {
        private readonly IAnnualReportService _annualReportService;
        private readonly IUserService _userService;

        public AnnualReportController(IAnnualReportService annualReportService, IUserService userService)
        {
            _annualReportService = annualReportService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("Reportcontent")]
        public async Task<IActionResult> AnnualReportContent([FromQuery] int companyId )
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal userClaims = User;
            string userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            // Verify that the company we want data for/from belongs to this user
            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, companyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var reportContent = await _annualReportService.GenerateAnnualReportContent(companyId);
            return Ok(reportContent);
        }
    }
}
