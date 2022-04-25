using Microsoft.EntityFrameworkCore;

#nullable disable

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Activity> Activities {get;set;}
}