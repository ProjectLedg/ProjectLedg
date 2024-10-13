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
                // Save the image to a temporary location
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.png");

                // Save the image
                await using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    await File.WriteAllBytesAsync(tempImagePath, memoryStream.ToArray());
                }

                // Initialize the Tesseract instance
                string extractedText = string.Empty;
                using (var img = Pix.LoadFromFile(tempImagePath))
                {
                    // Get image dimensions
                    int imageHeight = img.Height;
                    int imageWidth = img.Width;

                    // Define regions for top and bottom halves
                    var topHalfRect = new Rectangle(0, 0, imageWidth, imageHeight / 2);
                    var bottomHalfRect = new Rectangle(0, imageHeight / 2, imageWidth, imageHeight / 2);

                    // Clip the image into top and bottom halves
                    using (var topHalf = CropImage(tempImagePath, topHalfRect))
                    using (var bottomHalf = CropImage(tempImagePath, bottomHalfRect))
                    {
                        // Extract text from both halves
                        string topText = ExtractTextFromImage(topHalf);
                        string bottomText = ExtractTextFromImage(bottomHalf);

                        // Combine the text from both halves
                        extractedText = $"{topText}\n{bottomText}";
                    }
                }

                // Clean up the temp image
                File.Delete(tempImagePath);

                // Now that we have the full text from both halves, we can proceed with regex extraction
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

            // Regex for Invoice Number (Fakturanr or InvoiceNumber)
            var invoiceNumberPattern = @"(Fakturanr|Invoice\sNo)\s*[:\-]?\s*([0-9]+)";
            var invoiceNumberMatch = Regex.Match(text, invoiceNumberPattern);
            extractedData["InvoiceNumber"] = invoiceNumberMatch.Success ? invoiceNumberMatch.Groups[2].Value : "Not found";

            // Regex for Invoice Date (Fakturadatum or Invoice Date)
            var invoiceDatePattern = @"Fakturadatum\s*[:-]?\s*(\d{4}[-/]\d{2}[-/]\d{2})";
            var invoiceDateMatch = Regex.Match(text, invoiceDatePattern);
            extractedData["InvoiceDate"] = invoiceDateMatch.Success ? invoiceDateMatch.Groups[1].Value : "Not found";

            // Regex for Due Date (Förfallodatum or Due Date)
            var dueDatePattern = @"(Förfallodatum|Due\sDate)\s*[:\-]?\s*([0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2})";
            var dueDateMatch = Regex.Match(text, dueDatePattern);
            extractedData["DueDate"] = dueDateMatch.Success ? dueDateMatch.Groups[2].Value : "Not found";

            // Regex for Total Amount (targeting specific keywords like Summa or Totalt followed by numbers)
            var totalAmountPattern = @"(?:Summa|Totalt)\s*[:\-]?\s*([0-9]+[ ]?[0-9]{2})";  // Adjusted for amount like "477 00"
            var totalAmountMatch = Regex.Match(text, totalAmountPattern);
            extractedData["TotalAmount"] = totalAmountMatch.Success ? totalAmountMatch.Groups[1].Value.Replace(" ", ".") : "Not found";

            // Regex for Client Name (Capturing "c/o" and similar patterns)
            var clientNamePattern = @"(?:c/o\s+)?([A-Öa-öa-ö\s]+)\n";
            var clientNameMatch = Regex.Match(text, clientNamePattern);
            extractedData["ClientName"] = clientNameMatch.Success ? clientNameMatch.Groups[1].Value.Trim() : "Not found";

            // Regex for Sender Name (Capturing "AB", "kommun", etc.)
            var senderNamePattern = @"([A-Öa-ö\s]+(?:AB|kommun|Ltd|Company|förvaltning))";
            var senderNameMatch = Regex.Match(text, senderNamePattern);
            extractedData["SenderName"] = senderNameMatch.Success ? senderNameMatch.Groups[1].Value.Trim() : "Not found";

            // Returning the extracted data
            return extractedData;
        }

        public string FindName(string[] lines)
        {
            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i].Trim();
                // Check for c/o in the Invoice
                if (line.Contains("c/o", StringComparison.OrdinalIgnoreCase))
                {
                    // Trying to get the previous line before c/o
                    if (i > 0 && !IsHeader(lines[i - 1]))
                    {
                        return lines[i - 1].Trim();
                    }
                    // If not; we'll try the next line
                    if (i < lines.Length - 1 && !IsHeader(lines[i + 1]))
                    {
                        return lines[i + 1].Trim();
                    }
                }
            }
            // Return strings which aren't in the header array
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
                    //get image dimensions
                    int imageHeight = img.Height;
                    int imageWidth = img.Width;

                    //define regions for top and bottom halves
                    var topHalfRect = new Rectangle(0, 0, imageWidth, imageHeight / 2);
                    var bottomHalfRect = new Rectangle(0, imageHeight / 2, imageWidth, imageHeight / 2);

                    // clip the images into two halves for enhanced accuracy
                    using (var topHalf = CropImage(tempImagePath, topHalfRect))
                    using (var bottomHalf = CropImage(tempImagePath, bottomHalfRect))
                    {
                        //process both halves and extract the text
                        string topText = ExtractTextFromImage(topHalf);
                        string bottomText = ExtractTextFromImage(bottomHalf);

                        //combine the text from both halves
                        var result = new
                        {
                            TopHalfText = topText,
                            BottomHalfText = bottomText
                        };

                        //clean up temp image we don't need to save it currently
                        File.Delete(tempImagePath);

                        //return combined image as JSON
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

        //helper method to crop an image
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

        // Helper method to convert bitmap to pix
        private Pix ConvertBitmapToPix(Bitmap bitmap)
        {
            using (var ms = new MemoryStream())
            {
                bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                ms.Seek(0, SeekOrigin.Begin);
                return Pix.LoadFromMemory(ms.ToArray());
            }
        }
    }
}
