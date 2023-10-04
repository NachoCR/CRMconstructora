using System;
using System.Collections.Generic;
using BackendCRMconstructora.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Task = BackendCRMconstructora.Models.Task;

namespace BackendCRMconstructora.Contexts
{
    public partial class ConstructoraContext : DbContext
    {
        public ConstructoraContext()
        {
        }

        public ConstructoraContext(DbContextOptions<ConstructoraContext> options) : base(options)
        {
        }

        public virtual DbSet<BuyingOrder> BuyingOrders { get; set; } = null!;
        public virtual DbSet<BuyingOrderDetail> BuyingOrderDetails { get; set; } = null!;
        public virtual DbSet<Client> Clients { get; set; } = null!;
        public virtual DbSet<Employee> Employees { get; set; } = null!;
        public virtual DbSet<Identifier> Identifiers { get; set; } = null!;
        public virtual DbSet<Priority> Priorities { get; set; } = null!;
        public virtual DbSet<Project> Projects { get; set; } = null!;
        public virtual DbSet<Provider> Providers { get; set; } = null!;
        public virtual DbSet<ProviderCatalog> ProviderCatalogs { get; set; } = null!;
        public virtual DbSet<ProviderContact> ProviderContacts { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<Status> Statuses { get; set; } = null!;
        public virtual DbSet<Task> Tasks { get; set; } = null!;
        public virtual DbSet<Unit> Units { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {

            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BuyingOrder>(entity =>
            {
                entity.HasKey(e => e.OrderId)
                    .HasName("PK__Buying_O__C3905BAFD84C1AF6");

                entity.ToTable("Buying_Order");

                entity.Property(e => e.OrderId)
                    .ValueGeneratedNever()
                    .HasColumnName("OrderID");

                entity.Property(e => e.CreatorEmployeeId).HasColumnName("Creator_EmployeeID");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ProjectId).HasColumnName("ProjectID");

                entity.Property(e => e.ProviderId).HasColumnName("ProviderID");

                entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.CreatorEmployee)
                    .WithMany(p => p.BuyingOrders)
                    .HasForeignKey(d => d.CreatorEmployeeId)
                    .HasConstraintName("FK_Buying_Order_Employee");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.BuyingOrders)
                    .HasForeignKey(d => d.ProjectId)
                    .HasConstraintName("FK_Buying_Order_Project");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.BuyingOrders)
                    .HasForeignKey(d => d.ProviderId)
                    .HasConstraintName("FK_Buying_Order_Provider");
            });

