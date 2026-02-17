using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND_B2C.Models.Affiliate
{
    public class OrderaffViewModel
    {
        public string OrderId { get; set; }
        public string OrderCode { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ClientName { get; set; }
        public long? ClientId { get; set; }
        public string ClientNumber { get; set; }
        public string ClientEmail { get; set; }
        public string Note { get; set; }
        public double Payment { get; set; }
        public double Amount { get; set; }
        public string UtmSource { get; set; }
        public double Profit { get; set; }
        //public List<Source> StatusDetail { get; set; } = new List<Source>();
        public string Status { get; set; }
        public int StatusCode { get; set; }
        public int PayDetailId { get; set; }
        public string CreateDate { get; set; }
        public string CreateName { get; set; }
        public string UpdateName { get; set; }
        public string UpdateDate { get; set; }
        public string SalerName { get; set; }
        public string SalerUserName { get; set; }
        public string SalerEmail { get; set; }
        public string SaleGroupName { get; set; }
        public string PaymentStatus { get; set; }
        public double TotalDisarmed { get; set; }
        public double TotalAmount { get; set; }
        public double TotalNeedPayment { get; set; }
        public string UsUpdateName { get; set; }
        public string CreatedName { get; set; }
        public string ServiceType { get; set; }
        public string Vouchercode { get; set; }
        public bool IsChecked { get; set; }
        public bool IsDisabled { get; set; }
        public string PaymentStatusName { get; set; }
        public string PermisionTypeName { get; set; }
        public string OperatorIdName { get; set; }
    }
    public class ListOrderaffViewModel
    {
        public List<OrderaffViewModel> listData { get; set; }
        public long currentPage { get; set; }
        public long pageSize { get; set; }
        public long totalPage { get; set; }
        public long totalRecord { get; set; }
    }
    public class OrderaffSearch
    {
        public string AcClientid { get; set; }
        public string Status { get; set; } 
        public string StartDateFrom { get; set; }
        public string StartDateTo { get; set; }
        public string EndDateFrom { get; set; }
        public string EndDateTo { get; set; }
        public string PageIndex { get; set; }
        public string pageSize { get; set; }
    }
}
