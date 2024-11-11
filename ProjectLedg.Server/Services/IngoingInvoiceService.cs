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
    public class IngoingInvoiceService : IIngoingInvoiceService
    {
        private readonly IIngoingInvoiceRepository _invoiceRepository;
        private readonly IBlobStorageService _blobStorageService;
        private readonly ProjectLedgContext _context;

        public IngoingInvoiceService(IIngoingInvoiceRepository invoiceRepository, IBlobStorageService blobStorageService, ProjectLedgContext context)
        {
            _invoiceRepository = invoiceRepository;
            _blobStorageService = blobStorageService;
            _context = context;
        }

        public async Task<bool> SaveIngoingInvoiceAsync(InvoiceDTO invoiceDto, string tempFilePath, string userId)
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

                    var result = await _invoiceRepository.SaveIngoingInvoiceAsync(invoice);

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
        public async Task<IngoingInvoice?> GetIngoingInvoiceByIdAsync(int invoiceId)
        {
            return await _invoiceRepository.GetIngoingInvoiceByIdAsync(invoiceId);
        }

        public async Task<IEnumerable<IngoingInvoice>> GetAllIngoingInvoicesAsync()
        {
            return await _invoiceRepository.GetAllIngoingInvoicesAsync();
        }

        public async Task<IngoingInvoice> CreateIngoingInvoiceAsync(InvoiceDTO invoiceDto)
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
                IsBooked = invoiceDto.IsBooked,
                CustomerId = invoiceDto.CustomerId,
                CustomerName = invoiceDto.CustomerName,
                CustomerAddress = invoiceDto.CustomerAddress,
                CustomerAddressRecipient = invoiceDto.CustomerAddressRecipient,
                VendorName = invoiceDto.VendorName,
                VendorAddress = invoiceDto.VendorAddress,
                VendorAddressRecipient = invoiceDto.VendorAddressRecipient,
                VendorTaxId = invoiceDto.VendorTaxId,
                CompanyId = invoiceDto.CompanyId,
            };

            return await _invoiceRepository.CreateIngoingInvoiceAsync(invoice);
        }

        public async Task<bool> UpdateIngoingInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto)
        {
            var existingInvoice = await _invoiceRepository.GetIngoingInvoiceByIdAsync(invoiceId);
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

            return await _invoiceRepository.UpdateIngoingInvoiceAsync(existingInvoice);
        }

        public async Task<bool> DeleteIngoingInvoiceAsync(int invoiceId)
        {
            return await _invoiceRepository.DeleteIngoingInvoiceAsync(invoiceId);
        }


        public async Task<int> GetIngoingInvoicesTodayAsync()
        {
            return await _invoiceRepository.CountIngoingInvoicesSinceAsync(DateTime.UtcNow.Date);
        }

        public async Task<int> GetIngoingInvoicesThisWeekAsync()
        {
            var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
            return await _invoiceRepository.CountIngoingInvoicesSinceAsync(startOfWeek);
        }

        public async Task<int> GetIngoingInvoicesThisYearAsync()
        {
            var startOfYear = new DateTime(DateTime.UtcNow.Year, 1, 1);
            return await _invoiceRepository.CountIngoingInvoicesSinceAsync(startOfYear);
        }
    }
}
