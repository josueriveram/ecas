using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Models
{
    public class Main
    {
        private string tablename = "";
        private string fieldname = "";
        private string fieldvalue = "";
        private string query_IUD = "";

        public string Tablename { get => tablename; set => tablename = value; }
        public string Fieldname { get => fieldname; set => fieldname = value; }
        public string Fieldvalue { get => fieldvalue; set => fieldvalue = value; }
        public string Query_IUD { get => query_IUD; set => query_IUD = value; }

        public async Task<string> ExeIUD(Main m)
        {
            //Insert
            string ret = "";

            if (m.Query_IUD != "")
            {
                ret = await QueryIUD(m.Query_IUD);
            }
            return ret;
        }

        public async Task<string> Select(Main m)
        {
            //Select
            string q = "";
            string json = "";

            if (!string.IsNullOrEmpty(m.Tablename))
            {

                if (!string.IsNullOrEmpty(m.Fieldvalue))
                {
                    q = "SELECT * FROM " + m.Tablename + " WHERE " + m.Fieldname + "='" + m.Fieldvalue + "'";
                }
                else
                {
                    q = "SELECT * FROM " + m.Tablename;
                }
            }
            else
            {
                q = m.Query_IUD;

            }

            DataSet ds = await QuerySelect(q);

            json = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            dynamic jsonObj = JsonConvert.DeserializeObject(json);
            jsonObj = jsonObj["Table"];
            json = JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);

            return json;
        }
        public async Task<dynamic> SelectDyn(Main m)
        {
            //Select
            string q = "";
            

            if (!string.IsNullOrEmpty(m.Tablename))
            {

                if (!string.IsNullOrEmpty(m.Fieldvalue))
                {
                    q = "SELECT * FROM " + m.Tablename + " WHERE " + m.Fieldname + "='" + m.Fieldvalue + "'";
                }
                else
                {
                    q = "SELECT * FROM " + m.Tablename;
                }
            }
            else
            {
                q = m.Query_IUD;

            }

            DataSet ds = await QuerySelect(q);
            string json = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            dynamic jsonObj = JsonConvert.DeserializeObject(json);
            jsonObj = jsonObj["Table"];

            return jsonObj;
        }
        public async Task<DataSet> QuerySelect(string query)
        {
            DataSet ds = new DataSet();
            var Configurations = Startup.Configuration;
            string cx = Configurations["conex"].ToString();

            MySqlConnection conex = new MySqlConnection(cx);


            try
            {
                MySqlCommand comando = new MySqlCommand(query, conex);
                conex.Open();
                MySqlDataAdapter adapt = new MySqlDataAdapter(comando);
                await adapt.FillAsync(ds);
                conex.Close();
            }
            catch (Exception eerr)
            {
                conex.Close();

            }
            return ds;
        }
        public DataSet QuerySelectSync(string query)
        {
            DataSet ds = new DataSet();
            var Configurations = Startup.Configuration;
            string cx = Configurations["conex"].ToString();

            MySqlConnection conex = new MySqlConnection(cx);


            try
            {
                MySqlCommand comando = new MySqlCommand(query, conex);
                conex.Open();
                MySqlDataAdapter adapt = new MySqlDataAdapter(comando);
                adapt.FillAsync(ds);
                conex.Close();
            }
            catch (Exception eerr)
            {
                conex.Close();

            }
            return ds;
        }
        public async Task<string> QueryIUD(string query)
        {
            string ret = "";
            var Configurations = Startup.Configuration;
            string cx = Configurations["conex"].ToString();
            MySqlConnection conex = new MySqlConnection(cx);
            try
            {
                MySqlCommand comando = new MySqlCommand(query, conex);
                conex.Open();

                int f = await comando.ExecuteNonQueryAsync();

                conex.Close();
                ret = f.ToString();
            }
            catch (Exception eerr)
            {
                conex.Close();
                ret = eerr.Message;

            }
            return ret;
        }

        public async Task<string> QueryIUDReturn(string query)
        {
            string ret = "";
            var Configurations = Startup.Configuration;
            string cx = Configurations["conex"].ToString();
            MySqlConnection conex = new MySqlConnection(cx);
            try
            {
                MySqlCommand comando = new MySqlCommand(query, conex);
                conex.Open();

                int f = await comando.ExecuteNonQueryAsync();
                long id = comando.LastInsertedId;

                conex.Close();
                ret = id.ToString();
            }
            catch (Exception eerr)
            {
                conex.Close();
                ret = "";

            }
            return ret;
        }
    }
}

