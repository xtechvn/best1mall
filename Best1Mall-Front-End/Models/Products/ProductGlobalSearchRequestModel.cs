﻿namespace Best1Mall_Front_End.Models.Products
{
    public class ProductGlobalSearchRequestModel
    {
        public string keyword { get; set; }
        public string token { get; set; }
        public int? stars { get; set; }
        public string? group_product_id { get; set; }
        public string? brands { get; set; }
        public int? page_index { get; set; }
        public int? page_size { get; set; }
    }
}
