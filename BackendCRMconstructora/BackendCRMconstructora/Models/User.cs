using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class User
    {
        public int UserId { get; set; }
        public int IdentifierId { get; set; }
        public string Identification { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int? EmployeeId { get; set; }
        public int? ClientId { get; set; }
        public int RoleId { get; set; }

        public virtual Client? Client { get; set; }
        public virtual Employee? Employee { get; set; }
    }
}
