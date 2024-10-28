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
        private readonly ProjectLedgContext _context;
        public async Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId)
        {
            return await _invoiceRepository.GetOutgoingInvoiceByIdAsync(invoiceId);
        }

        public async Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync()
        {
            return await _invoiceRepository.GetAllOutgoingInvoicesAsync();
        }

        public async Task<bool> CreateOutgoingInvoiceAsync(OutgoingInvoiceCreationDTO invoiceDto)
        {
            var invoice = new OutgoingInvoice
            {
                InvoiceNumber = invoiceDto.InvoiceNumber,
                InvoiceDate = invoiceDto.InvoiceDate,
                DueDate = invoiceDto.DueDate,
                InvoiceTotal = invoiceDto.InvoiceTotal,
                PaymentDetails = invoiceDto.PaymentDetails,
                TotalTax = invoiceDto.TotalTax,
                IsPaid = invoiceDto.IsPaid,
                IsOutgoing = invoiceDto.IsOutgoing,
                IsBooked = invoiceDto.IsBooked,
                CustomerName = invoiceDto.CustomerName,
                CustomerAddress = invoiceDto.CustomerAddress,
                CustomerAddressRecipient = invoiceDto.CustomerAddressRecipient
            };

            return await _invoiceRepository.CreateOutgoingInvoiceAsync(invoice);
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
            existingInvoice.IsOutgoing = invoiceDto.IsOutgoing;
            existingInvoice.IsBooked = invoiceDto.IsBooked;

            //Map the DTO items to the model items
            existingInvoice.Items = invoiceDto.Items.Select(itemDto => new InvoiceItems
            {
                Description = itemDto.Description,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice,
                Amount = itemDto.Amount,
                InvoiceId = existingInvoice.Id //FK linking the items to the invoice
            }).ToList();

            return await _invoiceRepository.UpdateOutgoingInvoiceAsync(existingInvoice);
        }

        public async Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId)
        {
            return await _invoiceRepository.DeleteOutgoingInvoiceAsync(invoiceId);
        }
    }
}
