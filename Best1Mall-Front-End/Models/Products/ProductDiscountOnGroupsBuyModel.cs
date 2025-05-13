﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Best1Mall_Front_End.Models.Products
{
    public class ProductDiscountOnGroupsBuyModel
    {
        public int from { get; set; }
        public int to { get; set; }
        public double discount { get; set; }
        public int type { get; set; }

    }
}
