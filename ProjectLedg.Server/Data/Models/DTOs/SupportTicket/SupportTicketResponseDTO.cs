namespace ProjectLedg.Server.Data.Models.DTOs.SupportTicket
{
    public class SupportTicketResponseDTO
    {
        public int TicketId { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CompanyId { get; set; }
    }
}
