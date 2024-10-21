using DinkToPdf.Contracts;
using DinkToPdf;
using ProjectLedg.Server.Services.IServices;
using System.Text;
using ProjectLedg.Server.Data.Models.DTOs.PDF;
using System;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;

namespace ProjectLedg.Server.Services
{
    public class PDFService : IPDFService
    {
        private readonly IConverter _converter;
        public PDFService(IConverter converter)
        {
            _converter = converter;
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

            public byte[] GenerateInvoicePdf(InvoiceDTO invoice)
            {
                var sb = new StringBuilder();

                // Header: Invoice Information
                sb.Append("<div style='text-align: center;'>");
                sb.Append("<h1>INVOICE</h1>");
                sb.Append($"<h3>Invoice Number: {invoice.InvoiceNumber}</h3>");
                sb.Append($"<p>Invoice Date: {invoice.InvoiceDate:yyyy-MM-dd}</p>");
                sb.Append($"<p>Due Date: {invoice.DueDate:yyyy-MM-dd}</p>");
                sb.Append("</div>");

                // Vendor Information
                sb.Append("<div style='margin-bottom: 30px;'>");
                sb.Append($"<p><strong>{invoice.VendorName}</strong></p>");
                sb.Append($"<p>{invoice.VendorAddress}</p>");
                sb.Append($"<p>{invoice.VendorAddressRecipient}</p>");
                sb.Append($"<p>Tax ID: {invoice.VendorTaxId}</p>");
                sb.Append("</div>");

                // Customer Information
                sb.Append("<div style='margin-bottom: 30px;'>");
                sb.Append($"<p><strong>Bill To:</strong> {invoice.CustomerName}</p>");
                sb.Append($"<p>{invoice.CustomerAddress}</p>");
                sb.Append($"<p>Attn: {invoice.CustomerAddressRecipient}</p>");
                sb.Append("</div>");

                // Itemized Billing Table
                sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 30px;'>");
                sb.Append("<thead><tr>");
                sb.Append("<th style='border: 1px solid black; padding: 5px;'>Description</th>");
                sb.Append("<th style='border: 1px solid black; padding: 5px;'>Quantity</th>");
                sb.Append("<th style='border: 1px solid black; padding: 5px;'>Unit Price</th>");
                sb.Append("<th style='border: 1px solid black; padding: 5px;'>Amount</th>");
                sb.Append("</tr></thead>");
                sb.Append("<tbody>");

                foreach (var item in invoice.Items)
                {
                    sb.Append("<tr>");
                    sb.Append($"<td style='border: 1px solid black; padding: 5px;'>{item.Description}</td>");
                    sb.Append($"<td style='border: 1px solid black; padding: 5px;'>{item.Quantity}</td>");
                    sb.Append($"<td style='border: 1px solid black; padding: 5px;'>{item.UnitPrice:C}</td>");
                    sb.Append($"<td style='border: 1px solid black; padding: 5px;'>{item.Amount:C}</td>");
                    sb.Append("</tr>");
                }

                sb.Append("</tbody></table>");

                // Summary Section
                sb.Append("<div style='text-align: right; margin-bottom: 50px;'>");
                sb.Append($"<p><strong>Subtotal:</strong> {invoice.InvoiceTotal:C}</p>");
                sb.Append($"<p><strong>Total Tax:</strong> {invoice.TotalTax:C}</p>");
                sb.Append($"<h3>Total: {invoice.InvoiceTotal + invoice.TotalTax:C}</h3>");
                sb.Append("</div>");

                // Footer: Payment Information
                sb.Append("<div style='text-align: center; margin-top: 50px;'>");
                sb.Append($"<p><strong>Payment Details:</strong> {invoice.PaymentDetails ?? "N/A"}</p>");
                sb.Append("<p>Thank you for your business!</p>");
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
