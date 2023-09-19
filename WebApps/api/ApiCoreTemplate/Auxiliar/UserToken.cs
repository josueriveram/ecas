using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Auxiliar
{
    public class UserToken
    {
        public string Dni { get; set; }
        public string Mail { get; set; }
        public string Type { get; set; }
        public string NombProg { get; set; }
        public string CodProg { get; set; }
        public string Codnum { get; set; }
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RolePart { get; set; }
        public string GetUserType(string branch)
        {
            string ret = "";

            if (branch.Contains("admitidos"))
            {
                ret = "1";
            }
            if (branch.Contains("estudiantes"))
            {
                ret = "2";
            }
            if (branch.Contains("docentes"))
            {
                ret = "3";
            }
            if (branch.Contains("egresados"))
            {
                ret = "5";
            }
            if (branch.Contains("regulares"))
            {
                ret = "6";
            }
            if (branch.Contains("uuxxi"))
            {
                ret = "4";
            }
            if (branch.Contains("otros"))
            {
                ret = "4";
            }
            if (branch.Contains("intercambio"))
            {
                ret = "2";
            }
            if (branch.Contains("temporales"))
            {
                ret = "3";
            }
            if (branch.Contains("externos"))
            {
                ret = "7";
            }


            return ret;
        }

        public string Role { get; set; }
    }
}
