﻿namespace Best1Mall_Front_End.Models.NinjaVan
{
    public class ShippingFeeResponseModel
    {
        public int from_province_id { get; set; }
        public int to_province_id { get; set; }
        public int type { get; set; }
        public int total_shipping_fee { get; set; }
    }
}
