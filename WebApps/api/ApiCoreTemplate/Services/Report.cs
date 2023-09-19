using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ApiBienestar.Services
{
    public class Report
    {

        public async Task<string> GenReport(string prm_name, string prm_value, string path_report, string path_server, string alias_file, string userjs = "", string pwdjs = "", string urljs = "")
        {
            string ret = "";

            var client = new RestClient("https://axis.curn.edu.co/apinotify/api/reports/pdf1paramfile");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json", "{\r\n\"prm_name\":\"" + prm_name + "\",\r\n\"prm_value\":\"" + prm_value + "\",\r\n\"alias_file\": \"" + alias_file + "\",\r\n\"path_report\": \"" + path_report + "\",\r\n\"path_server\": \"" + path_server + "\",\r\n\"userjs\": \"" + userjs + "\",\r\n\"pwdjs\": \"" + pwdjs + "\",\r\n\"urljs\":\"" + urljs + "\"\r\n}\r\n\r\n", ParameterType.RequestBody);
            IRestResponse response = await client.ExecuteAsync(request);
            ret = response.Content;

            return ret;

        }

        public string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
