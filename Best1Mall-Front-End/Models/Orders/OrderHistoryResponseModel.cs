using Models.MongoDb;

namespace Best1Mall_Front_End.Models.Orders
{
    public class OrderHistoryResponseModel
    {
        public List<OrderESModel> data { get; set; }
        public List<OrderDetailMongoDbModel> data_order { get; set; }

        public int page_index { get; set; }
        public int page_size { get; set; }
        public long total { get; set; }
    }
    public class OrderHistoryCountResponseModel
    {
     public long all { get; set; }
     public long waiting_payment { get; set; }
     public long on_delivery { get; set; }
     public long success { get; set; }
     public long cancel { get; set; }
     public long refund { get; set; }
     public long processing { get; set; }
    }
    public class PaymentResponseModel
    {
        public List<AllotmentUseModel> ListData { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPage { get; set; }
        public long TotalRecord { get; set; }
    }

    public class AllotmentUseModel
    {
        public int Id { get; set; }
        public long DataId { get; set; }
        public DateTime CreateDate { get; set; }
        public double AmountUse { get; set; }
        public int AllotmentFundId { get; set; }
        public long AccountClientId { get; set; }
        public short ServiceType { get; set; }
        public long ClientId { get; set; }
        public int? PaymentStatus { get; set; }
        public string? Description { get; set; }
        public double? TotalAmoutCalculate { get; set; }
        public DateTime? PaymentFromDate { get; set; }
        public DateTime? PaymentToDate { get; set; }
        public string BankId { get; set; }
        public string AccountNumber { get; set; }
        public string? AccountName { get; set; }
        public string? Branch { get; set; }
    }
}
