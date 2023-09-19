using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ApiBienestar.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PeriodosController : ControllerBase
    {
        [HttpGet("{periodo}")]
        [HttpGet()]
        public async Task<string> Get(string periodo = "")
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r = "";
            string json = "";
            try
            {
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != "") //cualquier usuario
                {
                    Main m = new Main();
                    DataSet ds = new DataSet();
                    //m.Tablename = "bienes_periodo";
                    //m.Fieldname = "periodo";

                    if (periodo != "")
                    {
                        //m.Fieldvalue = periodo;
                       ds = await m.QuerySelect("SELECT * FROM bienes_periodo WHERE periodo='"+periodo+"'");
                    }
                    else
                    {
                        ds = await m.QuerySelect("SELECT * FROM bienes_periodo ORDER BY 3 DESC");
                    }
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables[0];
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
                resp.data = new { error = "Exception: " + e.Message };
            }

            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        // POST api/values
        //INSERT
        [HttpPost]
        public async Task<string> Post([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string periodo = data["periodo"].ToObject<string>();
                string fech_ini = data["fech_ini"].ToObject<string>();
                string fech_fin = data["fech_fin"].ToObject<string>();
                

            
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();

                    m.Query_IUD = "INSERT INTO bienes_periodo (periodo, fech_ini, fech_fin) VALUES ('"+periodo+"', '"+fech_ini+"', '"+fech_fin+"')";

                    
                    string r = await m.ExeIUD(m);
                    if (r == "1")
                    {
                        resp.msg = "OK";
                        resp.cod = "200";
                    }
                    else 
                    {
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = new { error = r };
                    }
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
                resp.data = new { error = "Exception: " + e.Message };
            }

        string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
        return json;
    }

        // PUT api/values/5
        //UPDATE
        [HttpPut("{periodo}")]
        public async Task<string> Put(string periodo, [FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                
                string fech_ini = data["fech_ini"].ToObject<string>();
                string fech_fin = data["fech_fin"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_periodo SET fech_ini = '"+fech_ini+"', fech_fin = '"+fech_fin+"' WHERE periodo = '"+periodo+"'";
                    
                   
                    string r = await m.ExeIUD(m);
                    if (r == "1")
                    {
                        resp.msg = "OK";
                        resp.cod = "200";
                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = new { error = r };
                    }


                }
                else
                {
                    resp.msg = "ERROR";
                    resp.cod = "401";
                    resp.data = new { error = "Could not authenticate token" };
                }

            }catch(Exception e)
            {
                resp.msg = "ERROR";
                resp.cod = "500";
                resp.data = new { error = "Exception: " + e.Message };
            }

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        //// DELETE api/values/5
        //[HttpDelete("{periodo}")]
        //public async Task<string> Delete(string periodo)
        //{
        //    Respuesta resp = new Respuesta();
        //    resp.data = new ExpandoObject();
        //    Auth a = new Auth();
        //    try
        //    {
        //        string token = Request.Headers["Authorization"].ToString();
        //        UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

        //        if (ut.Role == "1") //Solo usuarios administradores
        //        {

        //            Main m = new Main();
        //            m.Query_IUD = "DELETE FROM bienes_periodo WHERE periodo = '"+periodo+"'";
                   
        //            string r = await m.ExeIUD(m);
        //            if (r == "1")
        //            {
        //                resp.msg = "OK";
        //                resp.cod = "200";
        //            }
        //            else
        //            {
        //                resp.msg = "ERROR";
        //                resp.cod = "500";
        //                resp.data = new { error = r };
        //            }

        //        }
        //        else
        //        {
        //            resp.msg = "ERROR";
        //            resp.cod = "401";
        //            resp.data = new { error = "Could not authenticate token" };
        //        }

        //    }
        //    catch (Exception e)
        //    {
        //        resp.msg = "ERROR";
        //        resp.cod = "500";
        //        resp.data = new { error = "Exception: " + e.Message };
        //    }

        //    string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
        //    return json;

        //}
       
    }
}
