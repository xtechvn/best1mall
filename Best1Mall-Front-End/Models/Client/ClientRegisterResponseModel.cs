using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Models.Client;

namespace LIB.Models.APIRequest
{
    public class ClientRegisterResponseModel
    {
       public string msg { get; set; }
       public int code { get; set; }
       public ClientLoginResponseModel data { get; set; }
    }
}
