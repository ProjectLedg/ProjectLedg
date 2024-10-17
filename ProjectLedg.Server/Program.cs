
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

namespace ProjectLedg.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            Env.Load();

         
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


            services.AddDbContext<ProjectLedgContext>(options =>
            {
                options.UseSqlServer(Environment.GetEnvironmentVariable("CONNECTION_STRING"));
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

            services.AddAuthorization();

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

            //User
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
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
            services.AddScoped<IFinanceRepo, FinanceRepo>();
            services.AddScoped<IFinanceService, FinanceService>();

            //EmailList
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailRepository, EmailRepository>();


            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();

           

        }
    }
}
