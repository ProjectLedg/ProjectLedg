﻿namespace ProjectLedg.Server.Data.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public bool IsDebit { get; set; }
        public DateTime TransactionDate { get; set; }


        public int InvoiceId { get; set; } // Just used for on model creating seed data not necessary to use in actual code
        public int BasAccountId { get; set; } // Just used for on model creating seed data not necessary to use in actual code

        public virtual Invoice Invoice { get; set; }
        public virtual BasAccount BasAccount { get; set; }
    }
}
