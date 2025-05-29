namespace Best1Mall_Front_End.Models.Client
{
    public class ClientLoginResponseModel
    {
        public int  status { get; set; }
        public string  token { get; set; }
        public string user_name { get; set; }
        public string name { get; set; }
        public string ip { get; set; }
        public DateTime time_expire { get; set; }
        public string msg { get; set; }

    }
}
