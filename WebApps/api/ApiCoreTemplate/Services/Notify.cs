using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Services
{
    public class Notify
    {
        public async Task NotificarInscripcion(string correo, string asunto, string mensaje)
        {
            var client = new RestClient("https://axis.curn.edu.co/apinotify/api/notifymail/notificabasica");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json", "{\r\n\t\"correo\": \"" + correo + "\",\r\n\t\"asunto\": \"" + asunto + "\",\r\n    \"mensaje\": \"" + mensaje + "\"\r\n}", ParameterType.RequestBody);
            IRestResponse response = await client.ExecuteAsync(request);

        }
        public async Task NotificarInscripcionEvent(string correo, string asunto, string mensaje, string nombinvitado, string nombevento, string fechainicio, string nomblugar, string direccion, string numreserva, string fechmodif, string nomborg = "CURN", string urlmodif = "https://portal.curn.edu.co", string ciudad = "Cartagena", string dpto = "Bolivar", string codigopostal = "130001", string imagenorganiza= "https://www.curn.edu.co/images/logo.png")
        {
            var client = new RestClient("https://axis.curn.edu.co/apinotify/api/notifymail/notificamarkupevent");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json", "{\r\n\t\"correo\": \""+correo+"\",\r\n\t\"asunto\": \""+asunto+"\",\r\n    \"mensaje\": \""+mensaje+"\",\r\n    \"numreserv\": \""+numreserva+"\",\r\n    \"fechamodif\": \""+fechmodif+"\",\r\n    \"urlmodif\": \""+urlmodif+"\",\r\n    \"nombinvitado\": \""+nombinvitado+"\",\r\n    \"nombevento\": \""+nombevento+"\",\r\n    \"nomborganiza\": \""+nomborg+"\",\r\n    \"imagenorganiza\": \""+imagenorganiza+"\",\r\n    \"fechainicio\": \""+fechainicio+"\",\r\n    \"nomblugar\": \""+nomblugar+"\",\r\n    \"direccion\": \""+direccion+"\",\r\n    \"ciudad\": \""+ciudad+"\",\r\n    \"dpto\": \""+dpto+"\",\r\n    \"codigopostal\": \""+codigopostal+"\"\r\n}", ParameterType.RequestBody);
            IRestResponse response = await client.ExecuteAsync(request);

        }
        public async Task<string> GetHTMLActividad(string idactividad, string mensaje)
        {
            string ret = "";
            Bienestar b = new Bienestar();
            DataSet ds = new DataSet();
            DataSet dsd = new DataSet();
            ds = await b.GetDatosActividad(idactividad);
            dsd = await b.GetDatosDetallesActividad(idactividad);
            ret = mensaje +"<br/></br>";
            ret = ret + "<b>Nombre de la actividad:</b> " + ds.Tables[0].Rows[0]["nomb_acti"].ToString() + "<br/>";
            ret = ret + "<b>Descripción:</b> " + ds.Tables[0].Rows[0]["descripcion"].ToString() + "<br/>";
            ret = ret + "<b>Categoría:</b> " + ds.Tables[0].Rows[0]["categoria"].ToString() + "<br/>";
            ret = ret + "<b>Departamento:</b> " + ds.Tables[0].Rows[0]["depart"].ToString() + "<br/>";
            ret = ret + "<b>Inicio de la actividad:</b> " + ds.Tables[0].Rows[0]["hinicio"].ToString() + "<br/>";
            ret = ret + "<b>Fin de la actividad:</b> " + ds.Tables[0].Rows[0]["hfin"].ToString() + "<br/><br/>";
            //ret = ret + "<b>Sesiones</b><br/>";
            for (int i = 0; i < dsd.Tables[0].Rows.Count; i++)
            {
                ret = ret + "<b>Sesión " + (i + 1).ToString() + ":</b><br/> " + dsd.Tables[0].Rows[i]["hfecha"].ToString() + " | " + dsd.Tables[0].Rows[i]["hora_ini"].ToString() + " a " + dsd.Tables[0].Rows[i]["hora_fin"].ToString() + " | " + dsd.Tables[0].Rows[i]["expositores"].ToString() + " - SESIÓN "+ dsd.Tables[0].Rows[i]["tipo_sesion"].ToString() + " " + dsd.Tables[0].Rows[i]["lugar_sesion"].ToString() + " " + dsd.Tables[0].Rows[i]["enlace_url"].ToString() +  "<br/><br/>";


            }


            return ret;
        }
        public async Task NotificarActividad(string nconfig, string correo,string idactividad)
        {
            //Notificar
            Bienestar b = new Bienestar();
            DataSet ds = new DataSet();
            ds = await b.GetConfig(nconfig);
            if (ds.Tables[0].Rows.Count > 0)
            {
                //var c = JsonConvert.DeserializeObject(ds.Tables[0].Rows[0][1].ToString());
                JObject conf = JsonConvert.DeserializeObject<JObject>(ds.Tables[0].Rows[0][1].ToString());
                if (conf["estado"].ToString() == "1")
                {
                    //Notificación activada
                    Notify noti = new Notify();
                    string msg = "";
                    msg = await noti.GetHTMLActividad(idactividad, conf["mensaje"].ToString());
                    if (!string.IsNullOrEmpty(msg))
                    {
                        ds = await b.GetDatosActividad(idactividad);
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            await noti.NotificarInscripcion(correo, conf["asunto"].ToString() + ds.Tables[0].Rows[0]["nomb_acti"].ToString(), msg);
                        }
                    }

                }
            }

        }

        public async Task NotificarBasicActividad(string nconfig, string correo, string idactividad, string item="", string  urlbase="")
        {
            //Notificar
            Bienestar b = new Bienestar();
            DataSet ds = new DataSet();
            ds = await b.GetConfig(nconfig);
            if (ds.Tables[0].Rows.Count > 0)
            {
                JObject conf = JsonConvert.DeserializeObject<JObject>(ds.Tables[0].Rows[0][1].ToString());
                if (conf["estado"].ToString() == "1")
                {
                    //Notificación activada
                    Notify noti = new Notify();
                    string msg = "";
                    string asunto = "";
                    msg = conf["mensaje"].ToString();
                    if (!string.IsNullOrEmpty(msg))
                    {
                        ds = await b.GetDatosActividad(idactividad);
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            msg = msg.Replace("#SESION#", item);
                            msg = msg.Replace("#ACTIVIDAD#", ds.Tables[0].Rows[0]["nomb_acti"].ToString());
                            msg = msg.Replace("#URLBASE#", urlbase);
                            asunto = conf["asunto"].ToString();
                            asunto = asunto.Replace("#ACTIVIDAD#", ds.Tables[0].Rows[0]["nomb_acti"].ToString());
                            await noti.NotificarInscripcion(correo, asunto , msg);
                        }
                    }

                }
            }

        }
        public async Task NotificarBasic(string nconfig, string correo, string urlbase = "")
        {
            //Notificar
            Bienestar b = new Bienestar();
            DataSet ds = new DataSet();
            ds = await b.GetConfig(nconfig);
            if (ds.Tables[0].Rows.Count > 0)
            {
                JObject conf = JsonConvert.DeserializeObject<JObject>(ds.Tables[0].Rows[0][1].ToString());
                if (conf["estado"].ToString() == "1")
                {
                    //Notificación activada
                    Notify noti = new Notify();
                    string msg = "";
                    string asunto = "";
                    msg = conf["mensaje"].ToString();
                    if (!string.IsNullOrEmpty(msg))
                    {
                       
                            msg = msg.Replace("#URLBASE#", urlbase);
                            asunto = conf["asunto"].ToString();
                            await noti.NotificarInscripcion(correo, asunto, msg);
                        
                    }

                }
            }

        }
    }

}