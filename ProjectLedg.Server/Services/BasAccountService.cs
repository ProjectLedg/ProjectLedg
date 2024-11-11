﻿using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
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


    public async Task<ResultObject> AddBasAccountsToCompanyAsync(List<BasAccountDTO> basAccountsDto, IngoingInvoice invoice, int companyId)
    {
        try
        {

            var company = await _companyService.GetCompanyByIdAsync(companyId);
            if (company == null)
                return new ResultObject { Message = "Commpany was not found.", Success = false };


            // Create BasAccounts list to be used to add all accounts to without saving
            // (to stop data reader error that occured when multiple dbcontexts tried to save changes simultaniously when we're looping and creating multiple BasAccounts)
            var basAccountsList = new List<BasAccount>();

            // Create BasAccount from data
            foreach (var accountDto in basAccountsDto)
            {
                // Create BAS account entity to save new or existing account to
                BasAccount basAccount;

                // Check if bas account exists (if null it doesn't exist)
                var existingBasAccount = await _basAccountRepo.GetBasAccountByAccountNumberAsync(accountDto.BasAccount, companyId);

                // Create new if doesn't exist
                if (existingBasAccount == null)
                {
                    basAccount = new BasAccount
                    {
                        CompanyId = companyId,
                        Year = DateTime.Now.Year, // Set year to now (when it is being booked) as you cant create BasAccounts for past or future years
                        AccountNumber = accountDto.BasAccount,
                        Description = accountDto.Description,
                        Credit = accountDto.Credit,
                        Debit = accountDto.Debit,
                        Transactions = new List<Transaction>() // Create as empty list to avoid null ref error
                    };
                }
                // Update values if exists
                else
                {
                    existingBasAccount.Credit += accountDto.Credit;
                    existingBasAccount.Debit += accountDto.Debit;

                    basAccount = existingBasAccount;
                }
               

                // Determine if transaction should be debit or credit
                decimal transactionAmount = accountDto.Debit > 0 ? accountDto.Debit : accountDto.Credit;
                bool transactionIsDebit = accountDto.Debit > 0; // Debit more than 0 = true else = false

                // Create transaction 
                var transaction = new Transaction
                {
                    Amount = transactionAmount,
                    IsDebit = transactionIsDebit,
                    TransactionDate = DateTime.Now, // Set transaction date to now (when it is being booked)

                    //CompanyId = companyId,
                    BasAccount = basAccount,
                    IngoingInvoice = invoice,
                };

                // Connect bas acc to transaction
                basAccount.Transactions.Add(transaction);

                // Add the BasAccount to the list if it's new. If it exists add it to update tracking
                if (existingBasAccount == null)
                {
                    basAccountsList.Add(basAccount);
                }
            };

                  
            // Create all bas accounts in the list along with their associated transactions in one process
            await _basAccountRepo.CreateBasAccountsFromListAsync(basAccountsList);
         
            return new ResultObject { Message = "Successfully created BAS Accounts", Success = true };

        }
        catch (Exception ex)
        {
            return new ResultObject { Message = "An error occurred while processing BAS Accounts", Success = false };

        }
    }

}
