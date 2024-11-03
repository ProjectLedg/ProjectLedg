using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Functions.AssistantFunctions
{
    public class OutgoingInvoiceFunctions : IOutgoingInvoiceFunctions
    {
        private readonly ProjectLedgContext _context;
        private readonly IOutgoingInvoiceService _invoiceService;

        public OutgoingInvoiceFunctions(ProjectLedgContext context, IOutgoingInvoiceService invoiceService)
        {
            _context = context;
            _invoiceService = invoiceService;
        }

        public async Task<string> GetUnpaidOutgoingInvoicesForCompany(int companyId)
        {
            var invoices = await _context.OutgoingInvoices
                .Where(i => i.CompanyId == companyId && !i.IsPaid)
                .ToListAsync();

            if (!invoices.Any())
                return $"Inga obetalda utgående fakturor för Företag med ID: {companyId}.";

            var invoicesInfo = invoices.Select(i =>
                $"Invoice {i.InvoiceNumber}: Due Date = {i.DueDate}, Amount = {i.InvoiceTotal}");

            return $"Unpaid outgoing invoices for company ID {companyId}:\n" + string.Join("\n", invoicesInfo);
        }

        public async Task<string> GetOutgoingInvoicesByCompanyNameAndYear(string companyName, int year)
        {
            var invoices = await _context.OutgoingInvoices
                .Include(i => i.Company)
                .Where(i => i.Company.CompanyName == companyName && i.InvoiceDate.Year == year)
                .ToListAsync();

            if (!invoices.Any())
                return $"Inga fakturor för företaget: '{companyName}' under året: {year}.";

            var invoicesInfo = invoices.Select(i =>
                $"Faktura Nummer: {i.InvoiceNumber}: Datum: {i.InvoiceDate}, Total: {i.InvoiceTotal}");

            return $"Fakturor för företaget: '{companyName}' för Året: {year}:\n" + string.Join("\n", invoicesInfo);
        }

    }
}
