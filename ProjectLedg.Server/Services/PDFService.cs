using DinkToPdf.Contracts;
using DinkToPdf;
using ProjectLedg.Server.Services.IServices;
using System.Text;
using ProjectLedg.Server.Data.Models.DTOs.PDF;
using System;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Services
{
    public class PDFService : IPDFService
    {
        private readonly IConverter _converter;
        private readonly IOutgoingInvoiceRepository _invoiceRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ICustomerRepository _customerRepository;
        public PDFService(IConverter converter, IOutgoingInvoiceRepository invoiceRepository, ICompanyRepository companyRepository, ICustomerRepository customerRepository)
        {
            _converter = converter;
            _invoiceRepository = invoiceRepository;
            _companyRepository = companyRepository;
            _customerRepository = customerRepository;
        }

        public byte[] GenerateAnnualReportPdf()
        {
            var sb = new StringBuilder();

            // Page 1: Title and Certification (centered)
            sb.Append("<div style='text-align: center; margin-top: 150px;'>");
            sb.Append("<h1>Årsredovisning</h1>");
            sb.Append("<h4>för</h4>");
            sb.Append("<h1>Samuel Hesser AB</h1>");  // Correct name
            sb.Append("<h3>Org.nr 559321-2961</h3>");  // Correct org number
            sb.Append("<h3>Räkenskapsåret 2022</h3>");
            sb.Append("<h3 style='margin-top: 50px;'>Fastställelseintyg</h3>");
            sb.Append("<p style='text-align: justify;'>Jag intygar att resultaträkningen och balansräkningen har fastställts på årsstämma 2023-06-30.</p>");
            sb.Append("<p style='text-align: justify;'>Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.</p>");
            sb.Append("<p style='text-align: justify;'>Jag intygar att innehållet i dessa elektroniska handlingar överensstämmer med originalen och att originalen undertecknats av samtliga personer som enligt lag ska underteckna dessa.</p>");
            sb.Append("<p style='text-align: left;'>Elektroniskt underskriven av: <br/>Samuel Hesser, Styrelseledamot<br/>2023-07-26</p>");
            sb.Append("</div>");

            // Page 2: Management Report
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Förvaltningsberättelse</h2>");
            sb.Append("<h3>Verksamheten</h3>");
            sb.Append("<p><strong>Allmänt om verksamheten:</strong> Bolagets verksamhet innefattar träningsverksamhet.</p>");
            sb.Append("<p>Företaget har sitt säte i Orust.</p>");
            sb.Append("<p>Väsentliga händelser under räkenskapsåret: Inget extraordinärt har inträffat.</p>");
            sb.Append("<h3>Flerårsöversikt (Tkr)</h3>");
            sb.Append("<table style='width: 100%; border-collapse: collapse;'>");
            sb.Append("<tr><th>2022</th><th>2021 (7 mån)</th></tr>");
            sb.Append("<tr><td>Nettoomsättning: 141</td><td>137</td></tr>");
            sb.Append("<tr><td>Resultat efter finansiella poster: 7</td><td>-4</td></tr>");
            sb.Append("<tr><td>Soliditet (%): 26,5</td><td>87,5</td></tr>");
            sb.Append("</table>");
            sb.Append("</div>");

            // Page 3: Changes in Equity
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Förändringar i eget kapital</h2>");
            sb.Append("<table style='width: 100%; border-collapse: collapse;'>");
            sb.Append("<tr><th>Aktiekapital</th><th>Balanserat resultat</th><th>Årets resultat</th><th>Totalt</th></tr>");
            sb.Append("<tr><td>25 000</td><td>0</td><td>-4 466</td><td>20 534</td></tr>");
            sb.Append("<tr><td></td><td>-4 466</td><td>4 466</td><td>0</td></tr>");
            sb.Append("<tr><td></td><td></td><td>6 531</td><td>6 531</td></tr>");
            sb.Append("<tr><td>25 000</td><td>-4 466</td><td>6 531</td><td>27 065</td></tr>");
            sb.Append("</table>");
            sb.Append("</div>");

            // Page 4: Result Disposition
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Resultatdisposition</h2>");
            sb.Append("<p>Styrelsen föreslår att till förfogande stående vinstmedel (kronor):</p>");
            sb.Append("<ul>");
            sb.Append("<li>Ansamlad förlust: -4 466</li>");
            sb.Append("<li>Årets vinst: 6 531</li>");
            sb.Append("</ul>");
            sb.Append("<p>Summa disponeras så att i ny räkning överföres: 2 065 kr</p>");
            sb.Append("<p>Företagets resultat och ställning i övrigt framgår av efterföljande resultat- och balansräkning med noter.</p>");
            sb.Append("</div>");

            // Page 5: Income Statement
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Resultaträkning</h2>");
            sb.Append("<p>Nettoomsättning: 140 538 kr</p>");
            sb.Append("<p>Övriga externa kostnader: -54 520 kr</p>");
            sb.Append("<p>Personalkostnader: -78 991 kr</p>");
            sb.Append("<p>Rörelseresultat: 7 027 kr</p>");
            sb.Append("<p>Finansiella poster: 39 kr</p>");
            sb.Append("<p>Resultat efter finansiella poster: 7 066 kr</p>");
            sb.Append("<p>Skatt på årets resultat: -535 kr</p>");
            sb.Append("<p>Årets resultat: 6 531 kr</p>");
            sb.Append("</div>");

            // Page 6: Balance Sheet (Assets)
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Balansräkning - Tillgångar</h2>");
            sb.Append("<ul><li>Kortfristiga fordringar: 1 306 kr</li><li>Kassa och bank: 81 034 kr</li></ul>");
            sb.Append("<p>Summa omsättningstillgångar: 102 085 kr</p>");
            sb.Append("</div>");

            // Page 7: Balance Sheet (Liabilities and Equity)
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Balansräkning - Eget Kapital och Skulder</h2>");
            sb.Append("<p>Aktiekapital: 25 000 kr</p>");
            sb.Append("<p>Årets resultat: 6 531 kr</p>");
            sb.Append("<p>Summa eget kapital: 27 065 kr</p>");
            sb.Append("<p>Skatteskulder: 535 kr</p>");
            sb.Append("<p>Upplupna kostnader: 53 355 kr</p>");
            sb.Append("<p>Summa eget kapital och skulder: 102 085 kr</p>");
            sb.Append("</div>");

            // Page 8: Notes
            sb.Append("<div style='page-break-before: always;'>");
            sb.Append("<h2>Noter</h2>");
            sb.Append("<h3>Not 1: Redovisningsprinciper</h3>");
            sb.Append("<p>Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.</p>");
            sb.Append("<h3>Not 2: Medelantalet anställda</h3>");
            sb.Append("<p>Antal anställda under året: 1</p>");
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
