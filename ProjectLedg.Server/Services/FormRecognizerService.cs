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

            using var stream = new FileStream(filePath, FileMode.Open);
            AnalyzeDocumentOperation operation = await _client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-invoice", stream);
            AnalyzeResult result = operation.Value;

            // Extract key-value pairs from the document
            foreach (var document in result.Documents)
            {
                foreach (var field in document.Fields)
                {
                    extractedData[field.Key] = field.Value.Content;
                }
            }

            // Now focusing on the 'Items' field (line items)
            var items = new List<Dictionary<string, string>>();

            foreach (var document in result.Documents)
            {
                if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
                {
                    if (itemsField.FieldType == DocumentFieldType.List)
                    {
                        foreach (DocumentField itemField in itemsField.Value.AsList())
                        {
                            var lineItem = new Dictionary<string, string>();

                            if (itemField.FieldType == DocumentFieldType.Dictionary)
                            {
                                IReadOnlyDictionary<string, DocumentField> itemFields = itemField.Value.AsDictionary();

                                if (itemFields.TryGetValue("Content", out DocumentField? itemContentField))
                                {
                                    if (itemContentField.FieldType == DocumentFieldType.String)
                                    {
                                        lineItem["Content"] = itemContentField.Value.AsString();
                                    }
                                }

                                if (itemFields.TryGetValue("Description", out DocumentField? itemDescriptionField))
                                {
                                    if (itemDescriptionField.FieldType == DocumentFieldType.String)
                                    {
                                        lineItem["Description"] = itemDescriptionField.Value.AsString();
                                    }
                                }

                                if (itemFields.TryGetValue("Quantity", out DocumentField? itemQuantityField))
                                {
                                    if (itemQuantityField.FieldType == DocumentFieldType.Double)
                                    {
                                        lineItem["Quantity"] = itemQuantityField.Value.AsDouble().ToString();
                                    }
                                }

                                if (itemFields.TryGetValue("UnitPrice", out DocumentField? itemUnitPriceField))
                                {
                                    if (itemUnitPriceField.FieldType == DocumentFieldType.Currency)
                                    {
                                        lineItem["UnitPrice"] = $"{itemUnitPriceField.Value.AsCurrency().Symbol}{itemUnitPriceField.Value.AsCurrency().Amount}";
                                    }
                                }

                                if (itemFields.TryGetValue("Amount", out DocumentField? itemAmountField))
                                {
                                    if (itemAmountField.FieldType == DocumentFieldType.Currency)
                                    {
                                        lineItem["Amount"] = $"{itemAmountField.Value.AsCurrency().Symbol}{itemAmountField.Value.AsCurrency().Amount}";
                                    }
                                }
                            }

                            items.Add(lineItem);
                        }
                    }
                }
            }

            // Now focusing on the 'PaymentDetails' field
            var paymentDetails = new List<Dictionary<string, string>>();

            foreach (var document in result.Documents)
            {
                if (document.Fields.TryGetValue("PaymentDetails", out DocumentField? paymentDetailsField))
                {
                    if (paymentDetailsField.FieldType == DocumentFieldType.List)
                    {
                        foreach (DocumentField paymentField in paymentDetailsField.Value.AsList())
                        {
                            var paymentDetail = new Dictionary<string, string>();

                            if (paymentField.FieldType == DocumentFieldType.Dictionary)
                            {
                                IReadOnlyDictionary<string, DocumentField> paymentFields = paymentField.Value.AsDictionary();

                                if (paymentFields.TryGetValue("IBAN", out DocumentField? paymentIBANField))
                                {
                                    if (paymentIBANField.FieldType == DocumentFieldType.String)
                                    {
                                        paymentDetail["IBAN"] = paymentIBANField.Value.AsString();
                                    }
                                }

                                if (paymentFields.TryGetValue("SWIFT", out DocumentField? paymentSWIFTField))
                                {
                                    if (paymentSWIFTField.FieldType == DocumentFieldType.String)
                                    {
                                        paymentDetail["SWIFT"] = paymentSWIFTField.Value.AsString();
                                    }
                                }

                                // Add to payment details list
                                paymentDetails.Add(paymentDetail);
                            }
                        }
                    }
                }
            }

            // Add the extracted line items and payment details to the dictionary
            extractedData["Items"] = items;
            extractedData["PaymentDetails"] = paymentDetails;

            // Return after processing the entire document
            return extractedData;
        }
    }
}
