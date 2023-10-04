using System;
using System.Collections.Generic;

namespace BackendCRMconstructora.Models
{
    public partial class Task
    {
        public int TaskId { get; set; }
        public string? Description { get; set; }
        public DateTime? DateDue { get; set; }
        public int? PriorityId { get; set; }
        public int? StatusId { get; set; }
        public int? ProjectId { get; set; }
        public int? EmployeeId { get; set; }

        public virtual Employee? Employee { get; set; }
        public virtual Project? Project { get; set; }
    }
}
