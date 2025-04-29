using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HuloToys_Front_End.Utilities.Lib
{
    public static class CommonHelper
    {
        

        public static string genLinkNewsV2(string Title, string article_id)
        {
            Title = StringHelpers.ConvertNewsUrlToNoSymbol(CheckMaxLength(Title.Trim(), 100));
            return ("/" + Title + "-" + article_id);
        }

        // xử lý chuỗi quá dài
        //str: Chuoi truyen vao
        // So ky tu toi da cho phep
        // OUPUT: Tra ra chuoi sau khi xu ly
        public static string CheckMaxLength(string str, int MaxLength)
        {
            try
            {
                //str = RemoveSpecialCharacters(str);
                if (str.Length > MaxLength)
                {

                    str = str.Substring(0, MaxLength + 1); // cat chuoi
                    if (str != " ") //  ky tu sau truoc khi cat co chua ky tu ko
                    {
                        while (str.Last().ToString() != " ") // cat not cac cu tu chu cho den dau cach gan nhat
                        {
                            str = str.Substring(0, str.Length - 1); // dich trai
                        }
                    }
                    //str = str + "...";
                }
                return str;
            }
            catch (Exception ex)
            {
                // Utilities.Common.WriteLog(Models.Contants.FOLDER_LOG, "ERROR CheckMaxLength : " + ex.Message);
                return string.Empty;
            }
        }

        public static string RemoveSpecialCharacters(string input)
        {
            try
            {
                Regex r = new Regex("(?:[^a-z0-9 ]|(?<=['\"])s)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);
                return r.Replace(input, String.Empty);
            }
            catch (Exception e)
            {
                return input ?? string.Empty;
            }
        }



       
    }
}