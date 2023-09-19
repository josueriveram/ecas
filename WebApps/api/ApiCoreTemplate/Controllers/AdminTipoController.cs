using System;
using System.Collections.Generic;
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
    public class AdminTipoController : ControllerBase
    {
        [HttpGet("{id}")]
        [HttpGet()]
        public async Task<string> Get(string id = "")
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

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    Main m = new Main();
                    m.Tablename = "bienes_admin_tipo";
                    m.Fieldname = "id";

                    if (id != "")
                    {
                        m.Fieldvalue = id;
                    }
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = await m.SelectDyn(m);
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
                
                string tipo = data["tipo"].ToObject<string>();
                
                

            
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();

                    m.Query_IUD = "INSERT INTO bienes_admin_tipo (tipo) VALUES ('"+tipo+"')";

                    
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
        [HttpPut("{id}")]
        public async Task<string> Put(string id, [FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                
                string tipo = data["tipo"].ToObject<string>();
                

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_admin_tipo SET tipo = '"+tipo+"' WHERE id = '"+id+"'";
                    
                   
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

        // DELETE api/values/5
        //[HttpDelete("{id}")]
        //public async Task<string> Delete(string id)
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
        //            m.Query_IUD = "DELETE FROM bienes_admin_tipo WHERE id = '"+id+"'";
                   
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
