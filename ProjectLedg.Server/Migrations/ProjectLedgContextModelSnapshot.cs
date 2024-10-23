﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjectLedg.Server.Data;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    [DbContext(typeof(ProjectLedgContext))]
    partial class ProjectLedgContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CompanyUser", b =>
                {
                    b.Property<int>("CompaniesId")
                        .HasColumnType("int");

                    b.Property<string>("UsersId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("CompaniesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("CompanyUser");

                    b.HasData(
                        new
                        {
                            CompaniesId = 1,
                            UsersId = "1"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.BasAccount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AccountNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CompanyId")
                        .HasColumnType("int");

                    b.Property<decimal>("Credit")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("Debit")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("BasAccounts");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            AccountNumber = "1000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 12750m,
                            Description = "Assets",
                            Year = 2023
                        },
                        new
                        {
                            Id = 2,
                            AccountNumber = "2000",
                            CompanyId = 1,
                            Credit = 3000m,
                            Debit = 1500m,
                            Description = "Liabilities",
                            Year = 2023
                        },
                        new
                        {
                            Id = 3,
                            AccountNumber = "3000",
                            CompanyId = 1,
                            Credit = 17250m,
                            Debit = 0m,
                            Description = "Revenue Account",
                            Year = 2023
                        },
                        new
                        {
                            Id = 4,
                            AccountNumber = "4000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 4300m,
                            Description = "Material Costs",
                            Year = 2023
                        },
                        new
                        {
                            Id = 5,
                            AccountNumber = "5000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 2200m,
                            Description = "Other External Costs",
                            Year = 2023
                        },
                        new
                        {
                            Id = 6,
                            AccountNumber = "6000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 2000m,
                            Description = "Depreciation Costs",
                            Year = 2023
                        },
                        new
                        {
                            Id = 7,
                            AccountNumber = "7000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 1000m,
                            Description = "Personnel Costs",
                            Year = 2023
                        },
                        new
                        {
                            Id = 8,
                            AccountNumber = "8000",
                            CompanyId = 1,
                            Credit = 0m,
                            Debit = 500m,
                            Description = "Extraordinary Costs",
                            Year = 2023
                        });
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AmountOfEmployees")
                        .HasColumnType("int");

                    b.Property<string>("CompanyDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OrgNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Companies");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            AmountOfEmployees = 10,
                            CompanyDescription = "This is a Company",
                            CompanyName = "Test Company",
                            OrgNumber = "1234567890"
                        });
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.EmailList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Emails");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Invoice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CompanyId")
                        .HasColumnType("int");

                    b.Property<string>("CustomerAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerAddressRecipient")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CustomerName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("InvoiceDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("InvoiceFilePath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("InvoiceNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("InvoiceTotal")
                        .HasColumnType("decimal(18,2)");

                    b.Property<bool>("IsBooked")
                        .HasColumnType("bit");

                    b.Property<bool>("IsOutgoing")
                        .HasColumnType("bit");

                    b.Property<bool>("IsPaid")
                        .HasColumnType("bit");

                    b.Property<string>("PaymentDetails")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("TotalTax")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("VendorAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("VendorAddressRecipient")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("VendorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("VendorTaxId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Invoices");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CompanyId = 1,
                            CustomerAddress = "Arenavägen 61",
                            CustomerAddressRecipient = "Hjalmar Stranninge AB",
                            CustomerId = "1",
                            CustomerName = "Hjalmar Stranninge",
                            DueDate = new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceFilePath = "https://localhost:7223",
                            InvoiceNumber = "INV001",
                            InvoiceTotal = 5750.00m,
                            IsBooked = true,
                            IsOutgoing = true,
                            IsPaid = true,
                            TotalTax = 50.00m,
                            VendorAddress = "Arenavägen 61",
                            VendorAddressRecipient = "Erkan",
                            VendorName = "Blues Kök & Bar",
                            VendorTaxId = "59315"
                        },
                        new
                        {
                            Id = 2,
                            CompanyId = 1,
                            CustomerAddress = "Arenavägen 61",
                            CustomerAddressRecipient = "Hjalmar Stranninge AB",
                            CustomerId = "1",
                            CustomerName = "Hjalmar Stranninge",
                            DueDate = new DateTime(2023, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceFilePath = "https://localhost:7223",
                            InvoiceNumber = "INV002",
                            InvoiceTotal = 4500.00m,
                            IsBooked = true,
                            IsOutgoing = true,
                            IsPaid = true,
                            PaymentDetails = "34395139",
                            TotalTax = 50.00m,
                            VendorAddress = "Arenavägen 61",
                            VendorAddressRecipient = "Erkan",
                            VendorName = "Blues Kök & Bar",
                            VendorTaxId = "59315"
                        },
                        new
                        {
                            Id = 3,
                            CompanyId = 1,
                            CustomerAddress = "Arenavägen 61",
                            CustomerAddressRecipient = "Hjalmar Stranninge AB",
                            CustomerId = "1",
                            CustomerName = "Hjalmar Stranninge",
                            DueDate = new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceFilePath = "https://localhost:7223",
                            InvoiceNumber = "INV003",
                            InvoiceTotal = 15800.00m,
                            IsBooked = true,
                            IsOutgoing = true,
                            IsPaid = true,
                            TotalTax = 50.00m,
                            VendorAddress = "Arenavägen 61",
                            VendorAddressRecipient = "Erkan",
                            VendorName = "Blues Kök & Bar",
                            VendorTaxId = "59315"
                        },
                        new
                        {
                            Id = 4,
                            CompanyId = 1,
                            CustomerAddress = "Arenavägen 61",
                            CustomerAddressRecipient = "Hjalmar Stranninge AB",
                            CustomerId = "1",
                            CustomerName = "Hjalmar Stranninge",
                            DueDate = new DateTime(2023, 4, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceFilePath = "https://localhost:7223",
                            InvoiceNumber = "INV004",
                            InvoiceTotal = 72000.00m,
                            IsBooked = true,
                            IsOutgoing = true,
                            IsPaid = true,
                            TotalTax = 50.00m,
                            VendorAddress = "Arenavägen 61",
                            VendorAddressRecipient = "Erkan",
                            VendorName = "Blues Kök & Bar",
                            VendorTaxId = "59315"
                        },
                        new
                        {
                            Id = 1,
                            CompanyId = 1,
                            CustomerAddress = "Arenavägen 61",
                            CustomerAddressRecipient = "Hjalmar Stranninge AB",
                            CustomerId = "1",
                            CustomerName = "Hjalmar Stranninge",
                            DueDate = new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            InvoiceFilePath = "https://localhost:7223",
                            InvoiceNumber = "INV005",
                            InvoiceTotal = 11250.00m,
                            IsBooked = true,
                            IsOutgoing = true,
                            IsPaid = true,
                            TotalTax = 50.00m,
                            VendorAddress = "Arenavägen 61",
                            VendorAddressRecipient = "Erkan",
                            VendorName = "Blues Kök & Bar",
                            VendorTaxId = "59315"
                        });
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.InvoiceItems", b =>
                {
                    b.Property<int>("InvoiceItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("InvoiceItemId"));

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("InvoiceId")
                        .HasColumnType("int");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<decimal>("UnitPrice")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("InvoiceItemId");

                    b.HasIndex("InvoiceId");

                    b.ToTable("InvoiceItems");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Transaction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("BasAccountId")
                        .HasColumnType("int");

                    b.Property<int>("InvoiceId")
                        .HasColumnType("int");

                    b.Property<bool>("IsDebit")
                        .HasColumnType("bit");

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("BasAccountId");

                    b.HasIndex("InvoiceId");

                    b.ToTable("Transactions");

                    b.HasData(
                        new
                        {
                            Id = 2001,
                            Amount = 5000.00m,
                            BasAccountId = 1,
                            InvoiceId = 1,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2003,
                            Amount = 750.00m,
                            BasAccountId = 1,
                            InvoiceId = 1,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2006,
                            Amount = 2500.00m,
                            BasAccountId = 1,
                            InvoiceId = 3,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2008,
                            Amount = 3000.00m,
                            BasAccountId = 1,
                            InvoiceId = 4,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2012,
                            Amount = 1500.00m,
                            BasAccountId = 1,
                            InvoiceId = 5,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2002,
                            Amount = 1500.00m,
                            BasAccountId = 2,
                            InvoiceId = 2,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2004,
                            Amount = 3000.00m,
                            BasAccountId = 2,
                            InvoiceId = 2,
                            IsDebit = false,
                            TransactionDate = new DateTime(2023, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2007,
                            Amount = 9000.00m,
                            BasAccountId = 3,
                            InvoiceId = 3,
                            IsDebit = false,
                            TransactionDate = new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2011,
                            Amount = 8250.00m,
                            BasAccountId = 3,
                            InvoiceId = 5,
                            IsDebit = false,
                            TransactionDate = new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2014,
                            Amount = 43000.00m,
                            BasAccountId = 4,
                            InvoiceId = 3,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2015,
                            Amount = 2200.00m,
                            BasAccountId = 5,
                            InvoiceId = 4,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2016,
                            Amount = 2000.00m,
                            BasAccountId = 6,
                            InvoiceId = 4,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2017,
                            Amount = 1000.00m,
                            BasAccountId = 7,
                            InvoiceId = 5,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2018,
                            Amount = 500.00m,
                            BasAccountId = 8,
                            InvoiceId = 5,
                            IsDebit = true,
                            TransactionDate = new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        });
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("AuthenticatorKey")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "1",
                            AccessFailedCount = 0,
                            AuthenticatorKey = "XYZ12345",
                            ConcurrencyStamp = "9fa92307-a647-480e-91e9-0b602472b167",
                            Email = "testuser@example.com",
                            EmailConfirmed = true,
                            FirstName = "John",
                            LastName = "Doe",
                            LockoutEnabled = false,
                            NormalizedEmail = "TESTUSER@EXAMPLE.COM",
                            NormalizedUserName = "TESTUSER@EXAMPLE.COM",
                            PasswordHash = "AQAAAAIAAYagAAAAEHlA6xzz7nHwuU387kgcoRMGB530rsqSaOCoplZ85gHxt6IIFg8ZklzwOvh/koDugQ==",
                            PhoneNumberConfirmed = false,
                            SecurityStamp = "ed45be2a-f940-4ace-b160-e7e10b65a98c",
                            TwoFactorEnabled = false,
                            UserName = "testuser@example.com"
                        });
                });

            modelBuilder.Entity("CompanyUser", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.Company", null)
                        .WithMany()
                        .HasForeignKey("CompaniesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ProjectLedg.Server.Data.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ProjectLedg.Server.Data.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.BasAccount", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.Company", null)
                        .WithMany("BasAccounts")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Invoice", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.Company", null)
                        .WithMany("Invoices")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.InvoiceItems", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.Invoice", "Invoice")
                        .WithMany("Items")
                        .HasForeignKey("InvoiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Invoice");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Transaction", b =>
                {
                    b.HasOne("ProjectLedg.Server.Data.Models.BasAccount", "BasAccount")
                        .WithMany("Transactions")
                        .HasForeignKey("BasAccountId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ProjectLedg.Server.Data.Models.Invoice", "Invoice")
                        .WithMany("Transactions")
                        .HasForeignKey("InvoiceId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("BasAccount");

                    b.Navigation("Invoice");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.BasAccount", b =>
                {
                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Company", b =>
                {
                    b.Navigation("BasAccounts");

                    b.Navigation("Invoices");
                });

            modelBuilder.Entity("ProjectLedg.Server.Data.Models.Invoice", b =>
                {
                    b.Navigation("Items");

                    b.Navigation("Transactions");
                });
#pragma warning restore 612, 618
        }
    }
}
