using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class Employee
    {
        public Employee()
        {
            BuyingOrders = new HashSet<BuyingOrder>();
            Tasks = new HashSet<Task>();
            Users = new HashSet<User>();
        }

        public int EmployeeId { get; set; }
        public string Name { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string? SecondLastname { get; set; }
        public string? Position { get; set; }
        public string? Phone { get; set; }
        public int? AssignedProjectId { get; set; }

        public virtual ICollection<BuyingOrder> BuyingOrders { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
