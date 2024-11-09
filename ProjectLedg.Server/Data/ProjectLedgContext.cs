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
        public DbSet<Customer> Customers { get; set; }
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
            base.OnModelCreating(modelBuilder);

            // Define User and Company relationship (Many-to-Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Companies)
                .WithMany(c => c.Users)
                .UsingEntity(j => j.HasData(
                    new { CompaniesId = 1, UsersId = "1" }
                ));

            // Define relationships for IngoingInvoice and InvoiceItems (One-to-Many)
            modelBuilder.Entity<InvoiceItems>()
                .HasOne(ii => ii.IngoingInvoice)
                .WithMany(i => i.Items)
                .HasForeignKey(ii => ii.IngoingInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Define relationships for OutgoingInvoice and InvoiceItems (One-to-Many)
            modelBuilder.Entity<InvoiceItems>()
                .HasOne(ii => ii.OutgoingInvoice)
                .WithMany(o => o.Items)
                .HasForeignKey(ii => ii.OutgoingInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Define relationships for Customer and OutgoingInvoice (One-to-Many)
            modelBuilder.Entity<Customer>()
                .HasMany(c => c.OutgoingInvoices)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Define Transaction and BasAccount relationship (One-to-Many)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.BasAccount)
                .WithMany(b => b.Transactions)
                .HasForeignKey(t => t.BasAccountId)
                .OnDelete(DeleteBehavior.Restrict);




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
                },
                new User
                {
                    Id = "2", // Normally a GUID for Identity users
                    UserName = "testuser2@example.com",
                    NormalizedUserName = "TESTUSER2@EXAMPLE.COM",
                    Email = "testuser2@example.com",
                    NormalizedEmail = "TESTUSER2@EXAMPLE.COM",
                    FirstName = "John",
                    LastName = "Doe",
                    AuthenticatorKey = "XYZ12345",
                    EmailConfirmed = true,
                    PasswordHash = new PasswordHasher<User>().HashPassword(null, "Password1!")
                },
                new User
                {
                    Id = "3", // Normally a GUID for Identity users
                    UserName = "testuser3@example.com",
                    NormalizedUserName = "TESTUSER3@EXAMPLE.COM",
                    Email = "testuser3@example.com",
                    NormalizedEmail = "TESTUSER3@EXAMPLE.COM",
                    FirstName = "John",
                    LastName = "Doe",
                    AuthenticatorKey = "XYZ12345",
                    EmailConfirmed = true,
                    PasswordHash = new PasswordHasher<User>().HashPassword(null, "Password1!")
                }
            );

            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    UserId = "1", // ID of the first user
                    RoleId = "d186da3d-43f6-4fa5-aa10-0fe6e3115173"  // ID of the Manager role
                },
                new IdentityUserRole<string>
                {
                    UserId = "2", // ID of the second user
                    RoleId = "fda748ef-79a4-43a1-ab27-f630b2787818"  // ID of the Admin role
                },
                new IdentityUserRole<string>
                {
                    UserId = "3", // ID of the third user
                    RoleId = "c97af0ce-ca7b-4a19-9c5e-6d09b85af4dd"  // ID of the User role
                }
            );


            // Seed Company data
            modelBuilder.Entity<Company>().HasData(
                new Company { Id = 1, CompanyName = "Test Company", OrgNumber = "1234567890", CompanyDescription = "This is a Company", AmountOfEmployees = 10, Address = "Test adress", TaxId = "1231531432" }
            );

            // Seed Customer data first
            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "Hjalmar Stranninge", Address = "Arenavägen 61", OrganizationNumber = "123456", TaxId = "59315", CompanyId = 1 }
            );

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



            // Seed IngoingInvoice data
            modelBuilder.Entity<IngoingInvoice>().HasData(
                new IngoingInvoice
                {
                    Id = 1,
                    InvoiceNumber = "INV001",
                    InvoiceDate = new DateTime(2023, 01, 05),
                    DueDate = new DateTime(2023, 01, 15),
                    InvoiceTotal = 5000.00m,
                    IsPaid = true,
                    IsBooked = true,
                    TotalTax = 50.00m,
                    CustomerId = "CUST001", // Scanned value
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
                    IsBooked = true,
                    PaymentDetails = "34395139",
                    TotalTax = 50.00m,
                    CustomerId = "CUST002", // Scanned value
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

            modelBuilder.Entity<OutgoingInvoice>().HasData(
    new OutgoingInvoice
    {
        Id = 1,
        InvoiceNumber = "OUT001",
        InvoiceDate = new DateTime(2023, 01, 05),
        DueDate = new DateTime(2023, 01, 15),
        InvoiceTotal = 10000.00m,
        IsPaid = true,
        TotalTax = 500.00m,
        CustomerId = 1, // Ensure this matches the seeded Customer Id
        CompanyId = 1
    }
);

            // Seed InvoiceItems data
            modelBuilder.Entity<InvoiceItems>().HasData(
                new InvoiceItems
                {
                    InvoiceItemId = 1,
                    Description = "Item 1",
                    Quantity = 2,
                    UnitPrice = 1000.00m,
                    Amount = 2000.00m,
                    IngoingInvoiceId = 1 // FK to the first IngoingInvoice
                },
                new InvoiceItems
                {
                    InvoiceItemId = 2,
                    Description = "Item 2",
                    Quantity = 3,
                    UnitPrice = 1000.00m,
                    Amount = 3000.00m,
                    IngoingInvoiceId = 1 // FK to the first IngoingInvoice
                },
                new InvoiceItems
                {
                    InvoiceItemId = 3,
                    Description = "Item 3",
                    Quantity = 5,
                    UnitPrice = 1000.00m,
                    Amount = 5000.00m,
                    IngoingInvoiceId = 2 // FK to the second IngoingInvoice
                }
            );

            // Updated Seed Transaction data over several months
            modelBuilder.Entity<Transaction>().HasData(
                new Transaction { Id = 2001, Amount = 5000.00m, TransactionDate = new DateTime(2023, 01, 05), IsDebit = true, BasAccountId = 1, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2003, Amount = 750.00m, TransactionDate = new DateTime(2023, 01, 15), IsDebit = true, BasAccountId = 1, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2006, Amount = 2500.00m, TransactionDate = new DateTime(2023, 03, 01), IsDebit = true, BasAccountId = 1, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2008, Amount = 3000.00m, TransactionDate = new DateTime(2023, 04, 10), IsDebit = true, BasAccountId = 1, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2012, Amount = 1500.00m, TransactionDate = new DateTime(2023, 06, 01), IsDebit = true, BasAccountId = 1, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },

                new Transaction { Id = 2002, Amount = 1500.00m, TransactionDate = new DateTime(2023, 02, 01), IsDebit = true, BasAccountId = 2, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2004, Amount = 3000.00m, TransactionDate = new DateTime(2023, 02, 15), IsDebit = false, BasAccountId = 2, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },

                new Transaction { Id = 2007, Amount = 9000.00m, TransactionDate = new DateTime(2023, 03, 15), IsDebit = false, BasAccountId = 3, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2011, Amount = 8250.00m, TransactionDate = new DateTime(2023, 05, 15), IsDebit = false, BasAccountId = 3, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },

                new Transaction { Id = 2014, Amount = 4300.00m, TransactionDate = new DateTime(2023, 03, 01), IsDebit = true, BasAccountId = 4, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2015, Amount = 2200.00m, TransactionDate = new DateTime(2023, 03, 15), IsDebit = true, BasAccountId = 5, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },

                new Transaction { Id = 2016, Amount = 2000.00m, TransactionDate = new DateTime(2023, 04, 01), IsDebit = true, BasAccountId = 6, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2017, Amount = 1000.00m, TransactionDate = new DateTime(2023, 05, 10), IsDebit = true, BasAccountId = 7, IngoingInvoiceId = 2, OutgoingInvoiceId = 1, CompanyId = 1 },
                new Transaction { Id = 2018, Amount = 500.00m, TransactionDate = new DateTime(2023, 06, 15), IsDebit = true, BasAccountId = 8, IngoingInvoiceId = 1, OutgoingInvoiceId = 1, CompanyId = 1 }
            );

        }


    }
}