            modelBuilder.Entity<BuyingOrderDetail>(entity =>
            {
                entity.HasKey(e => e.InventoryId)
                    .HasName("PK__Buying_O__F5FDE6D3779E261E");

                entity.ToTable("Buying_Order_Detail");

                entity.Property(e => e.InventoryId)
                    .ValueGeneratedNever()
                    .HasColumnName("InventoryID");

                entity.Property(e => e.Category)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.OrderId).HasColumnName("OrderID");

                entity.Property(e => e.ProductName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Product_Name");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.BuyingOrderDetails)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_Buying_Order_Detail_Buying_Order");
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Client");

                entity.Property(e => e.ClientId)
                    .ValueGeneratedNever()
                    .HasColumnName("ClientID");

                entity.Property(e => e.Lastname)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.SecondLastname)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Second_Lastname");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");

                entity.Property(e => e.EmployeeId)
                    .ValueGeneratedNever()
                    .HasColumnName("EmployeeID");

                entity.Property(e => e.AssignedProjectId).HasColumnName("Assigned_ProjectID");

                entity.Property(e => e.Lastname)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Position)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.SecondLastname)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Second_Lastname");
            });

            modelBuilder.Entity<Identifier>(entity =>
            {
                entity.ToTable("Identifier");

                entity.Property(e => e.IdentifierId)
                    .ValueGeneratedNever()
                    .HasColumnName("IdentifierID");

                entity.Property(e => e.IdentifierName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Identifier_Name");
            });

            modelBuilder.Entity<Priority>(entity =>
            {
                entity.ToTable("Priority");

                entity.Property(e => e.PriorityId)
                    .ValueGeneratedNever()
                    .HasColumnName("PriorityID");

                entity.Property(e => e.PriorityName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Priority_Name");
            });

            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Project");

                entity.Property(e => e.ProjectId)
                    .ValueGeneratedNever()
                    .HasColumnName("ProjectID");

                entity.Property(e => e.ClientId).HasColumnName("ClientID");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.EndDate)
                    .HasColumnType("date")
                    .HasColumnName("End_Date");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.StartDate)
                    .HasColumnType("date")
                    .HasColumnName("Start_Date");

                entity.Property(e => e.StatusId).HasColumnName("StatusID");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.Projects)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_Project_Client");
            });

            modelBuilder.Entity<Provider>(entity =>
            {
                entity.ToTable("Provider");

                entity.Property(e => e.ProviderId)
                    .ValueGeneratedNever()
                    .HasColumnName("ProviderID");

                entity.Property(e => e.Address)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Details).IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Identifier).HasMaxLength(50);

                entity.Property(e => e.IdentifierId).HasColumnName("IdentifierID");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProviderCatalog>(entity =>
            {
                entity.HasKey(e => e.ItemId)
                    .HasName("PK__Provider__727E83EB8755EB70");

                entity.ToTable("Provider_Catalog");

                entity.Property(e => e.ItemId)
                    .ValueGeneratedNever()
                    .HasColumnName("ItemID");

                entity.Property(e => e.Details)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ProviderId).HasColumnName("ProviderID");

                entity.Property(e => e.UnitId).HasColumnName("UnitID");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.ProviderCatalogs)
                    .HasForeignKey(d => d.ProviderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Provider_Catalog_Provider");
            });

            modelBuilder.Entity<ProviderContact>(entity =>
            {
                entity.HasKey(e => e.ContactId)
                    .HasName("PK__Provider__5C6625BB61462B03");

                entity.ToTable("Provider_Contact");

                entity.Property(e => e.ContactId)
                    .ValueGeneratedNever()
                    .HasColumnName("ContactID");

                entity.Property(e => e.Details).IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Lastname)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ProviderId).HasColumnName("ProviderID");

                entity.Property(e => e.SecondLastname)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Second_Lastname");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.ProviderContacts)
                    .HasForeignKey(d => d.ProviderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Provider_Contact_Provider");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                entity.Property(e => e.RoleId)
                    .ValueGeneratedNever()
                    .HasColumnName("RoleID");

                entity.Property(e => e.RoleName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Role_Name");
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.ToTable("Status");

                entity.Property(e => e.StatusId)
                    .ValueGeneratedNever()
                    .HasColumnName("StatusID");

                entity.Property(e => e.StatusName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Status_Name");
            });

            modelBuilder.Entity<Task>(entity =>
            {
                entity.ToTable("Task");

                entity.Property(e => e.TaskId)
                    .ValueGeneratedNever()
                    .HasColumnName("TaskID");

                entity.Property(e => e.DateDue)
                    .HasColumnType("date")
                    .HasColumnName("Date_Due");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.PriorityId).HasColumnName("PriorityID");

                entity.Property(e => e.ProjectId).HasColumnName("ProjectID");

                entity.Property(e => e.StatusId).HasColumnName("StatusID");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Tasks)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_Task_Employee");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.Tasks)
                    .HasForeignKey(d => d.ProjectId)
                    .HasConstraintName("FK_Task_Project");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.ToTable("Unit");

                entity.Property(e => e.UnitId)
                    .ValueGeneratedNever()
                    .HasColumnName("UnitID");

                entity.Property(e => e.Abbreviation)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.UnitName)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasColumnName("Unit_Name");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("UserID");

                entity.Property(e => e.ClientId).HasColumnName("ClientID");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.Identification).HasMaxLength(50);

                entity.Property(e => e.IdentifierId).HasColumnName("IdentifierID");

                entity.Property(e => e.Password).HasMaxLength(255);

                entity.Property(e => e.RoleId).HasColumnName("Role_ID");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_User_Client");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_User_Employee");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
