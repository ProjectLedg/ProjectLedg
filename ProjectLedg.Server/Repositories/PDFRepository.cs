using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using System;
using System.IO;
using System.Threading.Tasks;

public class PDFRepository : IPDFRepository
{
    private readonly ProjectLedgContext _context;
    private readonly BlobContainerClient _blobContainerClient;

    public PDFRepository(ProjectLedgContext context, IConfiguration configuration)
    {
        _context = context;

        // initialize the blob service client with the connection string and container name
        string connectionString = configuration["AzureBlobStorage:ConnectionString"];
        string containerName = configuration["AzureBlobStorage:ContainerName"];
        _blobContainerClient = new BlobContainerClient(connectionString, containerName);
    }

    // ssave the invoice to the database and Azure Blob Storage
    public async Task SaveInvoiceAsync(Invoice invoice, string pdfFilePath)
    {
        // Save the file to Azure Blob Storage
        string blobName = $"{invoice.InvoiceNumber}.pdf";
        BlobClient blobClient = _blobContainerClient.GetBlobClient(blobName);

        // Upload the file to Blob Storage
        using (FileStream uploadFileStream = File.OpenRead(pdfFilePath))
        {
            await blobClient.UploadAsync(uploadFileStream, true);
        }

        // SAVE only the blob URL to the database
        invoice.InvoiceFile = System.Text.Encoding.UTF8.GetBytes(blobClient.Uri.ToString());

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();
    }

    // get the invoice from the database
    public async Task<Invoice> GetInvoiceByIdAsync(int id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice != null)
        {
            // the invoice file is a blob URL
            invoice.InvoiceFile = System.Text.Encoding.UTF8.GetBytes(GetBlobUrl(invoice.InvoiceNumber));
        }

        return invoice;
    }

    private string GetBlobUrl(string invoiceNumber)
    {
        BlobClient blobClient = _blobContainerClient.GetBlobClient($"{invoiceNumber}.pdf");
        return blobClient.Uri.ToString();
    }
}
