using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class Provider
    {
        public Provider()
        {
            BuyingOrders = new HashSet<BuyingOrder>();
            ProviderCatalogs = new HashSet<ProviderCatalog>();
            ProviderContacts = new HashSet<ProviderContact>();
        }

        public int ProviderId { get; set; }
        public int IdentifierId { get; set; }
        public string? Identifier { get; set; }
        public string Name { get; set; } = null!;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Details { get; set; }

        public virtual ICollection<BuyingOrder> BuyingOrders { get; set; }
        public virtual ICollection<ProviderCatalog> ProviderCatalogs { get; set; }
        public virtual ICollection<ProviderContact> ProviderContacts { get; set; }
    }
}
