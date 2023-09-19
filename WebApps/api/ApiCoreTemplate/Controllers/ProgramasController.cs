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
    public class ProgramasController : ControllerBase
    {
        [HttpGet("{codi_prog}")]
        [HttpGet()]
        public async Task<string> Get(string codi_prog = "")
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
                    m.Tablename = "bienes_programas";
                    m.Fieldname = "codi_prog";

                    if (codi_prog != "")
                    {
                        m.Fieldvalue = codi_prog;
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
                string codi_prog = data["codi_prog"].ToObject<string>();
                string nomb_prog = data["nomb_prog"].ToObject<string>();
                string ciudad = data["ciudad"].ToObject<string>();
                string activo = data["activo"].ToObject<string>();

            
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();

                    m.Query_IUD = "INSERT INTO bienes_programas (codi_prog,nomb_prog,ciudad,activo) VALUES('" + codi_prog + "','" + nomb_prog.ToUpper() + "','" + ciudad.ToUpper() + "','" + activo + "')";

                    
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
        [HttpPut("{codi_prog}")]
        public async Task<string> Put(string codi_prog, [FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                    
                string nomb_prog = data["nomb_prog"].ToObject<string>();
                string ciudad = data["ciudad"].ToObject<string>();
                string activo = data["activo"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_programas SET nomb_prog = '" + nomb_prog.ToUpper() + "', ciudad = '" + ciudad.ToUpper() + "', activo = '" + activo + "' WHERE codi_prog = '" + codi_prog + "'";
                    
                   
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
        [HttpDelete("{codi_prog}")]
        public async Task<string> Delete(string codi_prog)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();
                    m.Query_IUD = "DELETE FROM bienes_programas WHERE codi_prog = '"+codi_prog+"'";
                   
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
       
    }
}
