using Best1Mall_Front_End.Utilities.Lib;
using Best1Mall_Front_End.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using Best1Mall_Front_End.Models.Client;
using Best1Mall_Front_End.Utilities.Contants;
using LIB.Models.APIRequest;
using Best1Mall_Front_End.Models.Location;

namespace Best1Mall_Front_End.Controllers.Client.Business
{
    public class LocationServices : APIService
    {
        private readonly IConfiguration _configuration;
        public LocationServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
        //public async Task<List<Province>> Province(LocationRequestModel request)
        //{
        //    try
        //    {
        //        var result = await POST(_configuration["API:location_province"], request);
        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ResponseType.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<Province>>(jsonData["data"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //    }
        //    return null;

        //}
        //Modified Service method
        public async Task<List<Province>> Province(LocationRequestModel request)
        {
            try
            {
                // Sử dụng API Viettel Post
                var viettelApiUrl = "https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1";

                using (var httpClient = new HttpClient())
                {
                    // Có thể cần thêm headers nếu API yêu cầu
                    // httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_TOKEN");

                    var response = await httpClient.GetAsync(viettelApiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResult = await response.Content.ReadAsStringAsync();
                        var jsonData = JObject.Parse(jsonResult);

                        // Kiểm tra response structure của Viettel API
                        // Thường sẽ có status và data
                        if (jsonData["status"]?.ToString() == "200" || jsonData["success"]?.ToObject<bool>() == true)
                        {
                            // Map dữ liệu từ Viettel format sang Province model của bạn
                            var viettelProvinces = jsonData["data"]?.ToObject<List<ViettelProvince>>();

                            if (viettelProvinces != null)
                            {
                                return viettelProvinces.Select(vp => new Province
                                {
                                    Id = vp.PROVINCE_ID,
                                    Name = vp.PROVINCE_NAME,
                                    NameNonUnicode = vp.PROVINCE_CODE
                                    // Map các field khác theo cần thiết
                                }).ToList();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception nếu cần
                // _logger.LogError(ex, "Error calling Viettel Post API");
            }
            return new List<Province>(); // Trả về empty list thay vì null
        }
        //public async Task<List<District>> District(LocationRequestModel request)
        //{
        //    try
        //    {
        //        var result = await POST(_configuration["API:location_district"], request);
        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ResponseType.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<District>>(jsonData["data"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //    }
        //    return null;

        //}
        public async Task<List<District>> District(LocationRequestModel request)
        {
            try
            {

                var viettelApiUrl = $"https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=-1";

                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetAsync(viettelApiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResult = await response.Content.ReadAsStringAsync();
                        var jsonData = JObject.Parse(jsonResult);

                        if (jsonData["status"]?.ToString() == "200")
                        {
                            var viettelDistricts = jsonData["data"]?.ToObject<List<ViettelDistrict>>();

                            if (viettelDistricts != null)
                            {
                                return viettelDistricts.Select(d => new District
                                {
                                    Id = d.DISTRICT_ID,
                                    DistrictId = d.DISTRICT_VALUE,
                                    Name = d.DISTRICT_NAME,
                                    ProvinceId = d.PROVINCE_ID.ToString(),
                                    Status = 1,
                                    CreatedDate = DateTime.Now
                                }).ToList();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gọi API Viettel (district): " + ex.Message);
            }

            return new List<District>();
        }
        //public async Task<List<Ward>> Ward(LocationRequestModel request)
        //{
        //    try
        //    {
        //        var result = await POST(_configuration["API:location_ward"], request);
        //        var jsonData = JObject.Parse(result);
        //        var status = int.Parse(jsonData["status"].ToString());

        //        if (status == (int)ResponseType.SUCCESS)
        //        {
        //            return JsonConvert.DeserializeObject<List<Ward>>(jsonData["data"].ToString());
        //        }
        //    }
        //    catch
        //    {
        //    }
        //    return null;

        //}
        public async Task<List<Ward>> Ward(LocationRequestModel request)
        {
            try
            {
                
                var viettelApiUrl = $"https://partner.viettelpost.vn/v2/categories/listWards?districtId=-1";

                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetAsync(viettelApiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResult = await response.Content.ReadAsStringAsync();
                        var jsonData = JObject.Parse(jsonResult);

                        if (jsonData["status"]?.ToString() == "200")
                        {
                            var viettelWards = jsonData["data"]?.ToObject<List<ViettelWard>>();

                            if (viettelWards != null)
                            {
                                return viettelWards.Select(w => new Ward
                                {
                                    Id = w.WARDS_ID,
                                    WardId = w.WARDS_ID.ToString(),
                                    Name = w.WARDS_NAME,
                                    DistrictId = w.DISTRICT_ID.ToString(),
                                    Status = 1,
                                    CreatedDate = DateTime.Now
                                }).ToList();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gọi API Viettel (ward): " + ex.Message);
            }

            return new List<Ward>();
        }


    }
}
