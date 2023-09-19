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
using RestSharp;

namespace ApiBienestar.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantesController : ControllerBase
    {
        [HttpGet("dni/{dni}")]
        [HttpGet()]
        public async Task<string> GetPxdni(string dni = "")
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r= "";
            string json = "";
            try
            {
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    Main m = new Main();
                    m.Tablename = "bienes_participantes";
                    m.Fieldname = "dni_part";

                    if (dni != "")
                    {
                        m.Fieldvalue = dni;
                    }
                    
                    r = await m.Select(m);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = r;


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
        [HttpGet("codnum/{codnum}")]
        public async Task<string> GetPxcodnum(string codnum = "")
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

                if (ut.Role == "1" || ut.Role == "1") //Solo usuarios administradores
                {
                    Main m = new Main();
                    m.Tablename = "bienes_participantes";
                    m.Fieldname = "codnum_part";

                    if (codnum != "")
                    {
                        m.Fieldvalue = codnum;
                    }
                    json = await m.Select(m);


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
        [HttpGet("correo/{correo}")]
        public async Task<string> GetPxcorreo(string correo = "")
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
                    Bienestar b = new Bienestar();
                    resp.cod = "200";
                    resp.msg = "OK";
                    DataSet ds = new DataSet();
                    ds = await b.GetParticipantexEmail(correo);
                    resp.data = ds.Tables.Count > 0? ds.Tables[0]:new DataTable();
                        

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
        [HttpPost("buscar")]
        public async Task<string> Buscar([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r = "";
            string json = "";
            try
            {
                string dni= data["dni"].ToObject<string>();
                string nombre = data["nombre"].ToObject<string>();
                string apellido = data["apellido"].ToObject<string>();
                string correo = data["correo"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    Bienestar b = new Bienestar();
                    resp.cod = "200";
                    resp.msg = "OK";
                    DataSet ds = new DataSet();
                    ds = await b.BuscarParticipante(nombre, apellido, correo, dni);
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
                resp.data = new { error = "Exception: " + e.Message };
            }

            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        //Insertat participante (interno)
        [HttpPost("add")]
        public async Task<string> InsertParticipante([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string correo = data["correo"].ToObject<string>();
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    //Buscar entidad e insertar datos en BD

                    //Consultar Datos
                    var client2 = new RestClient("https://axis.curn.edu.co/apildap/api/ldap/account/" + correo);
                    client2.Timeout = -1;
                    var request2 = new RestRequest(Method.GET);
                    IRestResponse response2 = client2.Execute(request2);
                    var r = JsonConvert.DeserializeObject(response2.Content);
                    resp = JsonConvert.DeserializeObject<Respuesta>(r.ToString());

                    if (resp.cod == "200")
                    {
                        string ret = await b.InsertParticipante(resp.data.entidad);
                        if ( ret != "1")
                        {
                            resp.msg = "ERROR";
                            resp.cod = "500";
                            resp.data = new { error = "No se pudo agregar la cuenta. Exception: " + ret };
                        }
                        else
                        {
                            resp.data = ret;
                        }
                       
                        
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
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        //insertar participantescon la opción de inscribirlos en una actividad
        [HttpPost("add/massive")]
        public async Task<string> InsertParticipantes([FromBody] Participante[] data)
        {
            Respuesta resp = new Respuesta();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                               
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    
                    
                    
                    resp.data = await b.InsertParticipantes(data,ut);
                    resp.cod = "200";
                    resp.msg = "OK";


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
        //Actualiza nombres y apellidos para la generación del certificado
        [HttpPost("update")]
        public async Task<string> UpdateParticipantes([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string nombres = data["nombres"].ToObject<string>();
                string apellidos = data["apellidos"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null) //Cualquier usuario
                {
                    string r = await b.UpdateParticipanteName(ut.Dni, nombres, apellidos);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = r;
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

        //Actualiza Address de la Blockchain para la generación del certificado
        [HttpPost("update/address")]
        public async Task<string> UpdateAddress([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string address = data["address"].ToObject<string>();
                

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null) //Cualquier usuario
                {
                    string r = await b.UpdateParticipanteAddress(ut.Dni,address);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = r;
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

        
        
        [HttpPost("resumen")]
        public async Task<string> GetDatosAdmin([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string dni = "";
                if (data.ContainsKey("dni"))
                {
                    dni = data["dni"].ToObject<string>();
                }
              
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo  gestores y administradores
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                   
                    resp.msg = "OK";
                    resp.cod = "200";
                    
                    ds = await b.GetNumActPeriodoParticipante(new UserToken { Dni = dni });
                    resp.data.actperiodo = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
                    resp.data.aprobien = await b.GetAprobacionBienesParticipante(dni);
                    resp.data.totalhoras = await b.GetHorasAcumuladas(dni);
                    int s = 0;
                    s = await b.GetPuntos(dni);
                    resp.data.puntosacum = s;
                    ds = await b.GetAdminXDni(ut.Dni);
                    resp.data.apruebabienestar = ds.Tables.Count > 0 ? ds.Tables[0].Rows[0]["aprueba_bienestar"].ToString() : "";
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
