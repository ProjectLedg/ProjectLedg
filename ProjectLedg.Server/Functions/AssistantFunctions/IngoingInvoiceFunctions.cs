using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models.DTOs.Functions.IngoingInvoice;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services.AssistantFunctions
{
    public class IngoingInvoiceFunctions : IIngoingInvoiceFunctions
    {
        private readonly ProjectLedgContext _context;
        private readonly IIngoingInvoiceService _invoiceService;
        private readonly ILogger<IngoingInvoiceFunctions> _logger;

        public IngoingInvoiceFunctions(ProjectLedgContext context, IIngoingInvoiceService invoiceService, ILogger<IngoingInvoiceFunctions> logger)
        {
            _context = context;
            _invoiceService = invoiceService;
            _logger = logger;
        }

        public async Task<List<IngoingInvoiceFunctionDTO>> GetUnpaidInvoicesForCompanyAsync(int companyId)
        {
            _logger.LogInformation("Fetching unpaid incoming invoices for company ID: {CompanyId}", companyId);

            var invoices = await _context.IngoingInvoices
                .Where(i => i.CompanyId == companyId && !i.IsPaid)
                .Include(i => i.Company)
                .Select(i => new IngoingInvoiceFunctionDTO
                {
                    InvoiceNumber = i.InvoiceNumber,
                    InvoiceDate = i.InvoiceDate,
                    DueDate = i.DueDate,
                    InvoiceTotal = i.InvoiceTotal
                })
                .ToListAsync();

            if (!invoices.Any())
            {
                _logger.LogWarning("No unpaid incoming invoices found for company ID: {CompanyId}", companyId);
                return null; // Caller can handle empty case
            }

            _logger.LogInformation("Found {InvoiceCount} unpaid invoices for company ID: {CompanyId}", invoices.Count, companyId);
            return invoices;
        }


        public async Task<string> GetInvoices(string companyName, int? year = null, int? month = null)
        {
            _logger.LogInformation("Fetching invoices for company: {CompanyName}, Year: {Year}, Month: {Month}",
                companyName, year, month);

            var invoicesQuery = _context.IngoingInvoices
                .Include(i => i.Company)
                .Where(i => i.Company.CompanyName.ToLower() == companyName.ToLower());

            if (year.HasValue)
            {
                _logger.LogInformation("Applying year filter: {Year}", year);
                invoicesQuery = invoicesQuery.Where(i => i.InvoiceDate.Year == year.Value);
            }

            if (month.HasValue)
            {
                _logger.LogInformation("Applying month filter: {Month}", month);
                invoicesQuery = invoicesQuery.Where(i => i.InvoiceDate.Month == month.Value);
            }

            var invoices = await invoicesQuery.ToListAsync();

            if (!invoices.Any())
            {
                var filterDescription = $"För företaget: '{companyName}'";
                if (year.HasValue) filterDescription += $" under året: {year}";
                if (month.HasValue) filterDescription += $" och månaden: {month}";

                _logger.LogWarning("No invoices found {FilterDescription}", filterDescription);
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
