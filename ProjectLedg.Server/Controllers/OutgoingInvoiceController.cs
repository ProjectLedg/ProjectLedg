﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OutgoingInvoiceController : ControllerBase
    {
        private readonly IOutgoingInvoiceService _invoiceService;

        public OutgoingInvoiceController(IOutgoingInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }
        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> GetInvoice(int invoiceId)
        {
            var invoice = await _invoiceService.GetOutgoingInvoiceByIdAsync(invoiceId);
            if (invoice == null)
            {
                return NotFound("Invoice not found.");
            }
            return Ok(invoice);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllOutgoingInvoicesAsync();
            return Ok(invoices);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] OutgoingInvoiceCreationDTO invoiceDto)
        {
            var result = await _invoiceService.CreateOutgoingInvoiceAsync(invoiceDto);
            if (!result)
            {
                return StatusCode(500, "An error occurred while creating the invoice.");
            }

            return Ok(new { message = "Invoice created successfully!" });
        }

        [HttpPut("update/{invoiceId}")]
        public async Task<IActionResult> UpdateInvoice(int invoiceId, [FromBody] InvoiceDTO invoiceDto)
        {
            var result = await _invoiceService.UpdateOutgoingInvoiceAsync(invoiceId, invoiceDto);
            if (!result)
            {
                return StatusCode(500, "An error occurred while updating the invoice.");
            }

            return Ok(new { message = "Invoice updated successfully!" });
        }

        [HttpDelete("delete/{invoiceId}")]
        public async Task<IActionResult> DeleteInvoice(int invoiceId)
        {
            var result = await _invoiceService.DeleteOutgoingInvoiceAsync(invoiceId);
            if (!result)
            {
                return StatusCode(500, "An error occurred while deleting the invoice.");
            }

            return Ok(new { message = "Invoice deleted successfully!" });
        }
    }
}