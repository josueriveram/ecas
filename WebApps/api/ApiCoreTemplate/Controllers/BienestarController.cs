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
    public class BienestarController : ControllerBase
    {
        [HttpPost("autoaprobacion")]
        public async Task<string> AutoAprobBienestar([FromBody] JObject data)
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

                    //VALIDAR SI TIENE PERMISO
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetAdminXDni(ut.Dni);
                    if (ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0].Rows[0]["aprueba_bienestar"].ToString() == "1")
                        {

                            string r = "";
                           
                            Main m = new Main();
                            
                            ds = await m.QuerySelect("SELECT dni_part,hacum FROM v_participantes_hacum WHERE hacum >=getHorasAprobacion() AND tieneAprobacionesParticipante(dni_part) IS FALSE");

                            if (ds.Tables[0].Rows.Count > 0)
                            {
                                r = await b.SetAutoAprobacionBienestar(ut);
                                string correo = "";
                                Notify noti = new Notify();
                                DataSet cfg = await b.GetConfig("url_base");
                                string url_base = cfg.Tables[0].Rows[0]["valor_conf"].ToString();
                                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                                {
                                    DataSet prs = await b.GetParticipantexDni(ds.Tables[0].Rows[i]["dni_part"].ToString());
                                    correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                                    await noti.NotificarBasic("notify_estadoact", correo, url_base);

                                }
                            }

                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = r;
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
        [HttpPost("aprobacion")]
        public async Task<string> AprobBienestar([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string dni_part = data["dni_part"].ToObject<string>();
                string id_tapro = data["id_tapro"].ToObject<string>();
                string obser_aproba = data["obser_aproba"].ToObject<string>();

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {
                    string r = "0";
                    DataSet ds = new DataSet();
                    Main m = new Main();
                    //VALIDAR SI TIENE PERMISO
                    Bienestar b = new Bienestar();
                    ds = await b.GetAdminXDniXidTipo(ut.Dni,ut.Role);
                    if (ds.Tables.Count > 0)
                    {
                        if ((bool)ds.Tables[0].Rows[0]["aprueba_bienestar"])
                        {
                            //Validar si ya tiene aprobaciones:
                            ds = await m.QuerySelect("SELECT id_aproba FROM bienes_aprobaciones_participantes WHERE dni_part='" + dni_part + "' AND anulado ='0'");

                            if (ds.Tables[0].Rows.Count <= 0)
                            {
                                // no tiene aprobaciones:
                                r = await m.QueryIUD("INSERT INTO bienes_aprobaciones_participantes (dni_part,id_tapro,obser_aproba,periodo_aproba,id_creador) " +
                                    "VALUES ('" + dni_part + "', '" + id_tapro + "', '" + obser_aproba + "', periodoActivo(),'" + ut.Dni + "')");

                                string correo = "";
                                Notify noti = new Notify();

                                DataSet cfg = await b.GetConfig("url_base");
                                string url_base = cfg.Tables[0].Rows[0]["valor_conf"].ToString();

                                DataSet prs = await b.GetParticipantexDni(dni_part);
                                correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                                await noti.NotificarBasic("notify_estadoact", correo, url_base);



                            }

                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = r;
                        }
                        else
                        {
                            resp.msg = "ERROR";
                            resp.cod = "401";
                            resp.data = new { error = "No tiene permiso para realizar esta acción" };
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
        [HttpPost("anulacion")]
        public async Task<string> AnulaBienestar([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            try
            {
                string dni_part = data["dni_part"].ToObject<string>();
                string id_aproba = data["id_aproba"].ToObject<string>();
                

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Role == "2" || ut.Role == "1") //Solo usuarios gestores y admin
                {

                    //VALIDAR SI TIENE PERMISO
                    Bienestar b = new Bienestar();
                    DataSet ds = new DataSet();
                    ds = await b.GetAdminXDniXidTipo(ut.Dni, ut.Role);
                    if (ds.Tables.Count > 0)
                    {
                        if ((bool)ds.Tables[0].Rows[0]["aprueba_bienestar"])
                        {

                            string r = "0";

                            Main m = new Main();

                            r = await m.QueryIUD("UPDATE bienes_aprobaciones_participantes SET anulado='1' WHERE id_aproba='" + id_aproba + "' AND dni_part='" + dni_part + "'");

                            if (r == "1")
                            {
                                string correo = "";
                                Notify noti = new Notify();
                                
                                DataSet cfg = await b.GetConfig("url_base");
                                string url_base = cfg.Tables[0].Rows[0]["valor_conf"].ToString();

                                DataSet prs = await b.GetParticipantexDni(dni_part);
                                correo = prs.Tables[0].Rows[0]["email_part"].ToString();
                                await noti.NotificarBasic("notify_estadoact", correo, url_base);

                            }

                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = r;
                        }
                        else
                        {
                            resp.msg = "ERROR";
                            resp.cod = "500";
                            resp.data = new { error = "No tiene permisos para esta acción" };
                        }
                    }
                    else
                    {
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = new { error = "Error al consultar usuario admin" };
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

