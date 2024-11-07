using DinkToPdf.Contracts;
using DinkToPdf;
using ProjectLedg.Server.Services.IServices;
using System.Text;
using ProjectLedg.Server.Data.Models.DTOs.PDF;
using System;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Services
{
    public class PDFService : IPDFService
    {
        private readonly IConverter _converter;
        private readonly IOutgoingInvoiceRepository _invoiceRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IFinanceRepo _financeRepository;
        public PDFService(IConverter converter, IOutgoingInvoiceRepository invoiceRepository, ICompanyRepository companyRepository, ICustomerRepository customerRepository, IFinanceRepo financeRepository)
        {
            _converter = converter;
            _invoiceRepository = invoiceRepository;
            _companyRepository = companyRepository;
            _customerRepository = customerRepository;
            _financeRepository = financeRepository;
        }

        public async Task<byte[]> GenerateAnnualReportPdf(AnualReportRequestDTO dto)
        {
            decimal companyTaxRate = 0.22m;

            // Get the company by ID
            var company = await _companyRepository.GetCompanyByIdAsync(dto.CompanyId);

            // Get the current date
            var currentDate = new DateOnly(2023, DateTime.Now.Month, DateTime.Now.Day); // Test for mock data


            // Get year to date profit
            var profit = await _financeRepository.GetYearToDateProfitAsync(dto.CompanyId, currentDate.Year);

            // Get year to date revenue
            var reveune = await _financeRepository.GetYearToDateRevenueAsync(dto.CompanyId, currentDate.Year);

            //Get year to date Moms
            var moms = await _financeRepository.GetYearToDateMomsAsync(dto.CompanyId, currentDate.Year);

            // Get external expenses
            var externalExpenses = await _financeRepository.GetYearToDateExternalExpensesAsync(dto.CompanyId, currentDate.Year);

            //Get staff expenses
            var staffExpenses = await _financeRepository.GetYearToDateStaffExpensesAsync(dto.CompanyId, currentDate.Year);

            // Get Financial Posts
            var financialPost = await _financeRepository.GetFinancialPostsAsync(dto.CompanyId, currentDate.Year);

            //Get Intangible Assets
            var intangibleAssets = await _financeRepository.GetYearToDateIntangibleAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Tangible Assets
            var tangibleAssets = await _financeRepository.GetYearToDateTangibleAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Financial Assets
            var financialAssets = await _financeRepository.GetYearToDateFinacialAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Current Assets
            var currentAssets = await _financeRepository.GetYearToDateCurrentAssetsAsync(dto.CompanyId, currentDate.Year);

            // Get equity capital
            var equityCapital = await _financeRepository.GetYearToDateCapitalEqutityAsync(dto.CompanyId, currentDate.Year);

            //Get Long Term Liabilities
            var longTermLiabilities = await _financeRepository.GetYearToDateLongTermLiabilitiesAsync(dto.CompanyId, currentDate.Year);

            //Get ShortTerm Liabilities
            var shortTermLiabilities = await _financeRepository.GetYearToDateShortTermLiabilitiesAsync(dto.CompanyId, currentDate.Year);

            var sb = new StringBuilder();

            // Page 1: Title and Certification (centered)
            sb.Append("<div style='text-align: center; margin-top: 150px;'>");
            sb.Append("<h1>Årsredovisning</h1>");
            sb.Append("<h4>för</h4>");
            sb.Append($"<h1>{company.CompanyName}</h1>");  // Correct name
            sb.Append($"<h3>Org.nr {company.OrgNumber}</h3>");  // Correct org number
            sb.Append($"<h3>Räkenskapsåret {currentDate.Year}</h3>");
            sb.Append("<h3 style='margin-top: 50px;'>Fastställelseintyg</h3>");
            sb.Append($"<p style='text-align: justify;'>Jag intygar att resultaträkningen och balansräkningen har fastställts på årsstämma {currentDate}.</p>");
            sb.Append("<p style='text-align: justify;'>Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.</p>");
            sb.Append("<p style='text-align: justify;'>Jag intygar att innehållet i dessa elektroniska handlingar överensstämmer med originalen och att originalen undertecknats av samtliga personer som enligt lag ska underteckna dessa.</p>");
            sb.Append("<p style='text-align: justify;'>Årsredovisningen är upprättad i svenska kronor, SEK. Om inte annat särskilt anges, redovisas alla belopp i hela kronor (kr). Uppgifter inom parentes avser föregående år</p>");
            sb.Append($"<p style='text-align: left;'>Elektroniskt underskriven av: <br/>{dto.Signature}, {dto.SignatureRole}<br/>{currentDate}</p>");
            sb.Append("</div>");

            // Page 2: Management Report
            sb.Append("<div>");
            sb.Append("<h2>Förvaltningsberättelse</h2>");
            sb.Append("<h3>Verksamheten</h3>");
            sb.Append($"<p><strong>Allmänt om verksamheten:</strong> {company.CompanyDescription}.</p>");
            sb.Append($"<p>Företaget har sitt säte i {company.Address}.</p>");
            sb.Append("<p>Väsentliga händelser under räkenskapsåret presenteras i noterna.</p>");
            sb.Append("</div>");

            

            // Page 4: Result Disposition
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Resultatdisposition</h2>");
            sb.Append("<p>Styrelsen föreslår att vinstmedlen disponeras enligt följande:</p>");
            sb.Append("<ul>");
            sb.Append($"<li>Årets resultat:{profit} kr</li>");
            sb.Append("</ul>");
            sb.Append($"<p>Summa disponeras så att i ny räkning överföres: {Math.Round(profit * ((100 - dto.profitPercentageToKeep)/100),2)} kr</p>");
            sb.Append($"<p>Summa disponeras till aktieägare: {Math.Round(profit * ((dto.profitPercentageToKeep) / 100),2)} kr</p>");
            sb.Append("<p>Företagets resultat och ställning i övrigt framgår av efterföljande resultat- och balansräkning med noter.</p>");
            sb.Append("</div>");

            // Page 5: Income Statement
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Resultaträkning</h2>");
            sb.Append($"<p>Nettoomsättning: {(reveune - moms)} kr</p>");
            sb.Append($"<p>Övriga externa kostnader: - {externalExpenses} kr</p>");
            sb.Append($"<p>Personalkostnader: -{staffExpenses} kr</p>");
            sb.Append($"<p>Rörelseresultat: {profit} kr</p>");
            sb.Append($"<p>Finansiella poster: {financialPost} kr</p>");
            sb.Append($"<p>Resultat efter finansiella poster: {(financialPost - profit)} kr</p>");
            sb.Append($"<p>Skatt på årets resultat: -{(profit * companyTaxRate)} kr</p>");
            sb.Append($"<p>Årets resultat: {profit + financialPost - (profit * companyTaxRate)} kr</p>");
            sb.Append("</div>");

            // Page 6: Balance Sheet (Assets)
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Balansräkning - Tillgångar</h2>");
            sb.Append("<h3>Anläggningstillgångar:</h3>");
            sb.Append($"<ul><li>Immanteriella tillgångar: {intangibleAssets} kr</li><li>Materiella tillgångar: {tangibleAssets} kr</li><li>Finansiella tillgångar: {financialAssets} kr</li></ul>");
            sb.Append($"<p>Summa anläggningstillgånar: {(intangibleAssets + tangibleAssets + financialAssets)} kr</p>");            
            sb.Append("<h3>Omsättningstillgångar:</h3>");
            sb.Append($"<ul><li>Lager: {currentAssets.Stock} kr</li><li>Kundfordringar: {currentAssets.AccountsReceivable} kr</li><li>Kassa och Bank: {currentAssets.BankKassa} kr</li><li>Kortfristiga fordringar: {currentAssets.ShortTermReceivables} kr</li></ul>");
            sb.Append($"<p>Summa omsättningstillgångar: {(currentAssets.Stock + currentAssets.AccountsReceivable + currentAssets.BankKassa + currentAssets.ShortTermReceivables)} kr</p>");
            sb.Append($"<p><strong>Summa tillgångar:</strong> {(currentAssets.Stock + currentAssets.AccountsReceivable + currentAssets.BankKassa + currentAssets.ShortTermReceivables) + (intangibleAssets + tangibleAssets + financialAssets)} kr.</p>");
            sb.Append("</div>");

            // Page 7: Balance Sheet (Liabilities and Equity) EGET KAPITAL
            sb.Append("<div>");
            sb.Append("<h2>Balansräkning - Eget Kapital och Skulder</h2>");
            sb.Append("<h3>Eget kapital:</h3>");
            sb.Append($"<p>Aktiekapital: {equityCapital.StockCapital} kr</p>");
            sb.Append($"<p>Balanserat resultat: {equityCapital.BalancedResult}kr</p>");
            sb.Append($"<p>Årets resultat: {equityCapital.YearResult} kr</p>");
            sb.Append($"<p>Summa Eget kapital:{(equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult)} kr.</p>");
            // Långfristiga skulder
            sb.Append("<h3>Långfristiga skulder:</h3>");
            sb.Append($"<p>Summa långfristiga skulder:{longTermLiabilities} kr.</p>");
            //Kortfristiga skulder
            sb.Append("<h3>Kortfristiga skulder:</h3>");
            sb.Append($"<p>Leveranstörsskulder: {shortTermLiabilities.AccountsPayable} kr</p>");
            sb.Append($"<p>Kortfristiga lån: {shortTermLiabilities.ShortTermLoans} kr</p>");
            sb.Append($"<p>Skatter och avgifter: {shortTermLiabilities.TaxesAndFees} kr</p>");
            sb.Append($"<p>Summa kortfristiga skulder:{(shortTermLiabilities.AccountsPayable + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees)} kr.</p>");
            sb.Append($"<p><strong>Summa Eget kapital och Skulder:</strong> {(equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult) + longTermLiabilities + (shortTermLiabilities.AccountsPayable + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees)} kr.</p>");

            sb.Append("</div>");

            


            // Page 8: Notes
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Noter</h2>");
            sb.Append("<h3>Not 1: Redovisningsprinciper:</h3>");
            sb.Append("<p>Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.</p>");
            sb.Append("<h3>Not 2: Medelantalet anställda:</h3>");
            sb.Append($"<p>Antal anställda under året:{company.AmountOfEmployees}. </p>");
            sb.Append("<h3>Not 3: Intäkter och kostnader:</h3>");
            sb.Append($"<p>Årets omsättning uppgår till {reveune} kr, med övriga kostnader på {externalExpenses} kr och personkostnader på {staffExpenses} kr. </p>");
            sb.Append("<h3>Not 4: Avskrivningar på anläggningstillgångar: </h3>");
            sb.Append($"<p>Avskrivningar under året uppgick till {intangibleAssets} kr för immateriella tillgångar, {tangibleAssets}kr för materiella tillgångar, och {financialAssets} kr för finansiella tillgångar. </p>");
            sb.Append("<h3>Not 5: Skulder och eget kapital:</h3>");
            sb.Append($"<p>Långfristiga skulder uppgår till {longTermLiabilities} kr, medan kortfristiga skulder uppgår till {(shortTermLiabilities.AccountsPayable + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees)} kr, Det egna kapitalet uppgår till {equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult} kr, vilket inkluderar akitekapital och balanserat resultat. </p>");
            sb.Append("</div>");

            // Page 9: Signatures
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Underskrifter</h2>");
            sb.Append("<p>Styrelsen intygar härmed att årsredovisningen upprättad i enlighet med årsredovisningslagen och ger en rättvisande bild av företagets ställning och resultat.</p>");
            sb.Append($"<p>{dto.Signature}</p>");
            sb.Append("</div>");

            var headerHtml = @"
    <div style='width: 100%; font-size: 12px; display: flex; justify-content: space-between;'>
        <div style='text-align: left;'>Samuel Hesser AB<br/>Org.nr: 559321-2961</div>
        <div style='text-align: right;'>Sida: [page]</div>
    </div>";

            // Save the header HTML as a temporary file
            string headerFilePath = Path.Combine(Path.GetTempPath(), "header.html");
            File.WriteAllText(headerFilePath, headerHtml);

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Portrait,
            PaperSize = PaperKind.A4,
            Margins = new MarginSettings { Top = 30, Bottom = 20 }
        },
                Objects = {
            new ObjectSettings() {
                PagesCount = true,
                HtmlContent = sb.ToString(),
                WebSettings = { DefaultEncoding = "utf-8" },
                HeaderSettings = {
                    HtmUrl = headerFilePath,
                    Spacing = 5
                }
            }
        }
            };

            return _converter.Convert(doc);
        }

        
        
        
        
        
        
        
        
        
        public async Task<byte[]> GenerateInvoicePdf(OutgoingInvoiceGenerationDTO dto)
        {


            var outgoingInvoice = await _invoiceRepository.GetOutgoingInvoiceByIdAsync(dto.OutgoingInvoiceId);
            if (outgoingInvoice == null)
            {
                throw new Exception("Invoice not found");
            }

            var company = await _companyRepository.GetCompanyByIdAsync(dto.CompanyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            var customer = await _customerRepository.GetCustomerByOutgoingInvoiceId(dto.OutgoingInvoiceId);
            if (customer == null)
            {
                throw new Exception("Customer not found");
            }




            //InvoiceDTO invoice


            var sb = new StringBuilder();

            // Header: Invoice Information
            sb.Append("<div style='text-align: center; font-family: Arial, sans-serif; margin-bottom: 40px; color: #333;'>");
            sb.Append("<h1 style='color: #444; font-size: 32px; letter-spacing: 1px;'>FAKTURA</h1>");
            sb.Append($"<h3 style='color: #777; font-size: 18px;'>Fakturanummer: {outgoingInvoice.InvoiceNumber}</h3>");
            sb.Append($"<p style='font-size: 14px; color: #999;'>Fakturadatum: {outgoingInvoice.InvoiceDate:yyyy-MM-dd}</p>");
            sb.Append($"<p style='font-size: 14px; color: #999;'>Förfallodatum: {outgoingInvoice.DueDate:yyyy-MM-dd}</p>");
            sb.Append("</div>");

            // Vendor Information
            sb.Append("<div style='margin-bottom: 30px; font-family: Arial, sans-serif; color: #333;'>");
            sb.Append($"<p style='font-weight: bold; font-size: 16px;'>{company.CompanyName}</p>");
            sb.Append($"<p style='font-size: 14px;'>Adress: {company.Address}</p>");
            sb.Append($"<p style='font-size: 14px;'>Orgnummer: {company.OrgNumber}</p>");
            sb.Append($"<p style='font-size: 14px;'>Momsnummer: {company.TaxId}</p>");
            sb.Append("</div>");

            // Customer Information
            sb.Append("<div style='margin-bottom: 30px; font-family: Arial, sans-serif; color: #333;'>");
            sb.Append($"<p style='font-weight: bold; font-size: 16px;'>Faktureras till: {customer.Name}</p>");
            sb.Append($"<p style='font-size: 14px;'>Adress: {customer.Address}</p>");
            sb.Append($"<p style='font-size: 14px;'>Orgnummer: {customer.OrganizationNumber}</p>");
            sb.Append($"<p style='font-size: 14px;'>Momsnummer: {customer.TaxId}</p>");
            sb.Append("</div>");

            // Itemized Billing Table
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 30px; font-family: Arial, sans-serif; color: #333;'>");
            sb.Append("<thead><tr style='background-color: #f2f2f2;'>");
            sb.Append("<th style='border-bottom: 2px solid #ccc; padding: 10px; text-align: left;'>Beskrivning</th>");
            sb.Append("<th style='border-bottom: 2px solid #ccc; padding: 10px; text-align: right;'>Antal</th>");
            sb.Append("<th style='border-bottom: 2px solid #ccc; padding: 10px; text-align: right;'>Pris/st</th>");
            sb.Append("<th style='border-bottom: 2px solid #ccc; padding: 10px; text-align: right;'>Belopp</th>");
            sb.Append("</tr></thead>");
            sb.Append("<tbody>");

            foreach (var item in outgoingInvoice.Items)
            {
                sb.Append("<tr>");
                sb.Append($"<td style='border-bottom: 1px solid #eee; padding: 10px;'>{item.Description}</td>");
                sb.Append($"<td style='border-bottom: 1px solid #eee; padding: 10px; text-align: right;'>{item.Quantity}</td>");
                sb.Append($"<td style='border-bottom: 1px solid #eee; padding: 10px; text-align: right;'>{item.UnitPrice:C}</td>");
                sb.Append($"<td style='border-bottom: 1px solid #eee; padding: 10px; text-align: right;'>{item.Amount:C}</td>");
                sb.Append("</tr>");
            }

            sb.Append("</tbody></table>");

            // Summary Section
            sb.Append("<div style='text-align: right; font-family: Arial, sans-serif; color: #333; margin-bottom: 50px;'>");
            sb.Append($"<p style='font-size: 16px;'><strong>Delsumma:</strong> {outgoingInvoice.InvoiceTotal:C}</p>");
            sb.Append($"<p style='font-size: 16px;'><strong>Moms:</strong> {outgoingInvoice.TotalTax:C}</p>");
            sb.Append($"<h3 style='font-size: 22px; color: #444; margin-top: 10px;'>Total: {outgoingInvoice.InvoiceTotal + outgoingInvoice.TotalTax:C}</h3>");
            sb.Append("</div>");

            // Footer: Payment Information
            sb.Append("<div style='text-align: center; font-family: Arial, sans-serif; color: #777; margin-top: 50px;'>");
            sb.Append($"<p style='font-size: 14px;'><strong>Bankgiro:</strong> {outgoingInvoice.PaymentDetails ?? "N/A"}</p>");
            sb.Append("<p style='font-size: 12px; color: #aaa;'>Denna faktura är genererad av Ledge Faktura tjänst.</p>");
            sb.Append("</div>");


            // PDF Document Generation
            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Portrait,
            PaperSize = PaperKind.A4,
            Margins = new MarginSettings { Top = 20, Bottom = 20 }
            },
                Objects = {
            new ObjectSettings() {
                HtmlContent = sb.ToString(),
                WebSettings = { DefaultEncoding = "utf-8" }
            }
        }
            };

            return _converter.Convert(doc);
        }

        
    }
}
