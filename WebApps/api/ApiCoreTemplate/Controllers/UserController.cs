using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiBienestar.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace ApiBienestar.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        
        [HttpGet("{id}")]
        [HttpGet()]
        public async Task<string> Get(string id = "")
        {
            string json = "";
            Main m = new Main();
            m.Tablename = "users";
            m.Fieldname = "id_user";
            
            if (id != "")
            {
                m.Fieldvalue = id;
            }
            json = await m.Select(m);

            return json;
        }
        // POST api/values
        //INSERT
        [HttpPost]
        public async Task<string> Post([FromBody] JObject data)
        {
            string ret = "";
            string mail_user = data["mail_user"].ToObject<string>();
            string name_user = data["name_user"].ToObject<string>();
            string lastname_user = data["lastname_user"].ToObject<string>();
            string role_id = data["role_id"].ToObject<string>();

            Main m = new Main();

            m.Query_IUD = "INSERT INTO users (mail_user,name_user,lastname_user,role_id) VALUES ('" + mail_user + "','" + name_user + "','" + lastname_user + "', '" + role_id + "')";

            ret = await m.ExeIUD(m);

            return ret;
        }

        // PUT api/values/5
        //UPDATE
        [HttpPut("{id}")]
        public async Task<string> Put(string id, [FromBody] JObject data)
        {
            string ret = "";
            string mail_user = data["mail_user"].ToObject<string>();
            string name_user = data["name_user"].ToObject<string>();
            string lastname_user = data["lastname_user"].ToObject<string>();
            string role_id = data["role_id"].ToObject<string>();

            Main m = new Main();

            m.Query_IUD = "UPDATE users SET mail_user = '" + mail_user + "', name_user = '" + name_user + "', lastname_user='" + lastname_user + "', role_id='" + role_id + "' WHERE id_user = '" + id + "'";

            ret = await m.ExeIUD(m);

            return ret;
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<string> Delete(string id)
        {
            string ret = "";
            Main m = new Main();

            m.Query_IUD = "DELETE FROM users WHERE id_user = '" + id + "'";

            ret = await m.ExeIUD(m);

            return ret;
        }
    }
}