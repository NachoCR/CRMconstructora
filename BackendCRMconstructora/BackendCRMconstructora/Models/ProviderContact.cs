using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class ProviderContact
    {
        public int ContactId { get; set; }
        public string Name { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string? SecondLastname { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Details { get; set; }
        public int ProviderId { get; set; }

        public virtual Provider Provider { get; set; } = null!;
    }
}
