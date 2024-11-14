using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class OutgoingInvoiceService : IOutgoingInvoiceService
    {
        private readonly IOutgoingInvoiceRepository _invoiceRepository;
        private readonly IBlobStorageService _blobStorageService;
        private readonly ICustomerRepository _customerRepository;

        public OutgoingInvoiceService(IOutgoingInvoiceRepository invoiceRepository,ICustomerRepository customerRepository, IBlobStorageService blobStorageService)
        {
            _customerRepository = customerRepository;
            _invoiceRepository = invoiceRepository;
            _blobStorageService = blobStorageService;
        }
        public async Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId)
        {
            return await _invoiceRepository.GetOutgoingInvoiceByIdAsync(invoiceId);
        }

        public async Task<List<OutgoingInvoice>> GetAllOutgoingInvoicesForCompanyAsync(int companyId)
        {
            return await _invoiceRepository.GetAllOutgoingInvoicesForCompanyAsync(companyId);
        }

        public async Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync()
        {
            return await _invoiceRepository.GetAllOutgoingInvoicesAsync();
        }

        public async Task<int> CreateOutgoingInvoiceAsync(OutgoingInvoiceCreationDTO invoiceDto, int companyId)
        {
            try {
                // Create a new invoice entity from DTO properties
                var invoice = new OutgoingInvoice
                {
                    InvoiceNumber = invoiceDto.InvoiceNumber,
                    InvoiceDate = invoiceDto.InvoiceDate,
                    DueDate = invoiceDto.DueDate,
                    InvoiceTotal = invoiceDto.InvoiceTotal,
                    PaymentDetails = invoiceDto.PaymentDetails,
                    TotalTax = invoiceDto.TotalTax,
                    Items = invoiceDto.Items.Select(itemDto => new InvoiceItems
                    {
                        Description = itemDto.Description,
                        Quantity = itemDto.Quantity,
                        UnitPrice = itemDto.UnitPrice,
                        Amount = itemDto.Amount
                    }).ToList(),
                    IsPaid = false,
                    IsBooked = false
                };

                // Try to find the existing customer by organization number
                var existingCustomer = await _customerRepository.GetCustomerByOrgNumber(invoiceDto.CustomerOrgNumber);

                if (existingCustomer == null)
                {
                    // Create a new customer if none exists
                    var customer = new Customer
                    {
                        Name = invoiceDto.CustomerName,
                        Address = invoiceDto.CustomerAddress,
                        OrganizationNumber = invoiceDto.CustomerOrgNumber,
                        TaxId = invoiceDto.CustomerTaxId,
                        OutgoingInvoices = new List<OutgoingInvoice> { invoice }  // Initialize with the new invoice
                    };

                    // Create the new customer and associate it with the company
                    await _customerRepository.CreateCustomerAsync(customer, companyId);
                }
                else
                {
                    // Check if OutgoingInvoices collection is initialized, if not, initialize it
                    if (existingCustomer.OutgoingInvoices == null)
                    {
                        existingCustomer.OutgoingInvoices = new List<OutgoingInvoice>();
                    }

                    // Add the new invoice to the existing customer
                    existingCustomer.OutgoingInvoices.Add(invoice);

                    // Update the customer to save the new invoice association
                    await _customerRepository.UpdateCustomerWithInvoice(existingCustomer);
                }

                return invoice.Id;



            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the invoice", ex);
            }



        }


        public async Task<bool> UpdateOutgoingInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto)
        {
            var existingInvoice = await _invoiceRepository.GetOutgoingInvoiceByIdAsync(invoiceId);
            if (existingInvoice == null)
            {
                return false;
            }

            // Update the properties of the invoice
            existingInvoice.InvoiceNumber = invoiceDto.InvoiceNumber;
            existingInvoice.InvoiceDate = invoiceDto.InvoiceDate;
            existingInvoice.DueDate = invoiceDto.DueDate;
            existingInvoice.InvoiceTotal = invoiceDto.InvoiceTotal;
            existingInvoice.TotalTax = invoiceDto.TotalTax;
            existingInvoice.IsPaid = invoiceDto.IsPaid;
            existingInvoice.IsBooked = invoiceDto.IsBooked;

            //Map the DTO items to the model items
            existingInvoice.Items = invoiceDto.Items.Select(itemDto => new InvoiceItems
            {
                Description = itemDto.Description,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice,
                Amount = itemDto.Amount,
                IngoingInvoiceId = existingInvoice.Id //FK linking the items to the invoice
            }).ToList();

            return await _invoiceRepository.UpdateOutgoingInvoiceAsync(existingInvoice);
        }

        public async Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId)
        {
            return await _invoiceRepository.DeleteOutgoingInvoiceAsync(invoiceId);
        }

        public async Task<int> GetOutgoingInvoicesTodayAsync()
        {
            return await _invoiceRepository.CountOutgoingInvoicesSinceAsync(DateTime.UtcNow.Date);
        }

        public async Task<int> GetOutgoingInvoicesThisWeekAsync()
        {
            var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
            return await _invoiceRepository.CountOutgoingInvoicesSinceAsync(startOfWeek);
        }

        public async Task<int> GetOutgoingInvoicesThisYearAsync()
        {
            var startOfYear = new DateTime(DateTime.UtcNow.Year, 1, 1);
            return await _invoiceRepository.CountOutgoingInvoicesSinceAsync(startOfYear);
        }
    }
}
