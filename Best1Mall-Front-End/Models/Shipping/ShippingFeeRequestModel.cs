namespace Best1Mall_Front_End.Models.NinjaVan
{
    public class ShippingFeeRequestModel
    {
        public int from_province_id { get; set; }
        public int to_province_id { get; set; }
        public string shipping_service_code { get; set; }
        public int carrier_id { get; set; }
        public List<ShippingFeeRequestCart> carts { get; set; }
    }
    public class ShippingFeeRequestCart
    {
        public string id { get; set; }
        public string product_id { get; set; }
        public int quanity { get; set; }


    }
    public class VTPServiceListingRequestModel
    {
        public List<VTPServiceListingRequestCart> carts { get; set; }
        public int receiver_provinces_id { get; set; }
        public int receiver_district_id { get; set; }
    }
    public class VTPServiceListingRequestCart
    {
        public string _id { get; set; }
        public int quanity { get; set; }
    }

    public class VTPServiceListingResponseModel
    {
        public int supplier_id { get; set; }
        public string supplier_name { get; set; }
        public List<string> cart_ids { get; set; }
        public List<VTPServiceListingResponseMethod> services { get; set; }
    }
    public class VTPServiceListingResponseMethod
    {
        public string service_code { get; set; }
        public string name { get; set; }
        public string time { get; set; }
        public long total_amount { get; set; }


    }
}
