using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure;
using Sprache;

namespace ProjectLedg.Server.Services
{
    public class FormRecognizerService
    {
        private readonly DocumentAnalysisClient _client;
        public FormRecognizerService(string endpoint, string apiKey)
        {
            var credential = new AzureKeyCredential(apiKey);
            _client = new DocumentAnalysisClient(new Uri(endpoint), credential);
        }

        public async Task<Dictionary<string, string>> AnalyzeInvoice(string filePath)
        {
            var extractedData = new Dictionary<string, string>();

            using var stream = new FileStream(filePath, FileMode.Open);
            AnalyzeDocumentOperation operation = await _client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-invoice", stream);
            AnalyzeResult result = operation.Value;

            //Extract key-value pairs from the document
            foreach (var document in result.Documents)
            {
                foreach (var field in document.Fields)
                {
                    //add the field key and content to the dictionary
                    extractedData.Add(field.Key, field.Value.Content);
                }
            }

            return extractedData;
        }
    }
}
