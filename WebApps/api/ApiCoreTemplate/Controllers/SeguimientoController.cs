using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data;
using System.Dynamic;
using System.Threading.Tasks;
using System;

namespace ApiBienestar.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SeguimientoController : ControllerBase
    {
        [HttpPost("docentes")]
        public async Task<string> GetDocentesSeguimiento([FromBody] JObject data)
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
                    string periodo = data["periodo"].ToObject<string>();
                    string id_depart = data["id_depart"].ToObject<string>();

                   ds = await b.GetDocentesxDepart(periodo, id_depart);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();


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
        [HttpPost("actividades")]
        public async Task<string> GetActividadesDocentes([FromBody] JObject data)
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
                    string periodo = data["periodo"].ToObject<string>();
                    string id_depart = data["id_depart"].ToObject<string>();
                    string dni_doc = data["dni_doc"].ToObject<string>();

                    ds = await b.GetResumenXDocente(periodo, id_depart,dni_doc);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();


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
