using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ProjectLedg.Server.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IBlobStorageService _blobStorageService;
        private readonly ProjectLedgContext _context;

        public InvoiceService(IInvoiceRepository invoiceRepository, IBlobStorageService blobStorageService, ProjectLedgContext context)
        {
            _invoiceRepository = invoiceRepository;
            _blobStorageService = blobStorageService;
            _context = context;
        }

        public async Task<bool> SaveInvoiceAsync(InvoiceDTO invoiceDto, string tempFilePath, string userId)
        {
            try
            {
                var fileInfo = new FileInfo(tempFilePath);
                if (fileInfo.Length == 0 || fileInfo.Length > 10 * 1024 * 1024)
                {
                    return false;
                }

                using (var tempFileStream = System.IO.File.OpenRead(tempFilePath))
                {
                    var blobUrl = await _blobStorageService.UploadBlobAsync(tempFileStream, fileInfo.Name);
                    Console.WriteLine($"Blob uploaded successfully: {blobUrl}");

                    var company = await _context.Companies.FindAsync(invoiceDto.CompanyId);
                    if (company == null)
                    {
                        Console.WriteLine("Company not found");
                        return false;
                    }

                    var invoice = new IngoingInvoice
                    {
                        InvoiceNumber = invoiceDto.InvoiceNumber,
                        InvoiceDate = invoiceDto.InvoiceDate,
                        DueDate = invoiceDto.DueDate,
                        InvoiceTotal = invoiceDto.InvoiceTotal,
                        CompanyId = company.Id,
                        CustomerName = invoiceDto.CustomerName,
                        CustomerAddress = invoiceDto.CustomerAddress,
                        CustomerAddressRecipient = invoiceDto.CustomerAddressRecipient,
                        VendorName = invoiceDto.VendorName,
                        VendorAddress = invoiceDto.VendorAddress,
                        VendorAddressRecipient = invoiceDto.VendorAddressRecipient,
                        VendorTaxId = invoiceDto.VendorTaxId,
                        InvoiceFilePath = blobUrl,
                        TotalTax = invoiceDto.TotalTax,
                        CustomerId = userId // Assuming userId is valid
                    };

                    foreach (var itemDto in invoiceDto.Items)
                    {
                        var invoiceItem = new InvoiceItems
                        {
                            Description = itemDto.Description,
                            Quantity = itemDto.Quantity,
                            UnitPrice = itemDto.UnitPrice,
                            Amount = itemDto.Amount
                        };

                        invoice.Items.Add(invoiceItem);
                    }

                    Console.WriteLine("Attempting to save invoice to database...");

                    var result = await _invoiceRepository.SaveInvoiceAsync(invoice);

                    if (!result)
                    {
                        Console.WriteLine("Failed to save invoice to database");
                        return false;
                    }

                    if (System.IO.File.Exists(tempFilePath))
                    {
                        System.IO.File.Delete(tempFilePath);
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                return false;
            }
        }


        //other crud operations for Manual use
        public async Task<IngoingInvoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            return await _invoiceRepository.GetInvoiceByIdAsync(invoiceId);
        }

        public async Task<IEnumerable<IngoingInvoice>> GetAllInvoicesAsync()
        {
            return await _invoiceRepository.GetAllInvoicesAsync();
        }

        public async Task<bool> CreateInvoiceAsync(InvoiceDTO invoiceDto)
        {
            var invoice = new IngoingInvoice
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
                CustomerAddressRecipient = invoiceDto.CustomerAddressRecipient,
                VendorName = invoiceDto.VendorName,
                VendorAddress = invoiceDto.VendorAddress,
                VendorAddressRecipient = invoiceDto.VendorAddressRecipient,
                VendorTaxId = invoiceDto.VendorTaxId
            };

            return await _invoiceRepository.CreateInvoiceAsync(invoice);
        }

        public async Task<bool> UpdateInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto)
        {
            var existingInvoice = await _invoiceRepository.GetInvoiceByIdAsync(invoiceId);
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
            existingInvoice.CustomerName = invoiceDto.CustomerName;
            existingInvoice.CustomerAddress = invoiceDto.CustomerAddress;
            existingInvoice.CustomerAddressRecipient = invoiceDto.CustomerAddressRecipient;
            existingInvoice.VendorName = invoiceDto.VendorName;
            existingInvoice.VendorAddress = invoiceDto.VendorAddress;
            existingInvoice.VendorAddressRecipient = invoiceDto.VendorAddressRecipient;
            existingInvoice.VendorTaxId = invoiceDto.VendorTaxId;

            //Map the DTO items to the model items
            existingInvoice.Items = invoiceDto.Items.Select(itemDto => new InvoiceItems
            {
                Description = itemDto.Description,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice,
                Amount = itemDto.Amount,
                IngoingInvoiceId = existingInvoice.Id //FK linking the items to the invoice
            }).ToList();

            return await _invoiceRepository.UpdateInvoiceAsync(existingInvoice);
        }

        public async Task<bool> DeleteInvoiceAsync(int invoiceId)
        {
            return await _invoiceRepository.DeleteInvoiceAsync(invoiceId);
        }
    }
}
