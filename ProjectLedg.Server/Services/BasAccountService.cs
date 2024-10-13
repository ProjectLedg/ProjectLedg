using ProjectLedg.Server.Data.Models.DTOs.BasAccount;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

public class BasAccountService : IBasAccountService
{
    private readonly IBasAccountRepository _basAccountRepository;

    public BasAccountService(IBasAccountRepository basAccountRepository)
    {
        _basAccountRepository = basAccountRepository;
    }

    public async Task<BasAccountDTO> GetBasAccountByIdAsync(int id)
    {
        var basAccount = await _basAccountRepository.GetBasAccountByIdAsync(id);
        return MapToDTO(basAccount);
    }

    public async Task<BasAccountDTO> CreateBasAccountAsync(BasAccountCreationDTO dto)
    {
        var basAccount = new BasAccount
        {
            AccountNumber = dto.AccountNumber,
            Description = dto.Description,
            TotalAmount = dto.TotalAmount
        };

        basAccount = await _basAccountRepository.CreateBasAccountAsync(basAccount);

        return MapToDTO(basAccount);
    }

    public async Task UpdateBasAccountAsync(BasAccountUpdateDTO dto)
    {
        var basAccount = await _basAccountRepository.GetBasAccountByIdAsync(dto.Id);
        if (basAccount != null)
        {
            basAccount.AccountNumber = dto.AccountNumber;
            basAccount.Description = dto.Description;
            basAccount.TotalAmount = dto.TotalAmount;

            await _basAccountRepository.UpdateBasAccountAsync(basAccount);
        }
    }

    public async Task DeleteBasAccountAsync(int id)
    {
        await _basAccountRepository.DeleteBasAccountAsync(id);
    }

    public async Task<List<BasAccountDTO>> GetAllBasAccountsAsync()
    {
        var basAccounts = await _basAccountRepository.GetAllBasAccountsAsync();
        return basAccounts.Select(MapToDTO).ToList();
    }

    private BasAccountDTO MapToDTO(BasAccount basAccount)
    {
        return new BasAccountDTO
        {
            AccountNumber = basAccount.AccountNumber,
            Description = basAccount.Description,
            TotalAmount = basAccount.TotalAmount
        };
    }
}
