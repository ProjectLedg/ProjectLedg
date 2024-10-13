using ProjectLedg.Server.Services.IServices;
using Tesseract;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;
using System.Drawing;
using System.Drawing.Imaging;

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
                //Saving the image to a temporary location
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.png");

                //saving the image
                await using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    await File.WriteAllBytesAsync(tempImagePath, memoryStream.ToArray());
                }

                //initializing the Tesseract instance
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

            //Regex for Invoice Number (Fakturanr or InvoiceNumber)
            var invoiceNumberPattern = @"(Fakturanr|Invoice\sNo)\s*[:\-]?\s*([0-9]+)";
            var invoiceNumberMatch = Regex.Match(text, invoiceNumberPattern);
            extractedData["InvoiceNumber"] = invoiceNumberMatch.Success ? invoiceNumberMatch.Groups[2].Value : "Not found";

            //Regex for Invoice Date (Fakturadatum or Invoice Date)
            var invoiceDatePattern = @"(Fakturadatum|Invoice\sDate)\s*[:-]?\s*(\d{4}[-/]\d{2}[-/]\d{2})";
            var invoiceDateMatch = Regex.Match(text, invoiceDatePattern);
            extractedData["InvoiceDate"] = invoiceDateMatch.Success ? invoiceDateMatch.Groups[1].Value : "Not found";

            //Regex for Due Date (Förfallodatum or Due Date)
            var dueDatePattern = @"(Förfallodatum|Due\sDate)\s*[:\-]?\s*([0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2})";
            var dueDateMatch = Regex.Match(text, dueDatePattern);
            extractedData["DueDate"] = dueDateMatch.Success ? dueDateMatch.Groups[2].Value : "Not found";

            //Regex for Total Amount (Belopp or Total Amount)
            var totalAmountPattern = @"(Belopp|Total\sAmount|Summa)\s*[:\-]?\s*([0-9]+[,.][0-9]{2})";
            var totalAmountMatch = Regex.Match(text, totalAmountPattern);
            extractedData["TotalAmount"] = totalAmountMatch.Success ? totalAmountMatch.Groups[2].Value.Replace(",", ".") : "Not found";

            //Regex for Client Name (Identifying common headers like Kund, Client, etc.)
            var clientNamePattern = @"(?:c/o\s+)?[\p{L}\s]+\n";
            string[] name = text.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
            var clientNameMatch = FindName(name);
            extractedData["ClientName"] = clientNameMatch;

            //Regex for Sender Name (AB, kommun, etc.)
            var senderNamePattern = @"([A-Öa-ö\s]+(?:AB|Inc|Ltd|kommun|Company))";
            var senderNameMatch = Regex.Match(text, senderNamePattern, RegexOptions.Multiline);
            extractedData["SenderName"] = senderNameMatch.Success ? senderNameMatch.Groups[1].Value.Trim() : "Not found";

            //Returning the extracted data
            return extractedData;
        }

        public string FindName(string[] lines)
        {
            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i].Trim();
                //Check for c/o in the Invoice
                if (line.Contains("c/o", StringComparison.OrdinalIgnoreCase))
                {
                    //Trying to get the previous line before c/o
                    if (i > 0 && !IsHeader(lines[i - 1]))
                    {
                        return lines[i - 1].Trim();
                    }
                    //If not; we'll try the next line
                    if (i < lines.Length - 1 && !IsHeader(lines[i + 1]))
                    {
                        return lines[i + 1].Trim();
                    }
                }
            }
            //return strings which arent in the header array
            foreach (string line in lines)
            {
                if (!IsHeader(line) && !string.IsNullOrWhiteSpace(line))
                {
                    return line.Trim();
                }
            }
            return null;
        }

        public bool IsHeader(string line)
        {
            string[] Headers =
            {
                "Faktura"
            };
            foreach (string header in Headers)
            {
                if (line.Contains(header, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<string> ExtractRawTextFromImage(IFormFile imageFile)
        {
            try
            {
                //save the image to a temporary location
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.jpg");

                //save the image 
                await using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    await File.WriteAllBytesAsync(tempImagePath, memoryStream.ToArray());
                }

                //load the image using Tesseract Pix
                using (var img = Pix.LoadFromFile(tempImagePath))
                {
                    //get the image dimensions
                    int imageHeight = img.Height;
                    int imageWidth = img.Width;

                    //defining the regions 
                    var topHalfRect = new Rectangle(0, 0, imageWidth, imageHeight / 2);
                    var bottomHalfRect = new Rectangle(0, imageHeight / 2, imageWidth, imageHeight / 2);

                    //clip the images into two halves for enhanced accuracy
                    using (var topHalf = CropImage(tempImagePath, topHalfRect))
                    using (var bottomHalf = CropImage(tempImagePath, bottomHalfRect))
                    {
                        //processing both halves and extracting the text
                        string topText = ExtractTextFromImage(topHalf);
                        string bottomText = ExtractTextFromImage(bottomHalf);

                        //combine the text from both halves
                        var result = new
                        {
                            TopHalfText = topText,
                            BottomHalfText = bottomText
                        };

                        //clean up temp image we dont need to save it currently
                        File.Delete(tempImagePath);

                        //return combined image as json
                        return JsonSerializer.Serialize(result);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing image: {ex.Message}");
                return $"Error extracting text: {ex.Message}";
            }
        }

        //´helper method to crop an image
        private Bitmap CropImage(string imagePath, Rectangle cropRect)
        {
            using (var srcImage = Image.FromFile(imagePath))
            {
                Bitmap target = new Bitmap(cropRect.Width, cropRect.Height);
                using (Graphics g = Graphics.FromImage(target))
                {
                    g.DrawImage(srcImage, new Rectangle(0, 0, target.Width, target.Height), cropRect, GraphicsUnit.Pixel);
                }
                return target;
            }
        }

        //helper method to extract text from an image
        private string ExtractTextFromImage(Bitmap image)
        {
            using (var engine = new TesseractEngine(_tesseractDataPath, "swe", EngineMode.Default))
            {
                using (var pixImage = ConvertBitmapToPix(image))
                {
                    using (var page = engine.Process(pixImage))
                    {
                        return page.GetText();
                    }
                }
            }
        }

        //helper method to convert bitmap to pix
        private Pix ConvertBitmapToPix(Bitmap bitmap)
        {
            using (var ms = new MemoryStream())
            {
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);  // You can also use other formats like JPEG
                ms.Seek(0, SeekOrigin.Begin);
                return Pix.LoadFromMemory(ms.ToArray());
            }
        }
    }
}
