using Newtonsoft.Json;

namespace Best1Mall_Front_End.Models.Profile
{
    public class ProfileListResponseModel
    {
        
        public int Id { get; set; }

       
        public string Email { get; set; }
      
        public int? status { get; set; }

       
        public string ClientName { get; set; }

      
        public string? Gender { get; set; } // hoặc bool?, tùy backend

     
        public DateTime? Birthday { get; set; } // null-safe


        public string Phone { get; set; }

    
        public string? Token { get; set; }
    }
}
