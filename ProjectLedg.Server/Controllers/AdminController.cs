using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Manager")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // Only managers can create admins
        [Authorize(Roles = "Manager")]
        [HttpPost("createAdmin")]
        public async Task<IActionResult> CreateAdmin(CreateAccountRequestDTO request)
        {
            var result = await _adminService.CreateAdminsAsync(request, User);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }

        // Accessible by Admins and Managers
        [HttpGet("getAllAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _adminService.GetAllAdminsAsync();
            return Ok(admins);
        }

        [HttpGet("getAdminById/{id}")]
        public async Task<IActionResult> GetAdminById(string id)
        {
            var admin = await _adminService.GetUserById(id);
            return admin != null ? Ok(admin) : NotFound();
        }

        [HttpPut("updateAdmin")]
        public async Task<IActionResult> UpdateAdmin(User admin)
        {
            var result = await _adminService.UpdateAdminsAsync(admin);
            return result.Succeeded ? Ok() : BadRequest();
        }

        [HttpDelete("deleteAdmin/{id}")]
        public async Task<IActionResult> DeleteAdmin(string id)
        {
            var result = await _adminService.DeleteAdminsAsync(id, User);
            return result.Succeeded ? Ok() : BadRequest();
        }
    }
}