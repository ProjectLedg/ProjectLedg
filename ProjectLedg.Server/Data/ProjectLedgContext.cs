using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data.Models;
using System.Reflection.Emit;

namespace ProjectLedg.Server.Data
{
    public class ProjectLedgContext : IdentityDbContext<User>
    {
        public ProjectLedgContext(DbContextOptions<ProjectLedgContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<InvoiceItems> InvoiceItems { get; set; }
        public DbSet<IngoingInvoice> IngoingInvoices { get; set; }
        public DbSet<OutgoingInvoice> OutgoingInvoices { get; set; }
        public DbSet<BasAccount> BasAccounts { get; set; }
        public DbSet<EmailList> Emails { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed User data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = "1", // Normally a GUID for Identity users
                    UserName = "testuser@example.com",
                    NormalizedUserName = "TESTUSER@EXAMPLE.COM",
                    Email = "testuser@example.com",
                    NormalizedEmail = "TESTUSER@EXAMPLE.COM",
                    FirstName = "John",
                    LastName = "Doe",
                    AuthenticatorKey = "XYZ12345",
                    EmailConfirmed = true,
                    PasswordHash = new PasswordHasher<User>().HashPassword(null, "Password1!")
                }
            );

            // Seed Company data
            modelBuilder.Entity<Company>().HasData(
                new Company { Id = 1, CompanyName = "Test Company", OrgNumber = "1234567890", CompanyDescription = "This is a Company", AmountOfEmployees = 10, Address="Test adress" ,TaxId ="1231531432"}
            );

            // Seed relationship between User and Company
            modelBuilder.Entity<User>()
                .HasMany(u => u.Companies)
                .WithMany(c => c.Users)
                .UsingEntity(j => j.HasData(
                    new { CompaniesId = 1, UsersId = "1" }
                ));

            // Seed Bas Accounts
            modelBuilder.Entity<BasAccount>().HasData(
                new BasAccount { Id = 1, Debit = 12750, Credit = 0, Description = "Assets", AccountNumber = "1000", Year = 2023, CompanyId = 1 }, // Konto klass 1: Tillgångar
                new BasAccount { Id = 2, Debit = 1500, Credit = 3000, Description = "Liabilities", AccountNumber = "2000", Year = 2023, CompanyId = 1 }, // Konto klass 2: Skulder
                new BasAccount { Id = 3, Debit = 0, Credit = 17250, Description = "Revenue Account", AccountNumber = "3000", Year = 2023, CompanyId = 1 },
                new BasAccount { Id = 4, Debit = 4300, Credit = 0, Description = "Material Costs", AccountNumber = "4000", Year = 2023, CompanyId = 1 },
                new BasAccount { Id = 5, Debit = 2200, Credit = 0, Description = "Other External Costs", AccountNumber = "5000", Year = 2023, CompanyId = 1 }, // Konto klass 5: Övriga externa kostnader
                new BasAccount { Id = 6, Debit = 2000, Credit = 0, Description = "Depreciation Costs", AccountNumber = "6000", Year = 2023, CompanyId = 1 }, // Konto klass 6: Avskrivningar
                new BasAccount { Id = 7, Debit = 1000, Credit = 0, Description = "Personnel Costs", AccountNumber = "7000", Year = 2023, CompanyId = 1 },
                new BasAccount { Id = 8, Debit = 500, Credit = 0, Description = "Extraordinary Costs", AccountNumber = "8000", Year = 2023, CompanyId = 1 }  // Konto klass 8: Övriga rörelsekostnader
            );

            //// Seed Invoice data

            modelBuilder.Entity<IngoingInvoice>().HasData(
    new IngoingInvoice
    {
        Id = 1,
        InvoiceNumber = "INV001",
        InvoiceDate = new DateTime(2023, 01, 05),
        DueDate = new DateTime(2023, 01, 15),
        InvoiceTotal = 5000.00m,
        IsPaid = true,
        IsOutgoing = true,
        IsBooked = true,
        TotalTax = 50.00m,
        CustomerId = "1",
        CustomerName = "Hjalmar Stranninge",
        CustomerAddress = "Arenavägen 61",
        CustomerAddressRecipient = "Hjalmar Stranninge AB",
        VendorName = "Blues Kök & Bar",
        VendorAddress = "Arenavägen 61",
        VendorAddressRecipient = "Erkan",
        VendorTaxId = "59315",
        InvoiceFilePath = "https://localhost:7223",
        CompanyId = 1 // Foreign key reference to Company
    },
    new IngoingInvoice
    {
        Id = 2,
        InvoiceNumber = "INV002",
        InvoiceDate = new DateTime(2023, 01, 05),
        DueDate = new DateTime(2023, 01, 15),
        InvoiceTotal = 5000.00m,
        IsPaid = true,
        IsOutgoing = true,
        IsBooked = true,
        PaymentDetails = "34395139",
        TotalTax = 50.00m,
        CustomerId = "1",
        CustomerName = "Hjalmar Stranninge",
        CustomerAddress = "Arenavägen 61",
        CustomerAddressRecipient = "Hjalmar Stranninge AB",
        VendorName = "Blues Kök & Bar",
        VendorAddress = "Arenavägen 61",
        VendorAddressRecipient = "Erkan",
        VendorTaxId = "59315",
        InvoiceFilePath = "https://localhost:7223",
        CompanyId = 1 // Foreign key reference to Company
    }
);


