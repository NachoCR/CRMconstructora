using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class Project
    {
        public Project()
        {
            BuyingOrders = new HashSet<BuyingOrder>();
            Tasks = new HashSet<Task>();
        }

        public int ProjectId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? StatusId { get; set; }
        public int? ClientId { get; set; }

        public virtual Client? Client { get; set; }
        public virtual ICollection<BuyingOrder> BuyingOrders { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
    }
}
