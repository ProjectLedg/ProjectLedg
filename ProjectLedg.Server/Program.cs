
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;
            Env.Load();


            services.AddDbContext<ProjectLedgContext>(options =>
            {
                options.UseSqlServer(Environment.GetEnvironmentVariable("CONNECTION_STRING"));
            });

            // Add services to the container.
            services.AddIdentity<User, IdentityRole>(options =>
            {

            }).AddEntityFrameworkStores<ProjectLedgContext>().AddDefaultTokenProviders();

            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

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

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
