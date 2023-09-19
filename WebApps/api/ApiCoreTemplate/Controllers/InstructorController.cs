using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services;
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
    public class InstructorController : ControllerBase
    {
        [HttpGet("actividades/lista/{min?}")]
        public async Task<string> Actividades(string min = "0")
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

                if (ut.Dni != null)
                {

                    ds = await b.GetActividadesencursoDocente(ut);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables.Count>0?ds.Tables[0]:new DataTable();


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
        [HttpGet("actividades/{id}")]
        public async Task<string> DetalleActividad(string id)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string json = "";
            DataSet ds = new DataSet();
            DataSet dsesiones = new DataSet();
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            try
            {
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role != null)
                {

                    ds = await b.GetDetallesActividadInstructor(id);

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

        [HttpGet("historial")]
        [HttpGet("historial/{periodo}")]
        public async Task<string> Historial(string periodo="")
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

                if (ut.Dni != null)
                {
                    if (periodo != "")
                    {
                        ds = await b.GetHistorialDocente(ut,periodo);
                    }
                    else
                    {
                        ds = await b.GetHistorialDocente(ut);
                    }
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = ds.Tables.Count > 0 ? ds.Tables[0]: new DataTable();


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
        [HttpPost("asistencia")]
        public async Task<string> AsignarAsistencia([FromBody] Asistencia[] data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                
               


                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "3" || ut.Role == "1" || ut.Role == "2") //Solo usuarios Docentes
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    Asistencia[] asist;
                    asist= await b.SetAsistencia(data, ut);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = asist;

                    //Notificar
                    Notify noti = new Notify();
                    string correo = "";
                    for(int i=0;i<asist.Length;i++) 
                    {
                        DataSet prs = await b.GetParticipantexDni(asist[i].DniPart);
                        correo = prs.Tables[0].Rows[0]["email_part"].ToString(); 
                        await noti.NotificarBasicActividad("notify_estadoact", correo , asist[i].IdAct, asist[i].Item);
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
        [HttpPost("aprobacion")]
        public async Task<string> AsignarAprobacion([FromBody] Aprobacion[] data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {




                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "3" || ut.Role == "1" || ut.Role == "2") //Solo usuarios Docentes
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    Aprobacion[] aprob;
                    aprob = await b.SetAprobacion(data, ut);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = aprob;

                    //Notificar
                    Notify noti = new Notify();
                    string correo = "";
                   
                    DataSet cfg = await b.GetConfig("url_base");
                    string url_base = cfg.Tables[0].Rows[0]["valor_conf"].ToString();
                    for (int i = 0; i < aprob.Length; i++)
                    {
                        DataSet prs = await b.GetParticipantexDni(aprob[i].DniPart);
                        correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                        
                        await noti.NotificarBasicActividad("notify_aprobacion", correo, aprob[i].IdAct, "",url_base);
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
        [HttpPost("autoaprobacion")]
        public async Task<string> AutoAprobacion([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string idactividad = data["idactividad"].ToObject<string>();


                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "3" || ut.Role == "1" || ut.Role == "2") //Solo usuarios Docentes
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet aprob = new DataSet();
                    aprob = await b.SetAutoAprobacion(idactividad, ut);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = aprob.Tables.Count > 0 ? aprob.Tables[0] : new DataTable();

                    //Notificar
                    Notify noti = new Notify();
                    string correo = "";

                    DataSet cfg = await b.GetConfig("url_base");
                    string url_base = cfg.Tables[0].Rows[0]["valor_conf"].ToString();
                    if (aprob.Tables.Count > 0)
                    {
                        for (int i = 0; i < aprob.Tables[0].Rows.Count; i++)
                        {
                            DataSet prs = await b.GetParticipantexDni(aprob.Tables[0].Rows[i]["dni_part"].ToString());
                            if (prs.Tables.Count > 0)
                            {
                                correo = prs.Tables[0].Rows[0]["email_part"].ToString();

                                await noti.NotificarBasicActividad("notify_aprobacion", correo, idactividad, "", url_base);
                            }
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

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("participantesaprob")]
        public async Task<string> GetParticipantesAprob([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string idactividad = data["idactividad"].ToObject<string>();
                
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "3" || ut.Role == "1" || ut.Role=="2") //Solo usuarios Docentes
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetParticipantesAprob(idactividad);
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
                resp.data = new { error = "Exception: " + e.Message };
            }

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("participantes")]
        public async Task<string> GetParticipantes([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string idactividad = data["idactividad"].ToObject<string>();
                string item = data["item"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "3" || ut.Role == "1" || ut.Role == "2") //Solo usuarios Docentes
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetParticipantes(idactividad, item);
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
                resp.data = new { error = "Exception: " + e.Message };
            }

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("evaluacion/comentarios/{id}")]
        public async Task<string> GetEvalComentarios(string id)
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

                if (ut.Role=="3"|| ut.Role == "1" || ut.Role == "2")
                {

                    ds = await b.GetEvalComentarios(id);

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
        [HttpGet("estado")]
        public async Task<string> GetEstadoInstructor()
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

                if (ut.Role == "3")
                {

                   

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data.evalpromedio = await b.GetEvalPromedio(ut);
                    resp.data.actencurso = await b.GetNumActEnCurso(ut);
                    resp.data.actpendaprob = await b.GetNumActPendientesAprob(ut);
                    resp.data.actperiodoact = await b.GetNumActPeriodoActivo(ut);
                    resp.data.departamento = await b.GetDepartamento(ut);
                    resp.data.periodoactivo = await b.GetPeriodoActivo();


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
