namespace BackendCRMconstructora.Models
{
    using System.Collections.Generic;

    public class UserData
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public List<string> Roles { get; set; }
        public List<string> Permissions { get; set; }
    }

}
