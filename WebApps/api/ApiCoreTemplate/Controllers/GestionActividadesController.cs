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
    public class GestionActividadesController : ControllerBase
    {
        [HttpPost()]
        public async Task<string> Actividades([FromBody] JObject data)
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
                    string periodo= data["periodo"].ToObject<string>();
                    string docente = data["docente"].ToObject<string>();
                    string nombre = data["nombre"].ToObject<string>();
                    string categoria = data["categoria"].ToObject<string>();
                    string indice = data["indice"].ToObject<string>();

                    string dnidoc = "";
                    if (data.ContainsKey("dnidoc"))
                    {
                        dnidoc= data["dnidoc"].ToObject<string>();
                    }

                    ds = await b.GetActividadesGestorAdmin(ut, periodo, docente, nombre, categoria, indice,dnidoc);

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
        [HttpGet("consulta/{idactividad}")]
        public async Task<string> GetActividad(string idactividad)
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
                    ds = await b.GetActividades(ut,idactividad);

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
        [HttpPost("registro")]
        public async Task<string> InsertActividad([FromBody] Actividad data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));
                
                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    string r = "";

                    data.IdCreador = ut.Dni;
                    data.Descripcion = data.Descripcion.Replace("'", "");
                    data.Nomb_activ = data.Nomb_activ.Replace("'", "");

                    r = await b.InsertActividad(data);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data =  r;

                  

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
        [HttpPost("registro/update")]
        public async Task<string> UpdateActividad([FromBody] Actividad data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    data.IdCreador = ut.Dni;
                    string r = "";
                    Bienestar b = new Bienestar();
                    data.Descripcion = data.Descripcion.Replace("'", "");
                    data.Nomb_activ = data.Nomb_activ.Replace("'", "");
                    r = await b.UpdateActividad(data);
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

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("registro/update/programas")]
        public async Task<string> UpdateActividadProg([FromBody] Actividad data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    data.IdCreador = ut.Dni;
                    string r = "";
                    Bienestar b = new Bienestar();

                    r = await b.UpdateActividadProgramas(data);
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

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("registro/update/roles")]
        public async Task<string> UpdateActividadRole([FromBody] Actividad data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    data.IdCreador = ut.Dni;
                    string r = "";
                    Bienestar b = new Bienestar();

                    r = await b.UpdateActividadRoles(data);
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

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpPost("registro/delete")]
        public async Task<string> DeleteActividad([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string idactividad = data["idactividad"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    string r = "";
                    Bienestar b = new Bienestar();

                    r = await b.DeleteActividad(idactividad);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = r;

                    ////Notificar
                    //Notify noti = new Notify();
                    //string correo = "";

                    //correo = await b.GetEmailAdmin(data.DniDocente);
                    //    if (correo != "")
                    //    {
                    //        await noti.NotificarBasicActividad("notify_programa", correo, r);
                    //    }

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
        [HttpPost("registro/sesiones")]
        public async Task<string> Insertsesiones([FromBody] Sesion[] data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    string r = "";
                    Bienestar b = new Bienestar();

                    //Comprobar si el array es del mismo tamaño que las sesiones
                    int larray = await b.GetSesiones(data[0].IdAct);
                    if (data.Length == larray)
                    {
                        string dnidoc = await b.GetDocenteActividad(data[0].IdAct);
                        string ndocente =  await b.GetNameAdminSesion(dnidoc);
                        int it = await b.GetMaxItem(data[0].IdAct);
                        for (int i=0; i< data.Length; i++) 
                        {
                            data[i].IdCreador = ut.Dni;
                            data[i].Item = (it + (i + 1)).ToString();
                            
                            if (data[i].Expositores != "")
                            {
                                data[i].Expositores = ndocente + ", " + data[i].Expositores.Replace("'","");
                            }
                            else
                            {
                                data[i].Expositores = ndocente;
                            }

                            data[i].Lugar = data[i].Lugar.Replace("'", "");
                        }
                        

                        r = await b.InsertSesiones(data);
                        if (r=="1")
                        {
                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = r;
                            //Notificar
                            Notify noti = new Notify();
                            string correo = "";

                            correo = await b.GetEmailAdmin(dnidoc);
                            if (correo != "")
                            {
                                correo = correo + "," + ut.Mail;
                                await noti.NotificarActividad("notify_programa", correo, data[0].IdAct);
                               
                            }
                        }


                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = new { error = "El tamaño del array es diferente al número de sesiones "};
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
        [HttpPost("registro/sesiones/insert")]
        public async Task<string> Insertsesion([FromBody] Sesion data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    string r = "";
                    Bienestar b = new Bienestar();

                    string dnidoc = await b.GetDocenteActividad(data.IdAct);
                    string ndocente = await b.GetNameAdminSesion(dnidoc);
                    int it = await b.GetMaxItem(data.IdAct);

                    data.IdCreador = ut.Dni;
                    data.Item = (it + 1).ToString();

                    if (data.Expositores != "")
                    {
                        data.Expositores = ndocente + ", " + data.Expositores.Replace("'","");
                    }
                    else
                    {
                        data.Expositores = ndocente;
                    }

                    data.Lugar = data.Lugar.Replace("'", "");


                    r = await b.InsertSesion(data);

                    if (r== "1")
                    {
                        //verificar si tiene participantes
                        if (await b.GetInscritos(data.IdAct) > 0)
                        {
                            //Tiene personas inscritas, se debe agregar la sesión a cada una de las personas
                            //consultar inscritos
                            DataSet ds = new DataSet();
                            ds = await b.GetParticipantesDNI(data.IdAct);
                            for (int j = 0; j < ds.Tables[0].Rows.Count; j++)
                            {
                                r = await b.InsertInscripcionItem(data.IdAct, data.Item,ds.Tables[0].Rows[j]["id_participante"].ToString());
                            }

                        }
                        else
                        {
                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = r;
                        }

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
        [HttpPost("registro/sesiones/update")]
        public async Task<string> Updatesesion([FromBody] Sesion data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    string r = "";
                    Bienestar b = new Bienestar();

                    string dnidoc = await b.GetDocenteActividad(data.IdAct);
                    string ndocente = await b.GetNameAdminSesion(dnidoc);
                    int it = await b.GetMaxItem(data.IdAct);

                    data.IdCreador = ut.Dni;
                   

                    if (data.Expositores != "")
                    {
                        data.Expositores = ndocente + ", " + data.Expositores;
                    }
                    else
                    {
                        data.Expositores = ndocente;
                    }

                    data.Lugar.Replace("'", "");


                    DataSet ds = await b.UpdateSesion(data);

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
        [HttpPost("registro/sesiones/delete")]
        public async Task<string> Deletesesion([FromBody] JObject data)
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

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    string r = "";
                    Bienestar b = new Bienestar();



                    r = await b.DeleteSesion(idactividad, item);

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

            string json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        //---------------------------------------------------------------------------------------------------
        //Consulta los datos del home para el gestor de actividades        
        [HttpGet("estado")]
        public async Task<string> GetEstado()
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

                if (ut.Role == "2") 
                {



                    resp.msg = "OK";
                    resp.cod = "200";
                    string dept = await b.GetDepartamentoCSV(ut);
                    resp.data.actencurso = await b.GetNumActEnCursoXDepart(dept);
                    resp.data.actpendaprob = await b.GetNumActPendientesAprobXDepart(dept);
                    resp.data.actperiodoact = await b.GetNumActPeriodoActivoXDepart(dept);
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
