using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLedg.Server.Data.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public bool IsDebit { get; set; }
        public DateTime TransactionDate { get; set; }


        public int? IngoingInvoiceId { get; set; } // Just used for on model creating seed data not necessary to use in actual code
        public int? OutgoingInvoiceId { get; set; } // Just used for on model creating seed data not necessary to use in actual code
        public int? BasAccountId { get; set; } // Just used for on model creating seed data not necessary to use in actual code

        [ForeignKey("Company")]
        public int? CompanyId { get; set; }

        public virtual IngoingInvoice? IngoingInvoice { get; set; }
        public virtual OutgoingInvoice? OutgoingInvoice { get; set; }
        public virtual BasAccount BasAccount { get; set; }
    }
}
