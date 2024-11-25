using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class FormRecognizerService : IFormRecognizerService
    {
        private readonly DocumentAnalysisClient _client;

        public FormRecognizerService(string endpoint, string apiKey)
        {
            var credential = new AzureKeyCredential(apiKey);
            _client = new DocumentAnalysisClient(new Uri(endpoint), credential);
        }

        public async Task<Dictionary<string, object>> AnalyzeInvoice(string filePath)
        {
            var extractedData = new Dictionary<string, object>();

            //Validate file type based on extension
            var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();
            if (fileExtension != ".pdf" && fileExtension != ".jpg" && fileExtension != ".jpeg" && fileExtension != ".png")
            {
                throw new NotSupportedException($"Unsupported file type: {fileExtension}. Only PDFs and images (.jpg, .jpeg, .png) are supported.");
            }

            // open the file stream
            await using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            try
            {
                //Send the request to Azure Form Recognizer
                AnalyzeDocumentOperation operation = await _client.AnalyzeDocumentAsync(
                    WaitUntil.Completed,
                    "prebuilt-invoice",
                    stream
                );

                AnalyzeResult result = operation.Value;

                //Extract key-value pairs from the document
                foreach (var document in result.Documents)
                {
                    foreach (var field in document.Fields)
                    {
                        extractedData[field.Key] = field.Value.Content;
                    }
                }

                // Processing the Items field
                extractedData["Items"] = ExtractItems(result.Documents);

                // Processing the 'PaymentDetails' field
                extractedData["PaymentDetails"] = ExtractPaymentDetails(result.Documents);
            }
            catch (RequestFailedException ex)
            {
                // Logging and rethrowing Azure-specific errors
                Console.WriteLine($"Azure Form Recognizer error: {ex.Message}");
                Console.WriteLine($"Error Code: {ex.ErrorCode}");
                throw;
            }

            return extractedData;
        }

        private static List<Dictionary<string, string>> ExtractItems(IReadOnlyList<AnalyzedDocument> documents)
        {
            var items = new List<Dictionary<string, string>>();

            foreach (var document in documents)
            {
                if (document.Fields.TryGetValue("Items", out DocumentField? itemsField) &&
                    itemsField.FieldType == DocumentFieldType.List)
                {
                    foreach (DocumentField itemField in itemsField.Value.AsList())
                    {
                        var lineItem = new Dictionary<string, string>();

                        if (itemField.FieldType == DocumentFieldType.Dictionary)
                        {
                            var itemFields = itemField.Value.AsDictionary();

                            if (itemFields.TryGetValue("Content", out DocumentField? contentField))
                            {
                                lineItem["Content"] = contentField.Value.AsString();
                            }

                            if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                            {
                                lineItem["Description"] = descriptionField.Value.AsString();
                            }

                            if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                            {
                                lineItem["Quantity"] = quantityField.Value.AsDouble().ToString();
                            }

                            if (itemFields.TryGetValue("UnitPrice", out DocumentField? unitPriceField) &&
                                unitPriceField.FieldType == DocumentFieldType.Currency)
                            {
                                lineItem["UnitPrice"] = unitPriceField.Value.AsCurrency().Amount.ToString();
                            }

                            if (itemFields.TryGetValue("Amount", out DocumentField? amountField) &&
                                amountField.FieldType == DocumentFieldType.Currency)
                            {
                                lineItem["Amount"] = amountField.Value.AsCurrency().Amount.ToString();
                            }
                        }

                        items.Add(lineItem);
                    }
                }
            }

            return items;
        }

        private static List<Dictionary<string, string>> ExtractPaymentDetails(IReadOnlyList<AnalyzedDocument> documents)
        {
            var paymentDetails = new List<Dictionary<string, string>>();

            foreach (var document in documents)
            {
                if (document.Fields.TryGetValue("PaymentDetails", out DocumentField? paymentDetailsField) &&
                    paymentDetailsField.FieldType == DocumentFieldType.List)
                {
                    foreach (DocumentField paymentField in paymentDetailsField.Value.AsList())
                    {
                        var paymentDetail = new Dictionary<string, string>();

                        if (paymentField.FieldType == DocumentFieldType.Dictionary)
                        {
                            var paymentFields = paymentField.Value.AsDictionary();

                            if (paymentFields.TryGetValue("IBAN", out DocumentField? ibanField))
                            {
                                paymentDetail["IBAN"] = ibanField.Value.AsString();
                            }

                            if (paymentFields.TryGetValue("SWIFT", out DocumentField? swiftField))
                            {
                                paymentDetail["SWIFT"] = swiftField.Value.AsString();
                            }
                        }

                        paymentDetails.Add(paymentDetail);
                    }
                }
            }

            return paymentDetails;
        }
    }
}
