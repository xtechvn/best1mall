﻿namespace HuloToys_Front_End.Models.Products
{
    public class ProductListRequestModel
    {
        public int group_id { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
        public string? view_name { get; set; }
    }
}
