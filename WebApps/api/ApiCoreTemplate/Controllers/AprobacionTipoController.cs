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
    public class AprobacionTipoController : ControllerBase
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
                    m.Tablename = "bienes_aprobaciones_tipo";
                    m.Fieldname = "tipo_tapro";

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
                
                string nomb_tapro = data["nomb_tapro"].ToObject<string>();
                string desc_aprob = data["desc_aprob"].ToObject<string>();
                string acum_horas = data["acum_horas"].ToObject<string>();
                string certifica = data["certifica"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();

                    m.Query_IUD = "INSERT INTO  bienes_aprobaciones_tipo(nomb_tapro,desc_aprob,acum_horas,certifica) VALUES ('"+nomb_tapro+"','"+desc_aprob+"','"+acum_horas+"','"+certifica+"')";

                    
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



                string nomb_tapro = data["nomb_tapro"].ToObject<string>();
                string desc_aprob = data["desc_aprob"].ToObject<string>();
                string acum_horas = data["acum_horas"].ToObject<string>();
                string certifica = data["certifica"].ToObject<string>();


                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_aprobaciones_tipo SET nomb_tapro = '"+nomb_tapro+"',desc_aprob = '"+desc_aprob+"',acum_horas = '"+acum_horas+"',certifica = '"+certifica+"' WHERE id_tapro = '"+id+"'";
                    
                   
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

        
       
    }
}
