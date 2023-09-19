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
    public class CertificateController : ControllerBase
    {
        [HttpGet("djson/{index}")]
        public async Task<string> GetDataCertificate(string index)
        {
            Certificate cert = new Certificate();
            string r = "";
            string json = "";
            try
            {
                Bienestar b = new Bienestar();
                DataSet ds = new DataSet();
                Report rp = new Report();
                ds = await b.GetAprobacionCertificado(index);
                cert.Active = ds.Tables[0].Rows[0]["active"].ToString();
                cert.IdAprobEncode = rp.Base64Encode(index);
                cert.File = ds.Tables[0].Rows[0]["file"].ToString();
                cert.Description = ds.Tables[0].Rows[0]["description"].ToString();
               
                cert.EthAddress = ds.Tables[0].Rows[0]["eth_address"].ToString();
                cert.EthContract = ds.Tables[0].Rows[0]["eth_contract"].ToString();
                cert.EthTransact = ds.Tables[0].Rows[0]["eth_transact"].ToString();
                cert.EthChain = ds.Tables[0].Rows[0]["eth_network"].ToString();
                cert.EthDate = ds.Tables[0].Rows[0]["eth_date"].ToString();
                cert.EthTransactRevoke = ds.Tables[0].Rows[0]["eth_transact_revoke"].ToString();
                cert.EthDateRevoke = ds.Tables[0].Rows[0]["eth_date_revoke"].ToString();
                cert.EthIndexCert = ds.Tables[0].Rows[0]["eth_indexcert"].ToString();
                ds.Clear();

                ds = await b.GetDataCertificado(index);
                cert.IdAprob = ds.Tables[0].Rows[0]["idaprob"].ToString();
                cert.MarcUpdate = ds.Tables[0].Rows[0]["fecha"].ToString();
                cert.ActivityName = ds.Tables[0].Rows[0]["nomb_acti"].ToString();
                cert.CertificateTo = ds.Tables[0].Rows[0]["participante"].ToString();
                cert.Department = ds.Tables[0].Rows[0]["dpto"].ToString();
                cert.TotalHours = ds.Tables[0].Rows[0]["nhoras"].ToString();
                cert.DNI= ds.Tables[0].Rows[0]["dni_part"].ToString();
                cert.Period= ds.Tables[0].Rows[0]["periodo"].ToString();
                cert.IdActivity = ds.Tables[0].Rows[0]["id"].ToString();
                cert.Emailto = ds.Tables[0].Rows[0]["correo"].ToString();

            }
            catch (Exception e)
            {
               
            }

            json = JsonConvert.SerializeObject(cert, Newtonsoft.Json.Formatting.None);
            return json;
        }
        [HttpGet("view/{indexEncode}")]
        public async Task<string> GetViewCertificate(string indexEncode)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            string result = "";
            string json = "";
            try
            {
                Main m = new Main();
                Report rp = new Report();
                string indexDecode = rp.Base64Decode(indexEncode);
                DataSet ds = await m.QuerySelect("SELECT url_file, active FROM bienes_aprobaciones_certificados WHERE id_aproba='"+indexDecode+"'");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    if (ds.Tables[0].Rows[0]["active"].ToString() == "true")
                    {
                        result = ds.Tables[0].Rows[0][0].ToString();
                        resp.msg = "OK";
                        resp.cod = "200";
                        resp.data = result;
                    }
                    else
                    {
                        result = "Certificate revoke";
                        resp.msg = "OK";
                        resp.cod = "200";
                        resp.data = result;
                    }
                }
                else
                {
                    result = "Certificate not found";
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = result;
                }

            }
            catch (Exception e)
            {
                resp.msg = "ERROR";
                resp.cod = "500";
                resp.data = new { error = e };
            }

            json = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None);
            return json;
        }

        [Authorize]
        [HttpPost("revoke")]
        public async Task<string> RevokeCertificate([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r = "";
            string json = "";
            try
            {
                string id = data["id_aproba"].ToObject<string>();
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));
                string tipo = ut.GetUserType(ut.Type);
                Bienestar b = new Bienestar();
                if (tipo == "3" || tipo == "4" || tipo == "6" || tipo == "7")
                {
                    //Validar que el certificado a revocar sea del usuario.
                    if (ut.Dni == await b.ValingAprobacion(id))
                    {


                        resp.msg = "OK";
                        resp.cod = "200";

                        Main m = new Main();
                        r = await m.QueryIUD("UPDATE bienes_aprobaciones_certificados SET emitido = '0', active = NULL, file = NULL, description = NULL, url_file=NULL  WHERE id_aproba='" + id + "'");
                        resp.data = r;
                    }
                    else
                    {
                        
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = "Abrobación no encontrada";
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

    }
}
