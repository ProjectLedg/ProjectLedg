using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services.AssistantFunctions
{
    public class IngoingInvoiceFunctions : IIngoingInvoiceFunctions
    {
        private readonly ProjectLedgContext _context;
        private readonly IIngoingInvoiceService _invoiceService;

        public IngoingInvoiceFunctions(ProjectLedgContext context, IIngoingInvoiceService invoiceService)
        {
            _context = context;
            _invoiceService = invoiceService;
        }

        public async Task<string> GetUnpaidIngoingInvoicesForCompany(int companyId)
        {
            var invoices = await _context.IngoingInvoices
                .Where(i => i.CompanyId == companyId && !i.IsPaid)
                .Include(i => i.Company)
                .ToListAsync();

            if (!invoices.Any())
            {
                return $"Jag hittade inga obetalda fakturor för företaget med företags Id: {companyId}.";
            }

            var invoicesInfo = invoices.Select(i =>
                $"Fakturanummer: {i.InvoiceNumber}, Betala senast: {i.DueDate.ToShortDateString()}, Total: {i.InvoiceTotal}");

            return $"Obetalda fakturor för företaget '{invoices.First().Company.CompanyName}' med ID: {companyId}:\n" +
                   string.Join("\n", invoicesInfo);
        }

        public async Task<string> GetInvoices(string companyName, int? year = null, int? month = null)
        {
            var invoicesQuery = _context.IngoingInvoices
                .Include(i => i.Company)
                .Where(i => i.Company.CompanyName.ToLower() == companyName.ToLower());

            // Apply year filter if specified
            if (year.HasValue)
            {
                invoicesQuery = invoicesQuery.Where(i => i.InvoiceDate.Year == year.Value);
            }

            // Apply month filter if specified
            if (month.HasValue)
            {
                invoicesQuery = invoicesQuery.Where(i => i.InvoiceDate.Month == month.Value);
            }

            var invoices = await invoicesQuery.ToListAsync();

            if (!invoices.Any())
            {
                var filterDescription = $"För företaget: '{companyName}'";
                if (year.HasValue) filterDescription += $" under året: {year}";
                if (month.HasValue) filterDescription += $" och månaden: {month}";

                return $"Dessvärre hittades inga fakturor {filterDescription}.";
            }

            var invoicesInfo = invoices.Select(i =>
                $"Fakturanummer: {i.InvoiceNumber}, Datum: {i.InvoiceDate.ToShortDateString()}, Total: {i.InvoiceTotal}");

            var filterDescriptionSuccess = $"för företaget: '{companyName}'";
            if (year.HasValue) filterDescriptionSuccess += $" under året: {year}";
            if (month.HasValue) filterDescriptionSuccess += $" och månaden: {month}";

            return $"Fakturor {filterDescriptionSuccess}:\n" + string.Join("\n", invoicesInfo);
        }
    }
}
