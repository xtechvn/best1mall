﻿namespace Best1Mall_Front_End.Models.Client
{
    public class ClientRegisterRequestModel
    {
        public string user_name { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string password { get; set; }
        public string confirm_password { get; set; }
        public string token { get; set; }
        public bool is_receive_email { get; set; }
        public string otp_code { get; set; }

    }
}
