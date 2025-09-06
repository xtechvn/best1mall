using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND_B2C.Models.Affiliate
{
    public class AffiliateModel
    {
        public long id { get; set; }
    } 
    public class AddAffiliateModel
    {
        public string link_aff { get; set; }
        public string referral_first_id { get; set; }
    }
    public class AffiliateResponse
    {
        public int status { get; set; }
        public string link { get; set; }
    }
    public class BaseResponseAffilia
    {
        public int status { get; set; }
        public string msg { get; set; }
        public AffiliateData data { get; set; }  // ✅ đúng chỗ
    }

    public class AffiliateData
    {
        public int id { get; set; }
        public string utm_source { get; set; }
        public string utm_medium { get; set; }
    }

    public class RegisterAffiliateBankRequestModel
    {
        public int Id { get; set; }
        public string token { get; set; }
        public string BankId { get; set; }
        public string AccountNumber { get; set; }
        public string AccountName { get; set; }
        public string Branch { get; set; }
    }
    public class BaseResponseBank
    {
        public int status { get; set; }
        public string msg { get; set; }
        public BankInfo data { get; set; }
        public ClientInfo client { get; set; }
    }
    public class BankInfo
    {
        public int id { get; set; }
        public string bankId { get; set; }
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string branch { get; set; }
        public int? supplierId { get; set; }
        public int? clientId { get; set; }
        public string createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public string updatedBy { get; set; }
        public DateTime? updatedDate { get; set; }
        public bool? isDisplayWebsite { get; set; }
    }

    public class ClientInfo
    {
        public int id { get; set; }
        public string email { get; set; }
        public string clientName { get; set; }
        public int? gender { get; set; }
        public DateTime? birthday { get; set; }
        public string phone { get; set; }
        public string token { get; set; }
        public string referralId { get; set; }
    }

}
