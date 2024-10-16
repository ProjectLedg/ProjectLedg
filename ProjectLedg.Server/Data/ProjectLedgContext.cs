using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data.Models;

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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();

        }
    }
}
