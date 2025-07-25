namespace Best1Mall_Front_End.Models.Location
{
    public class LocationRequestModel
    {
        public string id { get; set; }
    }
    public class ViettelProvince
    {
        public int PROVINCE_ID { get; set; }
        public string PROVINCE_NAME { get; set; }
        public string PROVINCE_CODE { get; set; }
    }
    public class ViettelDistrict
    {
        public int DISTRICT_ID { get; set; }
        public string DISTRICT_VALUE { get; set; }
        public string DISTRICT_NAME { get; set; }
        public int PROVINCE_ID { get; set; }
    }
    public class ViettelWard
    {
        public int WARDS_ID { get; set; }
        public string WARDS_NAME { get; set; }
        public int DISTRICT_ID { get; set; }
    }

}
