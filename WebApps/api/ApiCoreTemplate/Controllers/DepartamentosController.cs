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
    public class DepartamentosController : ControllerBase
    {
        [HttpGet("{id_depart}")]
        [HttpGet()]
        public async Task<string> Get(string id_depart = "")
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

                if (ut.Role == "1" || ut.Role =="2") //Solo usuarios administradores
                {
                    Main m = new Main();
                    m.Tablename = "bienes_departamentos";
                    m.Fieldname = "id_depart";

                    if (id_depart != "")
                    {
                        m.Fieldvalue = id_depart;
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

        [HttpGet("misdepartamentos")]
        public async Task<string> GetMisdepartamento()
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores
                {
                    DataSet ds = new DataSet();
                    Bienestar b = new Bienestar();
                    ds = await b.GetAdminDepart(ut);
                    resp.msg = "OK";
                    resp.cod = "200";
                    DataTable dt = new DataTable();
                    resp.data = ds.Tables.Count > 0 ? ds.Tables[0]:dt ;
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
                string id_depart = data["id_depart"].ToObject<string>();
                string nomb_depart = data["nomb_depart"].ToObject<string>();
                
                

            
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();

                    m.Query_IUD = "INSERT INTO bienes_departamentos (id_depart, nomb_depart) VALUES ('"+id_depart+"', '"+nomb_depart+"')";

                    
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
        [HttpPut("{id_depart}")]
        public async Task<string> Put(string id_depart, [FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                
                string nomb_depart = data["nomb_depart"].ToObject<string>();
                

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_departamentos SET nomb_depart = '"+nomb_depart+"' WHERE id_depart = '"+id_depart+"'";
                    
                   
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
        [HttpDelete("{id_depart}")]
        public async Task<string> Delete(string id_depart)
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
                    m.Query_IUD = "DELETE FROM bienes_departamentos WHERE id_depart = '"+id_depart+"'";
                   
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
