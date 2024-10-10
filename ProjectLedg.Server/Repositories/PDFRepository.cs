using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using System;
using System.IO;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

public class PDFRepository : IPDFRepository
{
    private readonly ProjectLedgContext _context;
    private readonly BlobContainerClient _blobContainerClient;

    public PDFRepository(ProjectLedgContext context, IConfiguration configuration)
    {
        _context = context;
    }

    // ssave the invoice to the database and Azure Blob Storage

    //MAIN ENDPOINT THE OTHER IS TEST
    //public async Task SaveInvoiceAsync(Invoice invoice, string blobUrl)
    //{
    //    // Save the Blob URL as the PDF file path
    //    invoice.InvoiceFilePath = blobUrl;

    //    // Save the invoice details to the database
    //    _context.Invoices.Add(invoice);
    //    await _context.SaveChangesAsync();
    //}

    public async Task<Invoice> GetInvoiceByIdAsync(int id)
    {
        return await _context.Invoices.FindAsync(id);
    }
    //TEST ENDPOINT
    public async Task SaveInvoiceAsync(Invoice invoice, string blobUrl)
    {
        // Store the Blob URL in the invoice
        invoice.InvoiceFilePath = blobUrl;

        // Save the invoice data to the database
        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();
    }


    private string GetBlobUrl(string invoiceNumber)
    {
        BlobClient blobClient = _blobContainerClient.GetBlobClient($"{invoiceNumber}.pdf");
        return blobClient.Uri.ToString();
    }
}
