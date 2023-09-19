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
    public class ActividadesController : ControllerBase
    {
        
        //Obtiene  la oferta completa  de actividades disponibles para inscribirse
        [HttpGet("oferta")]
        public async Task<string> Oferta()
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

                if (ut.Dni != null)
                {
                    
                        ds = await b.GetOferta(ut);
                       
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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        [HttpGet("oferta/{id}")]
        public async Task<string> Ofertadetalle(string id)
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

                if (ut.Dni != null)
                {

                    ds = await b.GetOfertaDetalle(id);

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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        //Obtiene el historial de actividades del usuario
        [HttpGet("historial")]
        public async Task<string> Historial()
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
                string periodo = "";
                if (ut.Dni != null)
                {
                    if (Request.Headers.ContainsKey("periodo"))
                    {
                         periodo = Request.Headers["periodo"].ToString();
                         ds = await b.GetHistorial(ut, periodo);
                    }
                    else
                    {
                         ds = await b.GetHistorial(ut);
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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("historial/{id}")]
        public async Task<string> HistorialDetalle(string id)
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

                    ds = await b.GetHistorialDetalle(ut, id, "");

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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("historial/{id}/{item}")]
        public async Task<string> HistorialDetalleitem(string id, string item)
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

                    ds = await b.GetHistorialDetalle(ut, id, item);

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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        //Obtiene las actividades en curso 
        [HttpGet()]
        public async Task<string> Actividadesencurso()
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

                    ds = await b.GetActividadesencurso(ut);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data= ds.Tables[0];


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
        [HttpGet("{id}")]
        public async Task<string> ActividadesencursoDetalle(string id)
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

                    ds = await b.GetHistorialDetalle(ut, id, "");

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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        
        //Inscribirse a una actividad de la oferta
        [HttpPost("inscribir")]
        public async Task<string> Inscribir([FromBody] JObject data)
        {

            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string r = "";
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string idactividad = data["idactividad"].ToObject<string>();
                
               


                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    //Validar si hay cupos disponbles
                    if (await b.TieneCuposDisponibles(idactividad) > 0)
                    {
                        r = await b.InsertInscripcion(idactividad, ut);

                        resp.msg = "OK";
                        resp.cod = "200";
                        resp.data = r;


                        //Notificar
                        Notify noti = new Notify();
                        await noti.NotificarActividad("notify_inscribe", ut.Mail, idactividad);

                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "200";
                        resp.data = new { error = "No hay cupos disponibles" };
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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }




        //Inscribirse con QR
        [HttpPost("inscribirxqr")]
        public async Task<string> InscribirXqr([FromBody] Asistencia adata)
        {

            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string r = "";
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
               



                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    //Validar si hay cupos disponbles
                    if (await b.TieneCuposDisponibles(adata.IdAct) > 0 && await b.EsAprobableXqr(adata.IdAct, adata.Item) > 0)
                    {

                        r = await b.InsertInscripcion(adata.IdAct, ut);




                        //string r = "0";
                        //Bienestar b = new Bienestar();
                        string docente = await b.GetDocenteActividad(adata.IdAct);
                        adata.DniPart = ut.Dni;
                        Asistencia asist;
                        asist = await b.SetAsistenciaXqr(adata, docente);

                        resp.msg = "OK";
                        resp.cod = "200";
                        resp.data = asist;

                        //Notificar
                        Notify noti = new Notify();
                        string correo = "";
                       
                            DataSet prs = await b.GetParticipantexDni(asist.DniPart);
                            correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                            await noti.NotificarBasicActividad("notify_registroqr", correo, asist.IdAct, asist.Item);
                      




                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "200";
                        resp.data = new { error = "No se puede registar la asistencia" };
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
                    asist = await b.SetAsistencia(data, ut);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = asist;

                    //Notificar
                    Notify noti = new Notify();
                    string correo = "";
                    for (int i = 0; i < asist.Length; i++)
                    {
                        DataSet prs = await b.GetParticipantexDni(asist[i].DniPart);
                        correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                        await noti.NotificarBasicActividad("notify_estadoact", correo, asist[i].IdAct, asist[i].Item);
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



        //Cancela una inscripción a una actividad
        [HttpPost("cancelar")]
        public async Task<string> Cancelar([FromBody] JObject data)
        {

            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string r = "";
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string idactividad = data["idactividad"].ToObject<string>();
               


                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    r = await b.CancelarInscripcion(idactividad,ut);

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = r;
                    //Notificar
                    Notify noti = new Notify();
                    await noti.NotificarActividad("notify_cancela", ut.Mail, idactividad);


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

            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("evaluar")]
        public async Task<string> Evaluar([FromBody] JObject data)
        {

            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string r = "";
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            string json = "";
            try
            {
                string idactividad = data["idactividad"].ToObject<string>();
                string puntaje = data["puntaje"].ToObject<string>();
                string comentario = data["comentario"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    r = await b.EvaluarActividad(idactividad, comentario, puntaje, ut);

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

            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("estado")]
        public async Task<string> GetEstadoGeneral()
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string json = "";
            int s = 0;
            Bienestar b = new Bienestar();
            Auth a = new Auth();
            try
            {
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data.aprobien = await b.GetAprobacionBienesParticipante(ut.Dni);
                    resp.data.totalhoras = await b.GetHorasAcumuladas(ut.Dni);
                    s= await b.GetPuntos(ut.Dni);
                    resp.data.puntosacum = s;
                    resp.data.lealtad = await b.GetLealtad(s.ToString());
                    resp.data.address = await b.GetParticipanteAddressxDni(ut.Dni);


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



        //-----------------------------------------------------------------------------------
        //Endpoints de gestión (gestor y admin)
        //Obtiene el historial de actividades del usuario
        [HttpGet("participante/historial/{dni}")]
        public async Task<string> HistorialParticipante(string dni)
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
                string periodo = "";

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    if (Request.Headers.ContainsKey("periodo"))
                    {
                        periodo = Request.Headers["periodo"].ToString();
                        ds = await b.GetHistorial(new UserToken { Dni = dni }, periodo); ;
                    }
                    else
                    {
                        ds = await b.GetHistorial(new UserToken { Dni = dni });
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
        [HttpGet("participante/historial/{dni}/{id}")]
        public async Task<string> HistorialParticipanteDetalle(string dni, string id="0")
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    ds = await b.GetHistorialDetalle(new UserToken { Dni = dni }, id, "");

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
        [HttpGet("participante/historial/{dni}/{id}/{item}")]
        public async Task<string> HistorialDetalleitem(string dni, string id="0", string item="0")
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    ds = await b.GetHistorialDetalle(new UserToken { Dni= dni }, id, item);

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

        //Obtiene las actividades en curso 
        [HttpGet("participante/{dni}")]
        public async Task<string> ActividadesencursoParticipante(string dni)
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    ds = await b.GetActividadesencurso(new UserToken { Dni=dni });

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
                resp.data = new { error = e.Message };
            }
            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("participante/{dni}/{id}")]
        public async Task<string> ActividadesencursoDetalleParticipante(string  dni, string id="0")
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    ds = await b.GetHistorialDetalle(new UserToken { Dni=dni }, id, "");

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data =ds.Tables.Count > 0 ? ds.Tables[0]: new DataTable();


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
