using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ProjectLedgContext _context;

        public CompanyRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<Company> CreateCompanyAsync(Company company)
        {
            if(_context.Companies.Any(c => c.OrgNumber == company.OrgNumber))
            {
                return null;
            }
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            return await _context.Companies.ToListAsync();
        }

        public async Task<IEnumerable<Company>> GetCompaniesForUserAsync(string userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .SelectMany(c => c.Companies)
                .ToListAsync();
        }

        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            return await _context.Companies.Include(c => c.BasAccounts).FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
