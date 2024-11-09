﻿using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<User> _userManager;
        private readonly AuthenticationService _authenticationService;

        public AdminService(IAdminRepository adminRepository, UserManager<User> userManager, AuthenticationService authenticationService)
        {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _authenticationService = authenticationService;
        }

        public async Task<LoginResult> AdminLoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return LoginResult.Failed("Invalid email or password.");
            }

            var loginResult = await _userManager.CheckPasswordAsync(user, password);
            if (!loginResult)
            {
                return LoginResult.Failed("Invalid email or password.");
            }

            // Ensure user has either "Admin" or "Manager" role
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Any(r => r == "Admin" || r == "Manager"))
            {
                return LoginResult.Failed("Access denied. Only Admins and Managers can log in.");
            }

            // Generate JWT token for the admin user
            var token = await _authenticationService.GenerateToken(user);
            return LoginResult.Successful(token, roles.ToList());
        }


        public async Task<AccountCreationResult> CreateAdminsAsync(CreateAccountRequestDTO request, ClaimsPrincipal currentUser)
        {
            if (!currentUser.IsInRole("Manager"))
                return new AccountCreationResult { Success = false, Errors = new[] { "Access denied." } };

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };
            var result = await _adminRepository.CreateAdminAsync(user, request.Password);

            return new AccountCreationResult
            {
                Success = result.Succeeded,
                Errors = result.Succeeded ? null : result.Errors.Select(e => e.Description)
            };
        }

        public async Task<IdentityResult> UpdateAdminsAsync(User user)
        {
            return await _adminRepository.UpdateAdminAsync(user);
        }

        public async Task<IdentityResult> DeleteAdminsAsync(string id, ClaimsPrincipal currentUser)
        {
            if (!currentUser.IsInRole("Manager") && !currentUser.IsInRole("Admin"))
                return IdentityResult.Failed(new IdentityError { Description = "Access denied." });

            var user = await _adminRepository.GetAdminByIdAsync(id);
            return user == null ? IdentityResult.Failed(new IdentityError { Description = "User not found." }) : await _adminRepository.DeleteAdminAsync(user);
        }

        public async Task<IEnumerable<User>> GetAllAdminsAsync()
        {
            return await _adminRepository.GetAllAdminsAsync();
        }

        public async Task<User> GetUserById(string id)
        {
            return await _adminRepository.GetAdminByIdAsync(id);
        }
    }
}
