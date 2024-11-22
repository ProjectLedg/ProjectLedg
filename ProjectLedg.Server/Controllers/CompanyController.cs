﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Company;
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

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
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
            return CreatedAtAction(nameof(GetCompanyById), new { id = createdCompany.Id }, createdCompany);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
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
    }
}
