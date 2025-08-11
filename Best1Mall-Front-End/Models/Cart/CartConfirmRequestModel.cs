using Best1Mall_Front_End.Models.NinjaVan;
using Best1Mall_Front_End.Models.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.APIRequest
{
    public class CartConfirmRequestModel
    {
        public string token { get; set; }
        public int payment_type { get; set; }
        public ShippingFeeRequestModel delivery_detail { get; set; }
        public List<CartConfirmItemRequestModel> carts { get; set; }
        public AddressClientFEModel address { get; set; }
        public long address_id { get; set; }
        // 🔁 Đổi từ int?/string → List<>
        public List<int> voucher_id { get; set; } = new();        // cho phép mảng rỗng
        public List<string> voucher_code { get; set; } = new();    // cho phép mảng rỗng

    }
    public class CartConfirmItemRequestModel
    {
        public string id { get; set; }
        public int quanity { get; set; }
    }
}