            // Seed Transaction data over several months
            modelBuilder.Entity<Transaction>().HasData(
                new Transaction { Id = 2001, Amount = 5000.00m, TransactionDate = new DateTime(2023, 01, 05), IsDebit = true, BasAccountId = 1, InvoiceId = 1 },
                new Transaction { Id = 2003, Amount = 750.00m, TransactionDate = new DateTime(2023, 01, 15), IsDebit = true, BasAccountId = 1, InvoiceId = 1 },
                new Transaction { Id = 2006, Amount = 2500.00m, TransactionDate = new DateTime(2023, 03, 01), IsDebit = true, BasAccountId = 1, InvoiceId = 3 },
                new Transaction { Id = 2008, Amount = 3000.00m, TransactionDate = new DateTime(2023, 04, 10), IsDebit = true, BasAccountId = 1, InvoiceId = 4 },
                new Transaction { Id = 2012, Amount = 1500.00m, TransactionDate = new DateTime(2023, 06, 01), IsDebit = true, BasAccountId = 1, InvoiceId = 5 },

                new Transaction { Id = 2002, Amount = 1500.00m, TransactionDate = new DateTime(2023, 02, 01), IsDebit = true, BasAccountId = 2, InvoiceId = 2 },
                new Transaction { Id = 2004, Amount = 3000.00m, TransactionDate = new DateTime(2023, 02, 15), IsDebit = false, BasAccountId = 2, InvoiceId = 2 },

                new Transaction { Id = 2007, Amount = 9000.00m, TransactionDate = new DateTime(2023, 03, 15), IsDebit = false, BasAccountId = 3, InvoiceId = 3 },
                new Transaction { Id = 2011, Amount = 8250.00m, TransactionDate = new DateTime(2023, 05, 15), IsDebit = false, BasAccountId = 3, InvoiceId = 5 },

                new Transaction { Id = 2014, Amount = 4300.00m, TransactionDate = new DateTime(2023, 03, 01), IsDebit = true, BasAccountId = 4, InvoiceId = 3 },
                new Transaction { Id = 2015, Amount = 2200.00m, TransactionDate = new DateTime(2023, 03, 15), IsDebit = true, BasAccountId = 5, InvoiceId = 4 },

                new Transaction { Id = 2016, Amount = 2000.00m, TransactionDate = new DateTime(2023, 04, 01), IsDebit = true, BasAccountId = 6, InvoiceId = 4 },
                new Transaction { Id = 2017, Amount = 1000.00m, TransactionDate = new DateTime(2023, 05, 10), IsDebit = true, BasAccountId = 7, InvoiceId = 5 },
                new Transaction { Id = 2018, Amount = 500.00m, TransactionDate = new DateTime(2023, 06, 15), IsDebit = true, BasAccountId = 8, InvoiceId = 5 }
            );


modelBuilder.Entity<Transaction>()
    .HasOne(t => t.IngoingInvoice)
    .WithMany(i => i.Transactions)
    .HasForeignKey(t => t.InvoiceId)
    .OnDelete(DeleteBehavior.Restrict); // Disable cascade delete on Invoice


            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.IngoingInvoice)
                .WithMany(i => i.Transactions)
                .HasForeignKey(t => t.InvoiceId)
                .OnDelete(DeleteBehavior.Restrict); // Disable cascade delete on Invoice

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.BasAccount)
                .WithMany(b => b.Transactions)
                .HasForeignKey(t => t.BasAccountId)
                .OnDelete(DeleteBehavior.Restrict); // Disable cascade delete on BasAccount

base.OnModelCreating(modelBuilder);
        }
    }
}
