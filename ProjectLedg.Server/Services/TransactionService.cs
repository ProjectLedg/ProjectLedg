using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Transaction;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class TransactionService: ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<List<TransactionBookingDTO>> GetAllTransactionsForBookingAsync(int companyId) 
        {

            // Get all transactions for company
            List<Transaction> transactions = await _transactionRepository.GetAllTransactionsForCompanyAsync(companyId);

            // Group transactions by invoice as we want the bas accs per invoice
            var groupedTransactions = transactions
                .Where(t => t.IngoingInvoice != null || t.OutgoingInvoice != null)
                .GroupBy(t => (object)t.IngoingInvoice ?? t.OutgoingInvoice);

            // Initialize results lists
            var transactionBookingList = new List<TransactionBookingDTO>();

            foreach (var invoiceGroup in groupedTransactions)
            {
                // The currnt invoice in the loop
                var invoice = invoiceGroup.Key;

                var transactionBooking = new TransactionBookingDTO
                {
                    // Transaction 
                    // Only need the date - select the first one as they're all the same for each invoice
                    TransactionDate = invoiceGroup.First().TransactionDate,
                    // Something to identify if it is ingoing or outgoing?


                    // Invoice
                    // Set depending on ingoing or outgoing
                    InvoiceNumber = invoice is IngoingInvoice ingoingInvoice
                        ? ingoingInvoice.InvoiceNumber
                        : ((OutgoingInvoice)invoice).InvoiceNumber,
                    InvoiceTotal = invoice is IngoingInvoice ingoingInvoiceTotal
                        ? ingoingInvoiceTotal.InvoiceTotal
                        : ((OutgoingInvoice)invoice).InvoiceTotal,
                    VendorOrCustomerName = invoice is IngoingInvoice ingoingVendor
                        ? ingoingVendor.VendorName
                        : ((OutgoingInvoice)invoice).Customer.Name,

                    // BasAccount 
                    // Collect all unique BasAccounts for invoice
                    BasAccounts = invoiceGroup
                        .Select(t => t.BasAccount) // Get BasAcc from transaction
                        .Distinct() // Get only unique BasAccs
                        .Select(basAccount => new BasAccountBookingDTO
                        {
                            AccountNumber = basAccount.AccountNumber,
                            Description = basAccount.Description,
                            Debit = basAccount.Debit,
                            Credit = basAccount.Credit,
                        })
                        .ToList()
                };

                // Add to result list 
                transactionBookingList.Add(transactionBooking);
            }

            return transactionBookingList;
        }
    }
}
