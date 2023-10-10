using BackendCRMconstructora.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendCRMconstructora.Contexts
{
    public class ConnectionSQLServer:DbContext
    {
        public ConnectionSQLServer(DbContextOptions<ConnectionSQLServer> options) : base(options)
        {
        }
        public DbSet<Role> Role { get; set; }
        public DbSet<Identifier> Identifier { get; set; }
        public DbSet<User> User { get; set; }
    }
}
