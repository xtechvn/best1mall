using Newtonsoft.Json;

namespace Best1Mall_Front_End.Models.Location;

public class Province
{



    public int Id { get; set; }


    public string Name { get; set; }

 
    public string ProvinceId { get; set; }  // Có thể dùng nếu cần mã tỉnh


    public string NameNonUnicode { get; set; }

    public string Type { get; set; }


    public short? Status { get; set; }


    public DateTime? CreatedDate { get; set; }

}

