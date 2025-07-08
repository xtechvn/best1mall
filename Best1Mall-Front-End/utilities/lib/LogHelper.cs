using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace Best1Mall_Front_End.Utilities.Lib
{
    public static class LogHelper
    {
        public static void InsertLogTelegramByUrl(string bot_token, string id_group, string msg)
        {
            InsertLogSlack(msg);
            string JsonContent = string.Empty;
            string url_api = "https://api.telegram.org/bot" + bot_token + "/sendMessage?chat_id=" + id_group + "&text=" + msg;
            try
            {
                using (var webclient = new WebClient())
                {
                    JsonContent = webclient.DownloadString(url_api);
                }
            }
            catch (Exception ex)
            {
                WriteLogActivity("D://", ex.ToString());
            }
        }
        public static void WriteLogActivity(string AppPath, string log_content)
        {
            StreamWriter sLogFile = null;
            try
            {
                //Ghi lại hành động của người sử dụng vào log file
                string sDay = string.Format("{0:dd}", DateTime.Now);
                string sMonth = string.Format("{0:MM}", DateTime.Now);
                string strLogFileName = sDay + "-" + sMonth + "-" + DateTime.Now.Year + ".log";
                string strFolderName = AppPath + @"\Logs\" + DateTime.Now.Year + "-" + sMonth;
                //Application.StartupPath
                //Tạo thư mục nếu chưa có
                if (!Directory.Exists(strFolderName + @"\"))
                {
                    Directory.CreateDirectory(strFolderName + @"\");
                }
                strLogFileName = strFolderName + @"\" + strLogFileName;

                if (File.Exists(strLogFileName))
                {
                    //Nếu đã tồn tại file thì tiếp tục ghi thêm
                    sLogFile = File.AppendText(strLogFileName);
                    sLogFile.WriteLine(string.Format("Thời điểm ghi nhận: {0:hh:mm:ss tt}", DateTime.Now));
                    sLogFile.WriteLine(string.Format("Chi tiết log: {0}", log_content));
                    sLogFile.WriteLine("-------------------------------------------");
                    sLogFile.Flush();
                }
                else
                {
                    //Nếu file chưa tồn tại thì có thể tạo mới và ghi log
                    sLogFile = new StreamWriter(strLogFileName);
                    sLogFile.WriteLine(string.Format("Thời điểm ghi nhận: {0:hh:mm:ss tt}", DateTime.Now));
                    sLogFile.WriteLine(string.Format("Chi tiết log: {0}", log_content));
                    sLogFile.WriteLine("-------------------------------------------");
                }
                sLogFile.Close();
            }
            catch (Exception)
            {
                if (sLogFile != null)
                {
                    sLogFile.Close();
                }
            }
        }

        private static async Task InsertLogSlack(string message)
        {
            try
            {
                using (StreamReader r = new StreamReader("appsettings.json"))
                {
                    AppSettings _appconfig = new AppSettings();
                    string json = r.ReadToEnd();
                    _appconfig = JsonConvert.DeserializeObject<AppSettings>(json);
                    var url = _appconfig.BotSetting.slack_n8n;
                    var contentObj = new logSlackmodel();
                    contentObj.environment = _appconfig.BotSetting.environment;
                    contentObj.project_name = _appconfig.BotSetting.project_name;
                    contentObj.log_content = message;
                    HttpClient httpClient = new HttpClient();
                    var content = new StringContent(JsonConvert.SerializeObject(contentObj), Encoding.UTF8, "application/json");
                    await httpClient.PostAsync(url, content);
                }
            }
            catch (Exception ex)
            {
                WriteLogActivity("D://", ex.ToString());
            }

        }
        public class AppSettings
        {
            public BotSetting BotSetting { get; set; }
            public string CompanyType { get; set; }

        }
        public class logSlackmodel
        {
            public string project_name { get; set; }
            public string log_content { get; set; }
            public string environment { get; set; }
        }
        public class BotSetting
        {
            public string bot_token { get; set; }
            public string bot_group_id { get; set; }
            public string environment { get; set; }
            public string slack_n8n { get; set; }
            public string project_name { get; set; }
        }
    }
}
