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
   
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [Authorize]
        [HttpGet("{dni_admin}")]
        [HttpGet()]
        public async Task<string> Get(string dni_admin = "")
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
                    m.Tablename = "bienes_admin";
                    m.Fieldname = "dni_admin";

                    if (dni_admin != "")
                    {
                        m.Fieldvalue = dni_admin;
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
        [Authorize]
        [HttpPost]
        public async Task<string> Post([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string dni_admin = data["dni_admin"].ToObject<string>();
                string nomb_admin = data["nomb_admin"].ToObject<string>();
                string apel_admin = data["apel_admin"].ToObject<string>();
                string email_admin = data["email_admin"].ToObject<string>();
                string idTipo = data["idTipo"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                

                    //validar que los gestores puedan crear solo instructores o docentes
                    if ((ut.Role =="2" && idTipo == "3") || (ut.Role == "1"))
                    {
                        Main m = new Main();

                        m.Query_IUD = "INSERT INTO bienes_admin (dni_admin,nomb_admin,apel_admin,email_admin,idTipo) VALUES ('" + dni_admin + "','" + nomb_admin + "','" + apel_admin + "','" + email_admin + "','" + idTipo + "')";


                        string r = await m.ExeIUD(m);
                        if (r == "1")
                        {
                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = new DataTable();
                        }
                        else
                        {
                            Bienestar b = new Bienestar();
                            DataSet ds = new DataSet();
                            resp.msg = "OK";
                            resp.cod = "200";
                            ds = await  b.GetAdminDepart(new UserToken { Dni = dni_admin });
                            resp.data = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable(); 
                        }
                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "401";
                        resp.data = new { error = "No tiene permiso para asignar el rol " + idTipo };
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
        [Authorize]
        [HttpPut("{dni_admin}")]
        public async Task<string> Put(string dni_admin, [FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string nomb_admin = data["nomb_admin"].ToObject<string>();
                string apel_admin = data["apel_admin"].ToObject<string>();
                string email_admin = data["email_admin"].ToObject<string>();
                string idTipo = data["idTipo"].ToObject<string>();
                string enabled = data["enabled"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_admin SET nomb_admin = '"+nomb_admin+"',apel_admin = '"+apel_admin+"',email_admin = '"+email_admin+"',idTipo = '"+idTipo+"' WHERE dni_admin = '"+dni_admin+"' AND idTipo = '"+idTipo+"' AND enabled='"+enabled+"'";
                    
                   
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
        //[HttpPost("delete")]
        //public async Task<string> Delete([FromBody] JObject data)
        //{
        //    Respuesta resp = new Respuesta();
        //    resp.data = new ExpandoObject();
        //    Auth a = new Auth();
        //    try
        //    {
        //        string dni_admin = data["dni_admin"].ToObject<string>();
        //        string idTipo = data["idTipo"].ToObject<string>();

        //        string token = Request.Headers["Authorization"].ToString();
        //        UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

        //        if (ut.Role == "1") //Solo usuarios administradores
        //        {

        //            Main m = new Main();
        //            m.Query_IUD = "DELETE FROM bienes_admin WHERE dni_admin = '"+dni_admin+"' AND idTipo = '"+idTipo+"'";

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

        //asignar departamentos

        [Authorize]
        [HttpPost("asignar_depart")]
        public async Task<string> AsignarDepartamentos([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string dni_admin = data["dni_admin"].ToObject<string>();
                string codi_depart = data["codi_depart"].ToObject<string>(); //códigos de departamentos, separados por coma,
               

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {
                    string r = "0";
                    Main m = new Main();

                    m.Query_IUD = "DELETE FROM bienes_admin_departamentos WHERE dni_admin = '"+dni_admin+"'";
                    r = await m.ExeIUD(m);

                    if (codi_depart.Contains(","))
                    {
                        
                        string[] parts = codi_depart.Split(',');
                        foreach (string part in parts)
                        {

                            m.Query_IUD = "INSERT INTO bienes_admin_departamentos (dni_admin, codi_depart) VALUES ('" + dni_admin + "', '" + part + "')";
                            r = await m.ExeIUD(m);
                        }
                    }
                    else 
                    {
                        m.Query_IUD = "INSERT INTO bienes_admin_departamentos (dni_admin, codi_depart) VALUES ('" + dni_admin + "', '" + codi_depart + "')";
                        r = await m.ExeIUD(m);
                    }          
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

        [HttpGet("config/{nomb_conf}")]
        [HttpGet("config")]
        public async Task<string> GetConfig(string nomb_conf = "")
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r = "";
            string json = "";
            try
            {
               
                    Main m = new Main();
                    m.Tablename = "bienes_config";
                    m.Fieldname = "nomb_conf";

                    if (nomb_conf != "")
                    {
                        m.Fieldvalue = nomb_conf;
                    }
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = await m.SelectDyn(m);
               


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
        [Authorize]
        [HttpPost("usuarios")]
        public async Task<string> GetUsuariosAdmin([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string codi_depart = "";
                if (data.ContainsKey("codi_depart"))
                {
                    codi_depart = data["codi_depart"].ToObject<string>();
                }
                string todos = "0";
                if (data.ContainsKey("todos"))
                {
                    todos = data["todos"].ToObject<string>();
                }

                string idtipo = data["idtipo"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo  gestores y administradores
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetUsersRole(idtipo, codi_depart, todos);
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

        [Authorize]
        [HttpPost("instructor/resumen")]
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
                string tipo = "3";
                if (data.ContainsKey("tipo"))
                {
                    tipo = data["tipo"].ToObject<string>();
                }

                               string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo  gestores y administradores
                {
                    string r = "0";
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetAdminDepart(new UserToken { Dni = dni });
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data.departamentos = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
                    resp.data.evalpromedio = await b.GetEvalPromedio(new UserToken { Dni = dni });


                        ds  = await b.GetNumActPeriodo(new UserToken { Dni = dni });
                    resp.data.actperiodo = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();

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

        //UPDATE
        [Authorize]
        [HttpPost("setenable")]
        public async Task<string> UpdateEnabled([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {

                string dni_admin = data["dni_admin"].ToObject<string>();
                string enabled = data["enabled"].ToObject<string>();
                string idtipo = data["idtipo"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "1" || ut.Role == "2") //Solo usuarios administradores
                {

                    Main m = new Main();

                    m.Query_IUD = "UPDATE bienes_admin SET enabled = '" + enabled + "' WHERE dni_admin = '" + dni_admin + "' AND  idTipo = '"+idtipo+"'";


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
