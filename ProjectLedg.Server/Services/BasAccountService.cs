using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.BasAccount;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using Sprache;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;

public class BasAccountService : IBasAccountService
{
    private readonly string _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");
    private readonly ICompanyService _companyService;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;
    private readonly IBasAccountRepo _basAccountRepo;

    public BasAccountService(ICompanyService companyService, IIngoingInvoiceService ingoingInvoiceService, IBasAccountRepo basAccountRepo)
    {
        _companyService = companyService;
        _ingoingInvoiceService = ingoingInvoiceService;
        _basAccountRepo = basAccountRepo;
    }


    public List<BasAccount> GetBasAccounts()
    {
        var basAccounts = new List<BasAccount>();

        if (!File.Exists(_csvFilePath))
        {
            throw new FileNotFoundException("Baskontoplanen CSV file not found.");
        }

        var lines = File.ReadAllLines(_csvFilePath);
        foreach (var line in lines.Skip(1)) //skipping the header row
        {
            var fields = line.Split(',');

            if (fields.Length >= 5)
            {
                basAccounts.Add(new BasAccount
                {
                    AccountNumber = fields[0].Trim(),
                    Description = fields[1].Trim(),
                    Debit = decimal.TryParse(fields[2], out var debit) ? debit : 0,
                    Credit = decimal.TryParse(fields[3], out var credit) ? credit : 0,
                    Year = int.TryParse(fields[4], out var year) ? year : 0
                });
            }
        }

        return basAccounts;
    }


    public async Task<ResultObject> AddBasAccountsToCompanyAsync(List<BasAccountDTO> basAccountsDTO, IngoingInvoice invoice, int companyId)
    {
        var company = await _companyService.GetCompanyByIdAsync(companyId);

        // TODO: Better error handling
        if (company == null)
            return new ResultObject { Message = "Commpany was not found.", Success = false };


        // Create BasAccount from data
        foreach (var account in basAccountsDTO)
        {
            // Create BAS account
            var basAccount = new BasAccount
            {
                CompanyId = companyId,
                Year = DateTime.Now.Year,
                AccountNumber = account.BasAccount,
                Description = account.Description,
                Credit = account.Credit,
                Debit = account.Debit,
                Transactions = new List<Transaction>() // Create as empty list to avoid null ref error
            };

            // Determine if transaction should be debit or credit
            decimal transactionAmount = account.Debit > 0 ? account.Debit : account.Credit;
            bool transactionIsDebit = account.Debit > 0; // Debit more than 0 = true else = false

            // Create transaction 
            var transaction = new Transaction
            {
                Amount = transactionAmount,
                IsDebit = transactionIsDebit,
                TransactionDate = DateTime.Now, // Set transaction date to now (when it is being booked)

                CompanyId = companyId,
                BasAccount = basAccount,
                IngoingInvoice = invoice,
            };

            // Connect bas acc to transaction
            basAccount.Transactions.Add(transaction);

            // Create BasAccount along with its associated transaction
            await _basAccountRepo.CreateBasAccountAsync(basAccount); 
        };




        // I need bas account to update and or create for the company in the db

        // I need the invoice (id at least) to connect the invoice to the transactions
        // perhaps the data that the form recognizer spits out, invoice items and date

        // Create transactions for each item on the invoice 

        // Connect the 3 of them invoice -> transactions -> bas account 

        // So take invoice id, check if invoice exists

        return new ResultObject { Message = "Successfully created BAS Accounts", Success = true};

    }

}
