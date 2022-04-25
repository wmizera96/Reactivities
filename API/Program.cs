using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options => {
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(opt => {
    opt.AddPolicy("CorsPolicy", policy => {
        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithOrigins("http://localhost:3000");
    });
});

builder.Services.AddMediatR(typeof(List.Handler).Assembly);


var app = builder.Build();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedDataAsync(context);
}

catch(Exception ex){
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error occured during migration");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
