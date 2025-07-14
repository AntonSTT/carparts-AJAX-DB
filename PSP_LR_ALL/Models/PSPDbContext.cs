using Microsoft.EntityFrameworkCore;


namespace PSP_LR_ALL.Models
{
    public class PSPDbContext : DbContext
    {
        public PSPDbContext(DbContextOptions<PSPDbContext> options)
            : base(options)
        {
        }

        // Добавьте DbSet для ваших моделей
        // public DbSet<YourModel> YourModels { get; set; }
        public DbSet<CarPart> CarParts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CartPart> CartParts { get; set; }
        public DbSet<Cart> Carts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Конфигурация моделей (опционально)
            modelBuilder.Entity<Cart>().HasData(new Cart { Id = 1 });

        }

        
    }
}
