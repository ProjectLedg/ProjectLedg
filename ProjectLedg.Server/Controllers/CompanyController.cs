using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Company;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Controllers
{
    // CompanyController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly IUserService _userService;

        public CompanyController(ICompanyService companyService, IUserService userService)
        {
            _companyService = companyService;
            _userService = userService;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyDTO companyDto)
        {   
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ClaimsPrincipal claimsUser = User;

            // Create the company and get the created company entity, which includes the auto-generated Id
            var createdCompany = await _companyService.CreateCompanyAsync(companyDto,claimsUser);

            if (createdCompany == null)
            {
                return StatusCode(500, "An error occurred while creating the company");
            }

            // Assuming the returned object has the auto-generated Id after saving
            return Ok("Succesfully created company.");
        }

        [Authorize]
        [HttpGet("GetCompanyById/{companyId}")]
        public async Task<IActionResult> GetCompanyById(int companyId)
        { 
            // Get claims from JWT and user id from that
            ClaimsPrincipal claimsUser = User;
            string userId = claimsUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, companyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var company = await _companyService.GetCompanyByIdAsync(companyId);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }

        [Authorize]
        [HttpGet("getUserCompanies")]
        public async Task<IActionResult> GetCompaniesForUser()
        {
            ClaimsPrincipal claims = User;

            var companies = await _companyService.GetCompaniesForUserAsync(claims);

            return Ok(companies);
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpDelete("DeleteCompany/{companyId}")]
        public async Task<IActionResult> DeleteCompanyAsync(int companyId)
        {
            // Get claims from JWT and user id from that
            ClaimsPrincipal claimsUser = User;
            string userId = claimsUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("No user id in claims.");

            var companyBelongsToUser = await _userService.VerifyCompanyBelongsToUser(userId, companyId);
            if (!companyBelongsToUser.Success)
                return BadRequest(companyBelongsToUser.Message);

            var company = await _companyService.DeleteCompanyAsync(companyId);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }
    }
}
