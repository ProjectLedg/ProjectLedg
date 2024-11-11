using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnualReportController : ControllerBase
    {
        private readonly IAnnualReportService _annualReportService;

        public AnnualReportController(IAnnualReportService annualReportService)
        {
            _annualReportService = annualReportService;
        }

        [HttpGet("Reportcontent")]
        public async Task<IActionResult> AnnualReportContent([FromQuery] int companyId )
        {
            var reportContent = await _annualReportService.GenerateAnnualReportContent(companyId);
            return Ok(reportContent);
        }
    }
}
