using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Best1Mall_Front_End.Models.Client
{
    public class ClientChangePasswordRequestModel
    {
        public string password { get; set; }
        public string confirm_password { get; set; }
        public string old_password { get; set; }

        public string token { get; set; }
    }
    public class ClientForgotChangePasswordRequestModel
    {
        public long? account_client_id { get; set; }
        public long? client_id { get; set; }
        public string password { get; set; }
        public string confirm_password { get; set; }
        public string token_forgot_password { get; set; }
    }
}
