using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Company;
using ProjectLedg.Server.Repositories;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserService _userService;
        public CompanyService(ICompanyRepository companyRepository, IUserService userService)
        {
            _companyRepository = companyRepository;
            _userService = userService;

        }

        [Authorize]
        public async Task<CompanyDTO> CreateCompanyAsync(CreateCompanyDTO request, ClaimsPrincipal userClaims)
        {
            string? userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(userId == null)
                return null;

            var user = await _userService.GetUserByIdAsync(userId);

            // Create a new company entity from the DTO
            var company = new Company
            {
                CompanyName = request.CompanyName,
                OrgNumber = request.OrgNumber,
                AmountOfEmployees = request.AmountOfEmployees,
                CompanyDescription = request.CompanyDescription,
                TaxId = request.TaxId,
                Address = request.Address,
                Users = new List<User> { user }
            };

            // Initialize the user's Companies collection if it's null
            user.Companies ??= new List<Company>();
            user.Companies.Add(company);

            // Save the new company to the database
            var createdcomp = await _companyRepository.CreateCompanyAsync(company);

            if(createdcomp == null)
            {
                return null;
            }

            // Return a DTO that includes the generated Id and other properties
            return new CompanyDTO
            {
                Id = company.Id,
                CompanyName = company.CompanyName,
                OrgNumber = company.OrgNumber,
                AmountOfEmployees = company.AmountOfEmployees,
                CompanyDescription = company.CompanyDescription,
                TaxId = company.TaxId,
                Address = company.Address
            };
        }



        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            try
            {
                var listOfCompanies = await _companyRepository.GetAllCompaniesAsync();

                return listOfCompanies.Select(a => new Company
                {
                    Id = a.Id,
                    CompanyName = a.CompanyName,
                    OrgNumber = a.OrgNumber,
                    AmountOfEmployees = a.AmountOfEmployees,
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        [Authorize]
        public async Task<IEnumerable<UsersCompaniesDTO>> GetCompaniesForUserAsync(ClaimsPrincipal claims)
        {
            string? userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Do better error handling
            if (userId == null)
                return null;

            var companies = await _companyRepository.GetCompaniesForUserAsync(userId);

            var companyDtoList = new List<UsersCompaniesDTO>();
            foreach(Company company in companies)
            {
                var newDto = new UsersCompaniesDTO
                {
                    Id = company.Id,
                    CompanyName = company.CompanyName,
                    OrgNumber = company.OrgNumber,
                };
                companyDtoList.Add(newDto);
            }

            return companyDtoList;
        }

        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            return await _companyRepository.GetCompanyByIdAsync(id);
        }
    }
}
