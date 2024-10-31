﻿using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IIngoingInvoiceRepository
    {
        Task<IngoingInvoice?> GetIngoingInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<IngoingInvoice>> GetAllIngoingInvoicesAsync();
        Task<bool> CreateIngoingInvoiceAsync(IngoingInvoice invoice);
        Task<bool> UpdateIngoingInvoiceAsync(IngoingInvoice invoice);
        Task<bool> DeleteIngoingInvoiceAsync(int invoiceId);
        Task<bool> SaveIngoingInvoiceAsync(IngoingInvoice invoice);
    }
}
