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

        public async Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync()
        {
            return await _invoiceRepository.GetAllOutgoingInvoicesAsync();
        }

        public async Task<bool> CreateOutgoingInvoiceAsync(OutgoingInvoiceCreationDTO invoiceDto, int companyId)
        {
            

            // Create a new invoice entity from DTO properties
            var invoice = new OutgoingInvoice
            {
                InvoiceNumber = invoiceDto.InvoiceNumber,
                InvoiceDate = invoiceDto.InvoiceDate,
                DueDate = invoiceDto.DueDate,
                InvoiceTotal = invoiceDto.InvoiceTotal,
                PaymentDetails = invoiceDto.PaymentDetails,
                TotalTax = invoiceDto.TotalTax,
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

            return true;
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
    }
}
