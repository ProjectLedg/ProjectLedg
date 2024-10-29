﻿using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IOutgoingInvoiceRepository
    {
        Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync();
        Task<bool> CreateOutgoingInvoiceAsync(OutgoingInvoice invoice);
        Task<bool> UpdateOutgoingInvoiceAsync(OutgoingInvoice invoice);
        Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId);
    }
}