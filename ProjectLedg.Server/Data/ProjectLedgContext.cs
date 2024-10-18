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
        //public DbSet<FiscalYear> FiscalYears { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
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
                new Company { Id = 1, CompanyName = "Test Company", OrgNumber = "1234567890", AmountOfEmployees = 10 }
            );

            // Seed relationship between User and Company
            modelBuilder.Entity<User>()
                .HasMany(u => u.Companies)
                .WithMany(c => c.Users)
                .UsingEntity(j => j.HasData(
                    new { CompaniesId = 1, UsersId = "1" }
                ));

            modelBuilder.Entity<BasAccount>().HasData(
            new BasAccount
            {
                Id = 1,
                Debit = 0,  // For revenue accounts, usually debit is 0
                Credit = 17550,  // Credit value for revenue (account class 3)
                Description = "Revenue Account",
                AccountNumber = "3000",
                Year = 2023,
                CompanyId = 1
            },
            new BasAccount
            {
                Id = 2,
                Debit = 3500,  // Debit value for material costs (account class 4)
                Credit = 0,  // Typically, expenses don't have credit unless there's a refund
                Description = "Material Costs",
                AccountNumber = "4000",
                Year = 2023,
                CompanyId = 1
            },
            new BasAccount
            {
                Id = 3,
                Debit = 4300,  // Debit value for personnel costs (account class 7)
                Credit = 0,  // No credit for expenses
                Description = "Personnel Costs",
                AccountNumber = "7000",
                Year = 2023,
                CompanyId = 1
            }
        );

            // Seed Invoice data 
            modelBuilder.Entity<Invoice>().HasData(
                new Invoice { Id = 1, InvoiceNumber = "INV001", InvoiceDate = new DateTime(2023, 01, 05), DueDate = new DateTime(2023, 01, 15), TotalAmount = 5000.00m, IsPaid = true, IsOutgoing = true, IsBooked = true, ClientName = "Client A", SenderName = "Company A", CompanyId = 1, InvoiceFile = new byte[0] },
                new Invoice { Id = 2, InvoiceNumber = "INV002", InvoiceDate = new DateTime(2023, 02, 01), DueDate = new DateTime(2023, 02, 10), TotalAmount = 1500.00m, IsPaid = false, IsOutgoing = false, IsBooked = false, ClientName = "Client B", SenderName = "Company B", CompanyId = 1, InvoiceFile = new byte[0] }
            );

            // Seed Transaction data over several months
            modelBuilder.Entity<Transaction>().HasData(
                new Transaction
                {
                    Id = 2001,
                    Amount = 5000.00m,
                    TransactionDate = new DateTime(2023, 01, 05),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2002,
                    Amount = 1500.00m,
                    TransactionDate = new DateTime(2023, 02, 01),
                    IsDebit = true,
                    BasAccountId = 2, // Material costs
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2003,
                    Amount = 750.00m,
                    TransactionDate = new DateTime(2023, 01, 15),
                    IsDebit = false,
                    BasAccountId = 1,
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2004,
                    Amount = 3000.00m,
                    TransactionDate = new DateTime(2023, 02, 15),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2005,
                    Amount = 1200.00m,
                    TransactionDate = new DateTime(2023, 02, 25),
                    IsDebit = true,
                    BasAccountId = 2, // Material costs
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2006,
                    Amount = 2500.00m,
                    TransactionDate = new DateTime(2023, 03, 01),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2007,
                    Amount = 1800.00m,
                    TransactionDate = new DateTime(2023, 03, 15),
                    IsDebit = true,
                    BasAccountId = 3, // Personnel costs
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2008,
                    Amount = 3000.00m,
                    TransactionDate = new DateTime(2023, 04, 10),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2009,
                    Amount = 500.00m,
                    TransactionDate = new DateTime(2023, 04, 20),
                    IsDebit = true,
                    BasAccountId = 2, // Material costs
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2010,
                    Amount = 2000.00m,
                    TransactionDate = new DateTime(2023, 05, 01),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2011,
                    Amount = 2500.00m,
                    TransactionDate = new DateTime(2023, 05, 15),
                    IsDebit = true,
                    BasAccountId = 3, // Personnel costs
                    InvoiceId = 2
                },
                new Transaction
                {
                    Id = 2012,
                    Amount = 1500.00m,
                    TransactionDate = new DateTime(2023, 06, 01),
                    IsDebit = false,
                    BasAccountId = 1, // Revenue account
                    InvoiceId = 1
                },
                new Transaction
                {
                    Id = 2013,
                    Amount = 300.00m,
                    TransactionDate = new DateTime(2023, 06, 15),
                    IsDebit = true,
                    BasAccountId = 2, // Material costs
                    InvoiceId = 2
                }
            );

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Invoice)
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
