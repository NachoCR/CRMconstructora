using System.Data;

namespace BackendCRMconstructora.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Password { get; set; }
        public int RoleID { get; set; }
        public int IdentifierID { get; set; }
        public string Identification { get; set; }

        public int Role { get; set; }
        public int Identifier { get; set; }
    }

}
