using ProjectLedg.Server.Data.Models.DTOs.BasAccount;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IBasAccountService
    {
        Task<BasAccountDTO> GetBasAccountByIdAsync(int id);
        Task<BasAccountDTO> CreateBasAccountAsync(BasAccountCreationDTO dto);
        Task UpdateBasAccountAsync(BasAccountUpdateDTO dto);
        Task DeleteBasAccountAsync(int id);
        Task<List<BasAccountDTO>> GetAllBasAccountsAsync();
    }

}
