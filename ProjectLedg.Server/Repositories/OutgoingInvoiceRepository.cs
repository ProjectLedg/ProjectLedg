using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class OutgoingInvoiceRepository : IOutgoingInvoiceRepository
    {
        private readonly ProjectLedgContext _context;

        public OutgoingInvoiceRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId)
        {
            var invoice = await _context.OutgoingInvoices
        .Include(o => o.Items) // Eager load the InvoiceItems
        .FirstOrDefaultAsync(o => o.Id == invoiceId);
            if (invoice == null)
            {
                return null;
            }
            return invoice;
        }

        public async Task<List<OutgoingInvoice>> GetAllOutgoingInvoicesForCompanyAsync(int companyId)
        {
            return await _context.OutgoingInvoices.Where(i => i.CompanyId == companyId).ToListAsync();
        }
        public async Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync()
        {
            return await _context.OutgoingInvoices.ToListAsync();
        }

        public async Task<bool> CreateOutgoingInvoiceAsync(OutgoingInvoice invoice)
        {
            await _context.OutgoingInvoices.AddAsync(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateOutgoingInvoiceAsync(OutgoingInvoice invoice)
        {
            _context.OutgoingInvoices.Update(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId)
        {
            var invoice = await _context.OutgoingInvoices.FindAsync(invoiceId);

            _context.OutgoingInvoices.Remove(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<int> CountOutgoingInvoicesSinceAsync(DateTime startDate)
        {
            return await _context.OutgoingInvoices
                .Where(invoice => invoice.InvoiceDate >= startDate)
                .CountAsync();
        }
    }
}
