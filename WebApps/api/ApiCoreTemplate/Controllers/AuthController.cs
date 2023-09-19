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
    public class UserData
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //Autenticar usuarios -> CREA TOKEN
        [HttpPost("autenticar")]
        public async Task<IActionResult> Autenticar([FromBody] JObject data)
        {
            string rtn = "";
            try
            {
                DataSet dsrol = new DataSet();
                string correo = data["correo"].ToObject<string>(); //obligatorio
                string confia = data["confia"].ToObject<string>(); //obligatorio
                string admin = "0";
                if (data.ContainsKey("admin"))
                {
                    admin = data["admin"].ToObject<string>();
                }
                
                if (data.ContainsKey("onetoken"))
                {

                    //AUTHENTICATION FOR GOOGLE ONE TAP
                    string onetoken = data["onetoken"].ToObject<string>();

                    //Validar Access Token de Google
                    var client = new RestClient("https://oauth2.googleapis.com/tokeninfo?id_token=" + onetoken + "\"");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.GET);
                    IRestResponse response = client.Execute(request);
                    JObject usuario = JsonConvert.DeserializeObject<JObject>(response.Content);

                    //Validar si el  token  está vigente

                    if (usuario.ContainsKey("email") && (correo.Contains("curn.edu.co") || correo.Contains("curnvirtual.edu.co")))
                    {
                        //Consultar Datos en LDAP Google
                        var client2 = new RestClient("https://axis.curn.edu.co/apildap/api/ldap/account/" + usuario["email"].ToString());
                        client2.Timeout = -1;
                        var request2 = new RestRequest(Method.GET);
                        IRestResponse response2 = client2.Execute(request2);
                        var r = JsonConvert.DeserializeObject(response2.Content);
                        Respuesta resp = new Respuesta();
                        resp = JsonConvert.DeserializeObject<Respuesta>(r.ToString());

                        if (resp.cod == "200")
                        {


                            JObject ent = resp.data.entidad;

                            UserToken ut = new UserToken();
                            ut.Mail = ent["Mail"].ToString();
                            ut.Dni = ent["EmployeeNumber"].ToString();
                            ut.CodProg = ent["CodPrograma"].ToString();
                            ut.NombProg = ent["NombPrograma"].ToString();
                            ut.Type = ent["Branch"].ToString();
                            ut.Codnum = ent["Codnum"].ToString();
                            ut.DisplayName = ent["DisplayName"].ToString();
                            

                            if (!string.IsNullOrEmpty(ut.GetUserType(ut.Type)))
                            {

                                Bienestar b = new Bienestar();
                                bool ct = false;
                                if (admin == "1") //está logueando en ADMIN
                                {
                                    //Validar si es admin
                                    //----------------------------------

                                    dsrol = await b.GetAdmin(ut);

                                    if (data.ContainsKey("role"))
                                    {
                                       string role = data["role"].ToObject<string>();
                                        for (int i=0;i<dsrol.Tables[0].Rows.Count;i++)
                                        {
                                            if (dsrol.Tables[0].Rows[i][0].ToString() == role)
                                            {
                                                ut.Role = dsrol.Tables[0].Rows[i][0].ToString();
                                            }
                                        }
                                    }
                                    else
                                    {

                                        if (dsrol.Tables.Count > 0)
                                        {
                                            if (dsrol.Tables[0].Rows.Count > 1)
                                            {
                                                //No es admin - No crea token
                                                ct = false;
                                            }
                                            else
                                            {
                                                ut.Role = dsrol.Tables[0].Rows[0][0].ToString();

                                            }
                                        }
                                    }

                                    if (!string.IsNullOrEmpty(ut.Role))
                                    {
                                        //Es un admin - Crea token
                                        ct = true;
                                        rtn = "1";
                                        ////VALIDAR SI ESTÁ EN PARTICIPANTES
                                        //DataSet ds = new DataSet();
                                        //ds = await b.GetParticipantexDni(ut.Dni);
                                        //if (ds.Tables[0].Rows.Count > 0)
                                        //{
                                        //    //encontrado
                                        //    rtn = "1";
                                        //}
                                        //else
                                        //{
                                        //    //No encontrado
                                        //    rtn = await b.InsertParticipante(ent);

                                        //}
                                    }
                                    else
                                    {
                                        //No es admin - No crea token
                                        ct = false;
                                    }

                                  



                                }
                                else
                                {
                                    //ESTA LOGUEANDO EN USUARIO
                                    
                                    ct = true;
                                    ut.Role = "";
                                    //es un participante
                                    //No tiene rol admin
                                    //----------------------------------
                                    //Actualizar DNI
                                    
                                    DataSet ds = new DataSet();
                                    if (!(ut.Codnum == "0000" || ut.Codnum == "0" || ut.Codnum == "00000" || ut.Codnum == "000000"))
                                    {

                                        ds = await b.GetParticipantexCodnum(ut.Codnum);

                                        if (ds.Tables[0].Rows.Count > 0)
                                        {
                                            //encoontrado

                                            ut.FirstName = ds.Tables[0].Rows[0]["nomb_part"].ToString();
                                            ut.LastName = ds.Tables[0].Rows[0]["apel_part"].ToString();
                                            ut.RolePart = ds.Tables[0].Rows[0]["role_part"].ToString();


                                            if (ds.Tables[0].Rows[0]["dni_part"].ToString() != ut.Dni || string.IsNullOrEmpty(ds.Tables[0].Rows[0]["email_part"].ToString()))
                                            {
                                                //actualizar
                                                rtn = await b.UpdateParticipante(ent);
                                            }
                                            else
                                            {
                                                rtn = "1";
                                            }

                                        }
                                        else
                                        {
                                            ds = await b.GetParticipantexDni(ut.Dni);
                                            if (ds.Tables[0].Rows.Count > 0)
                                            {
                                                ut.FirstName = ds.Tables[0].Rows[0]["nomb_part"].ToString();
                                                ut.LastName = ds.Tables[0].Rows[0]["apel_part"].ToString();
                                                ut.RolePart = ds.Tables[0].Rows[0]["role_part"].ToString();
                                                //Actualizar codnum en participantes
                                                rtn = await b.UpdateParticipanteCodnum(ut.Dni,ut.Codnum);
                                            }
                                            else
                                            {
                                                //No encontrado
                                                rtn = await b.InsertParticipante(ent);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        ds = await b.GetParticipantexDni(ut.Dni);
                                        if (ds.Tables[0].Rows.Count > 0)
                                        {
                                            ut.FirstName = ds.Tables[0].Rows[0]["nomb_part"].ToString();
                                            ut.LastName = ds.Tables[0].Rows[0]["apel_part"].ToString();
                                            ut.RolePart = ds.Tables[0].Rows[0]["role_part"].ToString();
                                            rtn = "1";
                                        }
                                        else
                                        {
                                            //No encontrado
                                            rtn = await b.InsertParticipante(ent);
                                        }
                                    }
                                }
                                
                                if (ct == true && rtn == "1")
                                {
                                    Auth a = new Auth();
                                    var date = DateTime.Now;
                                    var expireDate = TimeSpan.FromHours(12);
                                    if (confia == "1")
                                    {
                                        expireDate = TimeSpan.FromDays(14);
                                    }
                                    var expireDateTime = date.Add(expireDate);
                                    var token = a.GenerateToken(date, ut, expireDate);

                                    Respuesta rpt = new Respuesta();
                                    rpt.data = new ExpandoObject();

                                    rpt.cod = "200";
                                    rpt.msg = "OK";
                                    rpt.data = ut;
                                    string rname = "";

                                    //DataSet ds = new DataSet();
                                    if (string.IsNullOrEmpty(ut.Role))
                                    {
                                        rname = "";

                                    }
                                    else
                                    {
                                        rname = await b.GetAdminRoleName(ut.Role);
                                        //ds = await b.GetAdminDepart(ut);

                                    }
                                    return Ok(new
                                    {
                                        Token = token,
                                        ExpireAt = expireDateTime,
                                        RoleName = rname,
                                        //RoleDepart = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable(),
                                        rpt
                                    });
                                }
                                else
                                {
                                    if (dsrol.Tables.Count > 0)
                                    {
                                        return Ok(new
                                        {
                                            Roles = dsrol.Tables[0],
                                           
                                        }) ;
                                    }
                                    else
                                    {
                                        return StatusCode(404);
                                    }
                                   
                                }

                            }
                            else
                            {
                                //El usuario no está en ninguna rama valida.
                                return StatusCode(402);
                            }

                        }
                        else
                        {
                            //Error cuenta inconsistente faltan campos en LDAP
                            return StatusCode(409);
                        }

                    }
                    else
                    {
                        //Es una cuenta externa Gmail.com

                        //Verificar que la cuenta esté registrada
                        Bienestar b = new Bienestar();
                        DataSet ds = new DataSet();
                        ds = await b.GetParticipantexEmail(correo);
                        
                        if(ds.Tables.Count > 0)
                        {
                            string dni = "";
                           

                            UserToken ut = new UserToken();
                            ut.Mail = correo;
                            ut.Dni = ds.Tables[0].Rows[0]["dni_part"].ToString();
                            ut.CodProg = "";
                            ut.NombProg = "";
                            ut.Type = "Usuarios externos";
                            ut.Codnum = "";
                            ut.DisplayName = ds.Tables[0].Rows[0]["nomb_part"].ToString() + " " + ds.Tables[0].Rows[0]["apel_part"].ToString();
                            ut.FirstName = ds.Tables[0].Rows[0]["nomb_part"].ToString();
                            ut.LastName = ds.Tables[0].Rows[0]["apel_part"].ToString();
                            ut.RolePart = ds.Tables[0].Rows[0]["role_part"].ToString();
                            ut.Role = "";

                            Auth a = new Auth();
                            var date = DateTime.Now;
                            var expireDate = TimeSpan.FromHours(12);
                            if (confia == "1")
                            {
                                expireDate = TimeSpan.FromDays(14);
                            }
                            var expireDateTime = date.Add(expireDate);
                            var token = a.GenerateToken(date, ut, expireDate);

                            Respuesta rpt = new Respuesta();
                            rpt.data = new ExpandoObject();

                            rpt.cod = "200";
                            rpt.msg = "OK";
                            rpt.data = ut;

                            return Ok(new
                            {
                                Token = token,
                                ExpireAt = expireDateTime,
                                RoleName = "",
                                rpt
                            });


                        }
                        else
                        {
                            return StatusCode(404);
                        }

                    }

                }
                else
                {
                    return StatusCode(404);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }
   
        [Authorize]
        [HttpGet("Verificatoken")]
        public string VerificarToken()
        {
            string json = "";
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            try
            {

               
                Auth a = new Auth();
                string token = Request.Headers["Authorization"].ToString();
                UserToken ut = a.ObtenerDatosToken(token.Substring(7, token.Length - 7));

                if (ut.Dni != null)
                {

                    resp.msg = "OK";
                    resp.cod = "200";
                    resp.data.usertoken = ut;


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