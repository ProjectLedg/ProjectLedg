﻿using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.PDF;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IPDFService
    {
        byte[] GenerateAnnualReportPdf();
        Task<string> ProcessInvoiceAsync(IFormFile file);
        Task<string> TestUploadPdfAsync(IFormFile file);
    }
}
