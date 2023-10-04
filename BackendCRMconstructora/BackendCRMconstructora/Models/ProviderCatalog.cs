using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class ProviderCatalog
    {
        public int ItemId { get; set; }
        public string Name { get; set; } = null!;
        public string? Details { get; set; }
        public decimal? Price { get; set; }
        public int ProviderId { get; set; }
        public int? UnitId { get; set; }

        public virtual Provider Provider { get; set; } = null!;
    }
}
