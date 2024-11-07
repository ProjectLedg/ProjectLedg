using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Services.IServices;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public class BasAccountService : IBasAccountService
{
    private readonly string _csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "BasKontoPlan.csv");

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
}
