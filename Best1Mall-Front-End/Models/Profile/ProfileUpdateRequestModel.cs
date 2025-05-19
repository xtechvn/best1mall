namespace Best1Mall_Front_End.Models.Profile
{
    public class ProfileUpdateRequestModel
    {
        public string Token { get; set; }

        public string ClientName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public int? Gender { get; set; } // 0: Nam, 1: Nữ, 2: Khác

        public DateTime? Birthday { get; set; }
    }

}
