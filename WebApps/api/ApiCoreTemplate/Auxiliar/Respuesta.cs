using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Auxiliar
{
    public class Respuesta
    {
        public string msg { get; set; }
        public dynamic data { get; set; }
        public string cod { get; set; }
    }
}
