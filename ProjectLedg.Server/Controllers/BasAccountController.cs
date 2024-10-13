using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Services.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectLedg.Server.Data.Models.DTOs.BasAccount;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasAccountController : ControllerBase
    {
        private readonly IBasAccountService _basAccountService;

        public BasAccountController(IBasAccountService basAccountService)
        {
            _basAccountService = basAccountService;
        }

        //GET:api/basaccount/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BasAccountDTO>> GetBasAccountById(int id)
        {
            var basAccount = await _basAccountService.GetBasAccountByIdAsync(id);
            if (basAccount == null) return NotFound();
            return Ok(basAccount);
        }

        //GET:api/basaccount
        [HttpGet]
        public async Task<ActionResult<List<BasAccountDTO>>> GetAllBasAccounts()
        {
            var basAccounts = await _basAccountService.GetAllBasAccountsAsync();
            return Ok(basAccounts);
        }

        //POST:api/basaccount
        [HttpPost]
        public async Task<ActionResult<BasAccountDTO>> CreateBasAccount([FromBody] BasAccountCreationDTO basAccountDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var basAccount = await _basAccountService.CreateBasAccountAsync(basAccountDto);
            return CreatedAtAction(nameof(GetBasAccountById), new { id = basAccount.Id }, basAccount);
        }

        //PUT:api/basaccount/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBasAccount(int id, [FromBody] BasAccountUpdateDTO basAccountDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            basAccountDto.Id = id;
            await _basAccountService.UpdateBasAccountAsync(basAccountDto);
            return NoContent();
        }

        //DELETE:Api/basaccount/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBasAccount(int id)
        {
            await _basAccountService.DeleteBasAccountAsync(id);
            return NoContent();
        }
    }
}
