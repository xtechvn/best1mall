namespace Best1Mall_Front_End.Models
{
    public class CategoryModel
    {
        
        public int id { get; set; }

        public int parentid { get; set; }

        public int? positionid { get; set; }

        public string name { get; set; } = null!;

        public string? image_path { get; set; }

        public int? order_no { get; set; }

        public string? url_path { get; set; }

        public int? status { get; set; }

        public DateTime? createdon { get; set; }

        public DateTime? modifiedon { get; set; }


        public string? description { get; set; }

        public bool isshowheader { get; set; }

        public bool isshowfooter { get; set; }
        public bool isflashsale { get; set; }


        public long? product_count { get; set; }
        public List<CategoryModel> group_product_child { get; set; }

    }
    public class HomepageBannerModel
    {
        public List<AllCode> main { get; set; }
        public List<AllCode> sub { get; set; }
    }
    public partial class AllCode
    {
        public int Id { get; set; }

        public string Type { get; set; } = null!;

        public short CodeValue { get; set; }

        public string? Description { get; set; }

        public short? OrderNo { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreateDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdateTime { get; set; }

        //public virtual ICollection<AccountAccessApiPermission> AccountAccessApiPermissions { get; set; } = new List<AccountAccessApiPermission>();
    }

}
