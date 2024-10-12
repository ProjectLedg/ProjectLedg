using DinkToPdf.Contracts;
using DinkToPdf;
using ProjectLedg.Server.Services.IServices;
using System.Text;
using ProjectLedg.Server.Data.Models.DTOs.PDF;
using iTextSharp.text.pdf.parser;
using iTextSharp.text.pdf;
using ProjectLedg.Server.Data.Models;
using Path = System.IO.Path;
using ProjectLedg.Server.Repositories.IRepositories;
using System.Text.RegularExpressions;

namespace ProjectLedg.Server.Services
{
    public class PDFService : IPDFService
    {
        private readonly IConverter _converter;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IPDFRepository _pdfRepository;
        public PDFService(IConverter converter, IBlobStorageService blobStorageService, IPDFRepository pdfRepository)
        {
            _converter = converter;
            _blobStorageService = blobStorageService;
            _pdfRepository = pdfRepository;
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

        public async Task<object> ProcessInvoiceAsync(InvoiceUploadDTO dto)
        {
            //Step 1: Upload the PDF to Azure Blob Storage
            var blobUrl = await _blobStorageService.UploadBlobAsync(dto.InvoiceFile);

            //Step 2: Extract text from the uploaded PDF file (extract the text first)
            var extractedText = ExtractTextFromPdf(dto.InvoiceFile);

            //Step 3: Extract invoice details from the extracted text
            var extractedData = ExtractInvoiceData(extractedText); // Pass the extracted text

            //Step 4: Parse the extracted date strings into DateTime objects
            DateTime.TryParse(extractedData.ContainsKey("InvoiceDate") ? extractedData["InvoiceDate"] : null, out DateTime invoiceDate);
            DateTime.TryParse(extractedData.ContainsKey("DueDate") ? extractedData["DueDate"] : null, out DateTime dueDate);

            //Step 5: Parse TotalAmount as decimal
            decimal.TryParse(extractedData.ContainsKey("TotalAmount") ? extractedData["TotalAmount"].Replace(",", ".") : null, out decimal totalAmount);

            //step 6: Save the invoice file details and blob URL in the database
            var invoice = new Invoice
            {
                InvoiceNumber = extractedData.ContainsKey("InvoiceNumber") ? extractedData["InvoiceNumber"] : "Not found",
                InvoiceDate = invoiceDate != DateTime.MinValue ? invoiceDate : DateTime.Now, // Default to current date if parsing fails
                DueDate = dueDate != DateTime.MinValue ? dueDate : DateTime.Now, // Default to current date if parsing fails
                TotalAmount = totalAmount != 0 ? totalAmount : 0, // Default to 0 if parsing fails
                IsPaid = false, // You can add logic here if needed
                IsOutgoing = false, // You can add logic here if needed
                ClientName = extractedData.ContainsKey("ClientName") ? extractedData["ClientName"] : "Not found",
                SenderName = extractedData.ContainsKey("SenderName") ? extractedData["SenderName"] : "Not found",
                InvoiceFilePath = blobUrl  // Use Blob URL
            };

            await _pdfRepository.SaveInvoiceAsync(invoice, blobUrl);

            //Step 7: Return the extracted Data and blob URL
            return new
            {
                message = "File uploaded successfully",
                blobUrl = blobUrl,
                extractedData = extractedData
            };
        }

        private Dictionary<string, string> ExtractInvoiceData(string text)
        {
            var extractedData = new Dictionary<string, string>();

            Console.WriteLine("Extracted text from the image:");
            Console.WriteLine(text);

            //Regex for Invoice Number (Fakturanr)
            var invoiceNumberPattern = @"Fakturanr[\s:]*([0-9]+)";
            var invoiceNumberMatch = Regex.Match(text, invoiceNumberPattern);
            extractedData["InvoiceNumber"] = invoiceNumberMatch.Success ? invoiceNumberMatch.Groups[1].Value : "Not found";

            //Regex for Invoice Date (Fakturadatum)
            var invoiceDatePattern = @"Fakturadatum[\s:]*([0-9]{4}-[0-9]{2}-[0-9]{2})";
            var invoiceDateMatch = Regex.Match(text, invoiceDatePattern);
            extractedData["InvoiceDate"] = invoiceDateMatch.Success ? invoiceDateMatch.Groups[1].Value : "Not found";

            //Regex for Due Date (Förfallodatum)
            var dueDatePattern = @"Förfallodatum[\s:]*([0-9]{4}-[0-9]{2}-[0-9]{2})";
            var dueDateMatch = Regex.Match(text, dueDatePattern);
            extractedData["DueDate"] = dueDateMatch.Success ? dueDateMatch.Groups[1].Value : "Not found";

            //Regex for Total Amount (Summa oss tillhanda senast)
            var totalAmountPattern = @"Summa\oss\tillhanda\s(?:senast\s[0-9]{4}-[0-9]{2}-[0-9]{2}\s)?(\d{1,3}[,.]?\d{0,2})";
            var totalAmountMatch = Regex.Match(text, totalAmountPattern);
            extractedData["TotalAmount"] = totalAmountMatch.Success ? totalAmountMatch.Groups[1].Value.Replace(",", ".") : "Not found";

            //regex for Client Name (c/o)
            var clientNamePattern = @"c/o\s+([\w\s]+)";
            var clientNameMatch = Regex.Match(text, clientNamePattern);
            extractedData["ClientName"] = clientNameMatch.Success ? clientNameMatch.Groups[1].Value.Trim() : "Not found";

            //regex for Sender Name (first line with "kommun" or "AB")
            var senderNamePattern = @"(^[\w\s]+(?:kommun|AB))";
            var senderNameMatch = Regex.Match(text, senderNamePattern, RegexOptions.Multiline);
            extractedData["SenderName"] = senderNameMatch.Success ? senderNameMatch.Groups[0].Value.Trim() : "Not found";

            return extractedData;
        }
        private string ExtractTextFromPdf(IFormFile file)
        {
            using (var reader = new PdfReader(file.OpenReadStream()))
            {
                var text = new StringBuilder();

                //iterate through the pages of the PDF and extract text
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    var pageText = PdfTextExtractor.GetTextFromPage(reader, i);
                    text.Append(pageText);
                }

                return text.ToString();
            }
        }
    }
}

