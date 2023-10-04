using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class Client
    {
        public Client()
        {
            Projects = new HashSet<Project>();
            Users = new HashSet<User>();
        }

        public int ClientId { get; set; }
        public string Name { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string? SecondLastname { get; set; }
        public string? Phone { get; set; }

        public virtual ICollection<Project> Projects { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
