using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Best1Mall_Front_End.Models.Client
{
    public class ClientForgotPasswordRequestModel
    {
        public string name { get; set; }
    }
    public class CientSendGmailRequestModel
    {
        public string token { get; set; }
        public string uuid { get; set; }
    }
    public class ValidateChangePasswordTokenRequest
    {
        public string token { get; set; }
        public string uuid { get; set; }
        public string user_token { get; set; }
    }
}
