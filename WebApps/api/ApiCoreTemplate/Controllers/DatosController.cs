using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using ApiBienestar.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Controllers
{
    [Route("api/[controller]")]
    public class DatosController : ControllerBase
    {
        [HttpGet("cualificacion")]
        public async Task<string> GetCualificacion()
        {
            Respuesta resp = new Respuesta();
            resp.data = new ExpandoObject();
            Bienestar b = new Bienestar();
            string r = "";
            string json = "";
            try
            {
                resp.msg = "OK";
                resp.cod = "200";
                resp.data = await b.AprobadosCualificacion();

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
