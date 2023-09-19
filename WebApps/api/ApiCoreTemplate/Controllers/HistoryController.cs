using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        [HttpPost()]
        public async Task<string> Historicos([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string json = "";
            DataSet ds = new DataSet();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1")
                {
                    string bd = data["bd"].ToObject<string>(); // string 1: 1998 a 2010-01   2: 2010-02 a 2020-02
                    string dni = data["dni"].ToObject<string>(); //Solo aplica a bd 2
                    string nombres = data["nombres"].ToObject<string>();
                    string indice = data["indice"].ToObject<string>();

                    ds = await b.GetDatosHistory(bd, dni, nombres, indice);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables.Count > 0 ?ds.Tables[0]:new DataTable();


                }
                else
                {
                    resp.msg = "ERROR";
                    resp.cod = "401";
                    resp.data = new { error = "Could not authenticate token" };
                }

            }
            catch (Exception e)
            {
                resp.msg = "ERROR";
                resp.cod = "500";
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
    }
}
