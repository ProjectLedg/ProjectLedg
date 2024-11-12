
using DinkToPdf.Contracts;
using DinkToPdf;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Options.Email;
using ProjectLedg.Server.Repositories;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using System.ClientModel.Primitives;
using OpenAI;
using iTextSharp.text.pdf;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;
using ProjectLedg.Server.Functions.AssistantFunctions;
using ProjectLedg.Server.Services.AssistantFunctions;

namespace ProjectLedg.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            Env.Load();

            //Load AES Key and IV for Encryption

            var aesKey = Enumerable.Range(0, Environment.GetEnvironmentVariable("AES_KEY").Length)
               .Where(x => x % 2 == 0)
               .Select(x => Convert.ToByte(Environment.GetEnvironmentVariable("AES_KEY").Substring(x, 2), 16))
               .ToArray();
            var aesIV = Convert.FromBase64String(Environment.GetEnvironmentVariable("AES_IV"));


            //Creating a Session for the temporary files to exist within.
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(3);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            var mailKitSettingsSection = new MailKitSettings
            {
                MailServer = Environment.GetEnvironmentVariable("MAILSERVER"),
                MailPort = int.Parse(Environment.GetEnvironmentVariable("MAILPORT")),
                SenderName = Environment.GetEnvironmentVariable("SENDERNAME"),
                Sender = Environment.GetEnvironmentVariable("SENDER"),
                Password = Environment.GetEnvironmentVariable("PASSWORD")
            };

            builder.Services.Configure<MailKitSettings>(options =>
            {
                options.MailServer = mailKitSettingsSection.MailServer;
                options.MailPort = mailKitSettingsSection.MailPort;
                options.SenderName = mailKitSettingsSection.SenderName;
                options.Sender = mailKitSettingsSection.Sender;
                options.Password = mailKitSettingsSection.Password;
            });

            var formRecognizerEndpoint = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_ENDPOINT");
            var formRecognizerApiKey = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_KEY");


            services.AddDbContext<ProjectLedgContext>(options =>
            {
                options.UseSqlServer(Environment.GetEnvironmentVariable("CONNECTION_STRING"));
                //options.UseSqlServer(Environment.GetEnvironmentVariable("LEDGEDB_CONNECTION_STRING"));
            });


            // Add services to the container.
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;

            }).AddEntityFrameworkStores<ProjectLedgContext>()
              .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
                    ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")))
                };
            });

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
                .AddCookie()
                .AddGoogle(options =>
                {
                    options.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
                    options.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");

                    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "localizedFirstName");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "localizedLastName");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "emailAddress");


                });
            //Add Microsoft account authentication
            //.AddMicrosoftAccount(options =>
            //{
            //    options.ClientId = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID");
            //    options.ClientSecret = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_SECRET");

            //    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
            //    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "displayName");
            //    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
            //});

            services.AddAuthorization(options =>
            {
                options.AddPolicy("ManagerPolicy", policy => policy.RequireRole("Manager"));
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
            });

            services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {

                    builder.WithOrigins("http://localhost:5173", "https://localhost:5173", "https://accounts.google.com", "https://localhost:7223", "https://localhost:7294", "https://projectledg.azurewebsites.net")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProjectLedg API", Version = "v1" });

                // Define Bearer Authentication scheme for Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });

                // Apply Bearer authentication globally in Swagger UI
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });

            //Service Registrations

            //EncryptionHelper
            services.AddSingleton(new EncryptionHelper(aesKey, aesIV));

            //User
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();

            //Admin
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<IAdminService, AdminService>();
            //Email
            services.AddScoped<IEmailSender, EmailSender>();
            //JWT
            services.AddScoped<JwtRepository>();
            services.AddScoped<ProjectLedg.Server.Services.AuthenticationService>();
            //PDF
            services.AddScoped<IPDFService, PDFService>();
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            //HTTPClient
            services.AddHttpClient();
            //Company
            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<ICompanyService, CompanyService>();
            //Finances
            services.AddScoped<IFinanceRepository, FinanceRepository>();
            services.AddScoped<IFinanceService, FinanceService>();

            //Customer
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<ICustomerService, CustomerService>();
            //Support Tickets
            services.AddScoped<ISupportTicketRepository, SupportTicketRepository>();
            services.AddScoped<ISupportTicketService, SupportTicketService>();


            //EmailList
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailRepository, EmailRepository>();
            //Form Recognizer
            services.AddScoped<IFormRecognizerService>(sp => new FormRecognizerService(
                formRecognizerEndpoint,
                formRecognizerApiKey
            ));
            //Blobs
            services.AddScoped<IBlobStorageService>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();

                return new BlobStorageService(
                    Environment.GetEnvironmentVariable("BLOB_STORAGE_CONNECTION_STRING"),
                    Environment.GetEnvironmentVariable("BLOB_STORAGE_CONTAINER_NAME"),
                    Environment.GetEnvironmentVariable("BLOB_STORAGE_API_KEY")
                );
            });
            //Ingoing Invoices
            services.AddScoped<IIngoingInvoiceRepository, IngoingInvoiceRepository>();
            services.AddScoped<IIngoingInvoiceService, IngoingInvoiceService>();
            //Outgoing Invoices
            services.AddScoped<IOutgoingInvoiceRepository, OutgoingInvoiceRepository>();
            services.AddScoped<IOutgoingInvoiceService, OutgoingInvoiceService>();

            //OpenAI
            var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            var openAiClient = new OpenAIClient(new OpenAIAuthentication(apiKey: openAiApiKey));
            //AssistantService
            services.AddSingleton(openAiClient);
            services.AddScoped<IAssistantService, AssistantService>();

            //BasAccount
            services.AddScoped<IBasAccountService, BasAccountService>();
            services.AddScoped<IBasAccountRepository, BasAccountRepository>();

            //Notice
            services.AddScoped<INoticeRepository, NoticeRepository>();
            services.AddScoped<INoticeService, NoticeService>();
            services.AddScoped<IBasAccountRepository, BasAccountRepository>();

            //Functions:
            services.AddScoped<IBasAccountFunctions, BasAccountFunctions>();
            services.AddScoped<IIngoingInvoiceFunctions, IngoingInvoiceFunctions>();
            services.AddScoped<IOutgoingInvoiceFunctions, OutgoingInvoiceFunctions>();
            services.AddScoped<ITransactionFunctions, TransactionFunctions>();


            //AnnualReport:
            services.AddScoped<IAnnualReportService, AnnualReportService>();

            //enable logging:
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddAzureWebAppDiagnostics();




            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var roles = new[] { "Manager", "Admin", "User" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    
                        await roleManager.CreateAsync(new IdentityRole(role));
                    
                }
            }

            app.UseStaticFiles();
            app.UseSession();

            // Configure the HTTP request pipeline.

            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors();

            app.MapControllers();

            //app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
