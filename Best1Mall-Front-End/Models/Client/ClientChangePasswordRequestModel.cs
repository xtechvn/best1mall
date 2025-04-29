using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HuloToys_Front_End.Models.Client
{
    public class ClientChangePasswordRequestModel
    {
        public long id { get; set; }
        public string password { get; set; }
        public string confirm_password { get; set; }
        public string token { get; set; }
    }
}
