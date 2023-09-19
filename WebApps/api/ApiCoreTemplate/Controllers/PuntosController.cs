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
    public class PuntosController : ControllerBase
    {
       
        //[HttpGet("{min}")]
        [HttpGet("{min?}/{dni?}")]
        public async Task<string> Transacciones(string min= "0", string dni="")
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

                if (dni != "")
                {

                    if (ut.Role == "3" || ut.Role == "1") //Solo usuarios Docentes
                    {
                        ds = await b.GetTransacciones(dni, min);
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
                else
                {

                    if (ut.Dni != null)
                    {
                        ds = await b.GetTransacciones(ut.Dni, min);
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

        //[HttpGet("horas/{min}")]
        [HttpGet("horas/{min?}/{dni?}")]
        public async Task<string> HistorialHoras(string min = "0", string dni = "")
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

                if (dni != "")
                {

                    if (ut.Role == "3" || ut.Role == "1") //Solo usuarios Docentes
                    {
                        ds = await b.GetHistorialHoras(dni, min);
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
                else
                {

                    if (ut.Dni != null)
                    {
                        ds = await b.GetHistorialHoras(ut.Dni, min);
                        resp.msg = "OK";
                        resp.cod = "200";
                        DataTable ar = new DataTable();
                        resp.data = ds.Tables.Count > 0 ? ds.Tables[0] : ar;
                        
                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "401";
                        resp.data = new { error = "Could not authenticate token" };
                    }
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

        [HttpGet("bonos/{id}")]
        [HttpGet("bonos")]
        public async Task<string> GetBonos(string id = "")
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
                    m.Tablename = "bienes_lealtad_bonos";
                    m.Fieldname = "idbonus";

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
    }
}
