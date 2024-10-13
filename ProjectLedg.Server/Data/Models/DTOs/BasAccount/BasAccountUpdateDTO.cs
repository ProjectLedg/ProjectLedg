namespace ProjectLedg.Server.Data.Models.DTOs.BasAccount
{
    public class BasAccountUpdateDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
