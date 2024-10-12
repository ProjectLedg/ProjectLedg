using ProjectLedg.Server.Services.IServices;
using Tesseract;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;

namespace ProjectLedg.Server.Services
{
    public class ImageScannerService : IImageScannerService
    {
        private readonly string _tesseractDataPath;

        public ImageScannerService(string tesseractDataPath)
        {
            _tesseractDataPath = tesseractDataPath;
        }

        public async Task<Dictionary<string, string>> ScanImageForText(IFormFile imageFile)
        {
            try
            {
                //saving the image to a temp location
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");

                //saving the image
                await using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    await File.WriteAllBytesAsync(tempImagePath, memoryStream.ToArray());
                }

                //Initializing the Tesseract instance
                string extractedText = string.Empty;
                using (var engine = new TesseractEngine(_tesseractDataPath, "swe", EngineMode.Default))
                {
                    using (var img = Pix.LoadFromFile(tempImagePath))
                    {
                        using (var page = engine.Process(img))
                        {
                            extractedText = page.GetText();
                        }
                    }
                }

                //clean up the temp image
                File.Delete(tempImagePath);

                //extract relevant data using Regex
                return ExtractInvoiceData(extractedText);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing image: {ex.Message}");
                return null;
            }
        }

        private Dictionary<string, string> ExtractInvoiceData(string text)
        {
            var extractedData = new Dictionary<string, string>();

            Console.WriteLine("Extracted text from the image:");
            Console.WriteLine(text);

            //regex for Invoice Number (Fakturanr or InvoiceNumber)
            var invoiceNumberPattern = @"(Fakturanr|Invoice\sNo)\s*[:\-]?\s*([0-9]+)";
            var invoiceNumberMatch = Regex.Match(text, invoiceNumberPattern);
            extractedData["InvoiceNumber"] = invoiceNumberMatch.Success ? invoiceNumberMatch.Groups[2].Value : "Not found";

            //regex for Invoice Date (Fakturadatum or Invoice Date)
            var invoiceDatePattern = @"(Fakturadatum|Invoice\sDate)\s*[:\-]?\s*([0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2})";
            var invoiceDateMatch = Regex.Match(text, invoiceDatePattern);
            extractedData["InvoiceDate"] = invoiceDateMatch.Success ? invoiceDateMatch.Groups[2].Value : "Not found";

            //regex for Due Date (Förfallodatum or Due Date)
            var dueDatePattern = @"(Förfallodatum|Due\sDate)\s*[:\-]?\s*([0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2})";
            var dueDateMatch = Regex.Match(text, dueDatePattern);
            extractedData["DueDate"] = dueDateMatch.Success ? dueDateMatch.Groups[2].Value : "Not found";

            //regex for Total Amount (Belopp or Total Amount)
            var totalAmountPattern = @"(Belopp|Total Amount|Summa)\s*[:\-]?\s*([0-9]+[,.][0-9]{2})";
            var totalAmountMatch = Regex.Match(text, totalAmountPattern);
            extractedData["TotalAmount"] = totalAmountMatch.Success ? totalAmountMatch.Groups[2].Value.Replace(",", ".") : "Not found";

            //dynamic Regex for Client Name (Identifying common headers like Kund, Client, etc.)
            var clientNamePattern = @"(?:c/o\s+([\w\s]+)|Kundnummer\s+[\d]+\s([\w\s]+)|Levereras\s(?:till|till\s+)\s([\w\s]+))";
            var clientNameMatch = Regex.Match(text, clientNamePattern);
            extractedData["ClientName"] = clientNameMatch.Success
    ? clientNameMatch.Groups.Cast<Group>().Select(g => g.Value).FirstOrDefault(x => !string.IsNullOrEmpty(x))?.Trim() : "Not found";

            //dynamic Regex for Sender Name (AB, kommun, etc.)
            var senderNamePattern = @"([A-Za-z\s]+(?:AB|Inc|Ltd|kommun|Company))";
            var senderNameMatch = Regex.Match(text, senderNamePattern, RegexOptions.Multiline);
            extractedData["SenderName"] = senderNameMatch.Success ? senderNameMatch.Groups[1].Value.Trim() : "Not found";

            //returning the extracted data
            return extractedData;
        }

        public async Task<string> ExtractRawTextFromImage(IFormFile imageFile)
        {
            try
            {
                //Save the image file to a temporary location
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");

                //Save the image asynchronously
                await using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    await File.WriteAllBytesAsync(tempImagePath, memoryStream.ToArray());
                }

                //initialize the Tesseract engine and process the image
                string extractedText = string.Empty;
                using (var engine = new TesseractEngine(_tesseractDataPath, "swe", EngineMode.Default))
                {
                    using (var img = Pix.LoadFromFile(tempImagePath))
                    {
                        using (var page = engine.Process(img))
                        {
                            extractedText = page.GetText();
                        }
                    }
                }

                //cleaning up the temp image
                File.Delete(tempImagePath);

                return extractedText;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing image: {ex.Message}");
                return $"Error extracting text: {ex.Message}";
            }
        }
    }
}