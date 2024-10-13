namespace ProjectLedg.Server.Data.Models.DTOs.BasAccount
{
    public class BasAccountDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
