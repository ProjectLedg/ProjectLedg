using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Data.Models
{
    public enum Category
    {
        Technical,          
        Billing,            
        AccountManagement,  
        GeneralInquiry,     
        ProductSupport,     
        Feedback,
        NothingRelevant
    }
    public class SupportTicket
    {
        [Key]
        public int TicketId { get; set; }

        [Required]
        public Category Category { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Description { get; set; }

        public string Priority { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Open";

        public string UserId { get; set; } // ID of the user who submitted the ticket

        public string? ImageUrl { get; set; }

        public virtual Company Company { get; set; }
    }
}