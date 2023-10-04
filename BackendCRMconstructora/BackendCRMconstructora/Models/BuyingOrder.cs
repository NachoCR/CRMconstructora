using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class BuyingOrder
    {
        public BuyingOrder()
        {
            BuyingOrderDetails = new HashSet<BuyingOrderDetail>();
        }

        public int OrderId { get; set; }
        public DateTime? Date { get; set; }
        public decimal? Total { get; set; }
        public int? ProjectId { get; set; }
        public int? CreatorEmployeeId { get; set; }
        public int? ProviderId { get; set; }

        public virtual Employee? CreatorEmployee { get; set; }
        public virtual Project? Project { get; set; }
        public virtual Provider? Provider { get; set; }
        public virtual ICollection<BuyingOrderDetail> BuyingOrderDetails { get; set; }
    }
}
