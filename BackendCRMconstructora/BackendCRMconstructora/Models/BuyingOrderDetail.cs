using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class BuyingOrderDetail
    {
        public int InventoryId { get; set; }
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public string? Category { get; set; }
        public int? OrderId { get; set; }

        public virtual BuyingOrder? Order { get; set; }
    }
}
