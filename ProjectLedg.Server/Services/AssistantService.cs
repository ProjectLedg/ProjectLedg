using OpenAI.Chat;
using OpenAI;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

public class AssistantService : IAssistantService
{
    private readonly OpenAIClient _openAiClient;
    private readonly ProjectLedgContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IIngoingInvoiceService _ingoingInvoiceService;

    public AssistantService(OpenAIClient openAiClient, ProjectLedgContext dbContext, IHttpContextAccessor httpContextAccessor, IIngoingInvoiceService invoiceService)
    {
        _openAiClient = openAiClient;
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _ingoingInvoiceService = invoiceService;
    }

    public async Task<string> SendMessageToAssistantAsync(string message)
    {
        var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                            ?? _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            var claims = _httpContextAccessor.HttpContext?.User?.Claims
                .Select(c => $"{c.Type}: {c.Value}")
                .ToList() ?? new List<string> { "No claims found" };

            return $"User is not authenticated. Claims available: {string.Join(", ", claims)}";
        }

        var systemMessage = new Message(Role.System, "This GPT is a Swedish accounting expert designed to assist users with categorizing invoices according to the BAS Chart of Accounts. It focuses on business expenses, revenue recognition, VAT handling, and provides guidance within Swedish BAS accounting standards. It can retrieve and display the authenticated user’s information if requested with 'fetch my info' or 'user info' and display the last 5 invoices with 'show my invoices'.");
        var userMessage = new Message(Role.User, message);

        var messages = new List<Message> { systemMessage, userMessage };
        var chatRequest = new ChatRequest(messages, model: "gpt-4o-mini");

        var response = await _openAiClient.ChatEndpoint.GetCompletionAsync(chatRequest);

        if (message.Contains("fetch my info", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("user info", StringComparison.OrdinalIgnoreCase))
        {
            var userInfo = await FetchUserInfoAsync(currentUserId);
            return userInfo ?? "User not found.";
        }
        else if (message.Contains("show my invoices", StringComparison.OrdinalIgnoreCase))
        {
            var invoices = await FetchUserInvoicesAsync(currentUserId);
            return invoices ?? "No invoices found for the authenticated user.";
        }

        var content = response.FirstChoice?.Message?.Content;
        return content.ValueKind == JsonValueKind.String ? content.GetString() : "No valid response from assistant.";
    }

    private async Task<string> FetchUserInfoAsync(string userId)
    {
        var user = await _dbContext.Users
            .Where(u => u.Id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
            return "User not found.";

        return $"Name: {user.FirstName} {user.LastName}, Email: {user.Email}";
    }

    private async Task<string> FetchUserInvoicesAsync(string userId)
    {
        var invoices = await _ingoingInvoiceService.GetAllInvoicesAsync();
        var userInvoices = invoices.Where(i => i.CustomerId == userId).OrderByDescending(i => i.InvoiceDate).Take(5).ToList();

        if (!userInvoices.Any())
            return "No invoices found for the authenticated user.";

        var invoiceDetails = userInvoices.Select(i =>
            $"Invoice Number: {i.InvoiceNumber}, Date: {i.InvoiceDate.ToShortDateString()}, Total: {i.InvoiceTotal}, Due Date: {i.DueDate.ToShortDateString()}, Vendor: {i.VendorName}"
        ).ToList();

        return string.Join("\n\n", invoiceDetails);
    }
}
