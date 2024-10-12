using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLedg.Server.Data.Models.DTOs.PDF
{
    public class InvoiceUploadDTO
    {
        [NotMapped]
        public IFormFile InvoiceFile { get; set; }
        public string? InvoiceFilePath { get; set; }
    }
}
