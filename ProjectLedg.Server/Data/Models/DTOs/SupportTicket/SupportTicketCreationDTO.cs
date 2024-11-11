using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Model.DTOs
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
    public class SupportTicketCreationDTO
    {
        [Required]
        public Category Category { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Description { get; set; }

        public int? CompanyId { get; set; }

        public IFormFile? Image { get; set; } // Optional image attachment
    }
}
