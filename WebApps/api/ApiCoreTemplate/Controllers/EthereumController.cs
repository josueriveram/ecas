using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services;
using ApiBienestar.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nethereum.RPC.Eth.DTOs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ApiBienestar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EthereumController : ControllerBase
    {
        [HttpGet("certificate/{index}")]
        public async Task<string> GetCertificate(string index)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
          
            string r = "";
            string json = "";
            try
            {
                FContractCert fc = new FContractCert();
                
               
                resp.msg = "OK";
                resp.cod = "200";
                resp.data = await fc.GetCertificate(int.Parse(index));



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
        [HttpGet("certificate/revoke/{index}")]
        public async Task<string> RevokeCertificate(string index)
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
                if (ut.Role == "1") //Solo Admin
                {
                    FContractCert fc = new FContractCert();
                    Main m = new Main();

                    resp.msg = "OK";
                    resp.cod = "200";

                    TransactionReceipt t = await fc.RevokeCertificate(int.Parse(index));
                    r = await m.QueryIUD("UPDATE bienes_aprobaciones_certificados SET  active = 'false', eth_transact_revoke='" + t.TransactionHash + "', eth_date_revoke=NOW()  WHERE eth_indexcert='" + index + "'");
                    resp.data = t;
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

        [Authorize]
        [HttpPost("certificate/update")]
        public async Task<string> UpdateCertificate([FromBody] JObject data)
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            string r = "";
            string json = "";
            try
            {
                string id = data["id"].ToObject<string>();
                string description = data["description"].ToObject<string>();
                string file = data["file"].ToObject<string>();
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));
                if (ut.Role == "1") //Solo Admin
                {
                    FContractCert fcert = new FContractCert();
                    TransactionReceipt t = await fcert.SetCertificate(int.Parse(id), file, description);
                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data = t;

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
        [Authorize]
        [HttpPost("certificate/new")]
        public async Task<string> NewCert([FromBody] JObject data)
       {
            string r = "";
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            Bienestar b = new Bienestar();
            FContractCert contractcert = new FContractCert();
            Certificate cert = new Certificate();
            try
            {

                string idaprobacion = data["idaprobacion"].ToObject<string>();
                string ethaddress = "";

                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null) //Usuarios autenticado
                {

                    //Validar si ya tiene emitido un certificado de acuerdo al id de aproabación

                    DataSet ds = new DataSet();
                    ds = await b.GetAprobacionCertificado(idaprobacion);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        //Tiene aprobaciones para certificar
                        //Comprobar los datos

                        if (string.IsNullOrEmpty(ds.Tables[0].Rows[0]["file"].ToString()))
                        {
                            //NO tiene archivo del certificado
                            //Verificar si tiene cuenta
                            if (data.ContainsKey("ethaddress"))
                            {
                                //Tiene dirección de ethereum para emitir el cert en el contrato
                                ethaddress = data["ethaddress"].ToObject<string>();
                                //EXPEDIR y ASEGURAR EL CERTIFICADO
                                //EMITIR EN ETHEREUM =>
                                //--------------------------

                                //GENERAR CERTIFICADO
                                Report rpt = new Report();
                                DataSet dsdc = new DataSet();
                                dsdc = await b.GetDataCertificado(idaprobacion);
                                cert.Active = "true";
                                cert.Description = "{\"activityName\":\"" + dsdc.Tables[0].Rows[0]["nomb_acti"].ToString() + "\",\"hours\":\"" + dsdc.Tables[0].Rows[0]["nhoras"].ToString() + "\",\"dni\":\"" + dsdc.Tables[0].Rows[0]["dni_part"].ToString() + "\",\"emiter\":\"Corporación Universitaria Rafael Núñez\",\"period\":\"" + dsdc.Tables[0].Rows[0]["periodo"].ToString() + "\"}";
                                cert.EthAddress = ethaddress;
                                cert.File = "https://viewcert.curn.edu.co/" + rpt.Base64Encode(idaprobacion);
                                TransactionReceipt t = await contractcert.NewCertificate(ethaddress,cert.File,cert.Description);
                                cert.EthTransact = t.TransactionHash;
                                cert.EthContract = contractcert.GetContract();
                                cert.EthIndexCert = await contractcert.GetLastIndex();
                                cert.EthChain = "Göerli";                          
                                
                                r = await b.UpdateAprobacionCertificado(idaprobacion, cert.File, cert.Description, cert.Active, cert.EthAddress, cert.EthContract, cert.EthTransact, cert.EthChain,cert.EthIndexCert);
                                                               
                                string url = await rpt.GenReport("idaproba", idaprobacion, "/Reports/otros/activaucert.pdf", "D:\\\\files\\\\certs\\\\", "certAU");

                                url = url.Replace("\"", "");
                                url = url.Replace("D:\\\\files\\\\certs\\\\", "https://axis.curn.edu.co/certs/");

                                r = await b.UpdateAprobacionCertificadoURlFile(idaprobacion, url);
                              
                                resp.msg = "OK";
                                resp.cod = "200";
                                resp.data = cert;

                            }
                            else
                            {
                                //EXPEDIR SIN ASEGURAR
                                //---------------------------
                                Report rpt = new Report();
                                DataSet dsdc = new DataSet();
                                dsdc = await b.GetDataCertificado(idaprobacion);
                                cert.Active = "true";
                                cert.Description = "{\"activityName\":\"" + dsdc.Tables[0].Rows[0]["nomb_acti"].ToString() + "\",\"hours\":\"" + dsdc.Tables[0].Rows[0]["nhoras"].ToString() + "\",\"dni\":\"" + dsdc.Tables[0].Rows[0]["dni_part"].ToString() + "\",\"emiter\":\"Corporación Universitaria Rafael Núñez\",\"period\":\"" + dsdc.Tables[0].Rows[0]["periodo"].ToString() + "\"}";
                              
                                cert.File = "https://viewcert.curn.edu.co/" + rpt.Base64Encode(idaprobacion);

                                r = await b.UpdateAprobacionCertificado(idaprobacion, cert.File, cert.Description, cert.Active);
                                
                                string url = await rpt.GenReport("idaproba", idaprobacion, "/Reports/otros/activaucert.pdf", "D:\\\\files\\\\certs\\\\", "certAU");
                                url = url.Replace("\"", "");
                                url = url.Replace("D:\\\\files\\\\certs\\\\", "https://axis.curn.edu.co/certs/");

                                r = await b.UpdateAprobacionCertificadoURlFile(idaprobacion, url);

                                resp.msg = "OK";
                                resp.cod = "200";
                                resp.data = cert;
                            }


                        }
                        else
                        {
                            // tiene certificado generado
                           
                            cert.File = ds.Tables[0].Rows[0]["file"].ToString();
                            cert.Description = ds.Tables[0].Rows[0]["description"].ToString();
                            cert.Active = ds.Tables[0].Rows[0]["active"].ToString();
                            cert.MarcUpdate = ds.Tables[0].Rows[0]["marc_update"].ToString();

                            //Comprobar que esté en la Ethereum
                            if (string.IsNullOrEmpty(ds.Tables[0].Rows[0]["eth_date"].ToString()))
                            {
                                //No tiene el certificado registrado en el contrato
                                //Verificar si tiene cuenta
                                if (data.ContainsKey("ethaddress"))
                                {
                                    //Tiene dirección de ethereum para emitir el cert en el contrato
                              
                                    ethaddress = data["ethaddress"].ToObject<string>();

                                    //REEXPEDIR (ASEGURAR) EL CERTIFICADO

                                    //EMITIR EN ETHEREUM =>


                                    Report rpt = new Report();
                                    DataSet dsdc = new DataSet();
                                    dsdc = await b.GetAprobacionCertificado(idaprobacion);
                                    cert.Active = "true";
                                    cert.Description = dsdc.Tables[0].Rows[0]["description"].ToString();
                                    cert.EthAddress = ethaddress;
                                    cert.File = dsdc.Tables[0].Rows[0]["file"].ToString();
                                    TransactionReceipt t = await contractcert.NewCertificate(ethaddress, cert.File, cert.Description);
                                    cert.EthTransact = t.TransactionHash;
                                    cert.EthContract = contractcert.GetContract();
                                    cert.EthIndexCert = await contractcert.GetLastIndex();
                                    cert.EthChain = "Göerli";

                                    r = await b.UpdateAprobacionCertificado(idaprobacion, cert.File, cert.Description, cert.Active, cert.EthAddress, cert.EthContract, cert.EthTransact, cert.EthChain, cert.EthIndexCert);

                                    string url = await rpt.GenReport("idaproba", idaprobacion, "/Reports/otros/activaucert.pdf", "D:\\\\files\\\\certs\\\\", "certAU");

                                    url = url.Replace("\"", "");
                                    url = url.Replace("D:\\\\files\\\\certs\\\\", "https://axis.curn.edu.co/certs/");

                                    r = await b.UpdateAprobacionCertificadoURlFile(idaprobacion, url);



                                    resp.msg = "OK";
                                    resp.cod = "200";
                                    resp.data = cert;

                                }
                                else
                                {
                                    //No tiene cuenta de Ethereum
                                    //Devolver la URL del certificado emitido 
                                    resp.msg = "OK";
                                    resp.cod = "200";
                                    resp.data = cert;
                                }

                            }
                            else
                            {
                                cert.EthAddress = ds.Tables[0].Rows[0]["eth_address"].ToString();
                                cert.EthContract = ds.Tables[0].Rows[0]["eth_contract"].ToString();
                                cert.EthChain = ds.Tables[0].Rows[0]["eth_network"].ToString();
                                cert.EthTransact = ds.Tables[0].Rows[0]["eth_transact"].ToString();
                                cert.EthDate = ds.Tables[0].Rows[0]["eth_date"].ToString();

                                //Tiene certificado y lo tiene registrado en el contrato ethereum
                                resp.msg = "OK";
                                resp.cod = "200";
                                resp.data = cert;
                            }

                        }

                       


                    }
                    else
                    {
                        //No tiene aprobaciones para certificar
                        resp.msg = "ERROR";
                        resp.cod = "500";
                        resp.data = new { error = "No se puede certificar la actividad" };
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

        //End Point para actualizar transacciones en base de datos y registrar operaciones en el smart contract
        [Authorize]
        [HttpPost("point/new")]
        public async Task<string> NewOperation([FromBody] JObject data)
        {
            string r = "";
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Auth a = new Auth();
            Bienestar b = new Bienestar();
            FContractPoint point = new FContractPoint();
            try
            {
                string dni_part = data["dni_part"].ToObject<string>();
                string idtransact = data["idtransact"].ToObject<string>();
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));
                if (ut.Role == "1") //Solo Admin
                {
                    //Consultar si tiene address ethereum
                    string addr = await b.GetParticipanteAddressxDni(dni_part);
                    if (!string.IsNullOrEmpty(addr))
                    {
                        //Tiene Address
                        //Verificar si tiene transacciones anteriores aprobadas sin registro en el contrato
                        int saldo = await b.GetSaldoSinAddress(dni_part);
                        if (saldo > 0)
                        {
                            //Tiene saldos que se deben registrar en el contrato
                            //Se debe crear una operacion para pasar el saldo al contrato

                            //ADD OPERATION - CONTRACT SALDO
                            BigInteger bisaldo = new BigInteger(saldo);
                           string t = await point.NewOperation(addr, "+", "Trasalado de saldo", bisaldo);

                            //update transacts
                            r= await b.UpdateTransactSinAddress(dni_part, t);

                            //------------------------
                            //Consultar Datos de la transacción
                            DataSet dtr = await b.GetTransaccionData(idtransact);
                            saldo = 0;
                            saldo = int.Parse(dtr.Tables[0].Rows[0][1].ToString());
                            BigInteger saldobi = new BigInteger(saldo);
                            string desc = dtr.Tables[0].Rows[0][0].ToString();
                            //ADD OPERATION - CONTRACT
                            if (saldo > 0)
                            {
                                t = await point.NewOperation(addr, "+", desc, saldobi);
                            }
                            else
                            {
                                t = await point.NewOperation(addr, "-", desc, saldobi);
                            }
                            //update transact
                            r= await b.UpdateTransact(idtransact, t);
                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = t;
                        }
                        else
                        {
                            //No tiene saldos
                            //------------------------
                            //Consultar Datos de la transacción
                            string t = "";
                            DataSet dtr = await b.GetTransaccionData(idtransact);
                            saldo = 0;
                            saldo = int.Parse(dtr.Tables[0].Rows[0][1].ToString());
                            BigInteger saldobi = new BigInteger(saldo);
                            string desc = dtr.Tables[0].Rows[0][0].ToString();
                            //ADD OPERATION - CONTRACT
                            if (saldo > 0)
                            {
                                t = await point.NewOperation(addr, "+", desc, saldobi);
                            }
                            else
                            {
                                t = await point.NewOperation(addr, "-", desc, saldobi);
                            }
                            //update transact
                            r = await b.UpdateTransact(idtransact, t);
                            resp.msg = "OK";
                            resp.cod = "200";
                            resp.data = t;
                        }


                    }
                    else
                    {
                        //No tiene Address
                        //update transact
                        r = await b.UpdateTransact(idtransact);
                        resp.msg = "OK";
                        resp.cod = "200";
                        resp.data = r;
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
