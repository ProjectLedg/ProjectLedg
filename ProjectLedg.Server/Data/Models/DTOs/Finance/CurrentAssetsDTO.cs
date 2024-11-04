namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class CurrentAssetsDTO
    {
        public decimal Stock { get; set; }
        public decimal AccountsReceivable { get; set; }
        public decimal BankKassa { get; set; }
        public decimal ShortTermReceivables { get; set; }
    }
}
