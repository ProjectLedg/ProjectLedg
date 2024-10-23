using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class IngoingInvoiceRepository : IInvoiceRepository
    {
        private readonly ProjectLedgContext _context;

        public IngoingInvoiceRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<IngoingInvoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            return await _context.IngoingInvoices.FindAsync(invoiceId);
        }

        public async Task<IEnumerable<IngoingInvoice>> GetAllInvoicesAsync()
        {
            return await _context.IngoingInvoices.ToListAsync();
        }

        public async Task<bool> CreateInvoiceAsync(IngoingInvoice invoice)
        {
            await _context.IngoingInvoices.AddAsync(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateInvoiceAsync(IngoingInvoice invoice)
        {
            _context.IngoingInvoices.Update(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteInvoiceAsync(int invoiceId)
        {
            var invoice = await _context.IngoingInvoices.FindAsync(invoiceId);
            if (invoice == null)
            {
                return false;
            }

            _context.IngoingInvoices.Remove(invoice);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SaveInvoiceAsync(IngoingInvoice invoice)
        {
            try
            {
                await _context.IngoingInvoices.AddAsync(invoice);
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving invoice: {ex.Message}");
                return false;
            }
        }
    }
}
