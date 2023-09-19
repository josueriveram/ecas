using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Auxiliar
{
    public class Sesion
    {
        public string IdAct { get; set; }
        public string Item { get; set; }
        public string Fecha { get; set; }
        public string HoraIni { get; set; }
        public string HoraFin { get; set; }
        public string UrlVC { get; set; }
        public string TipoSesion { get; set; }
        public string Lugar { get; set; }
        public string IdCreador { get; set; }
        public string Expositores { get; set; }
        public string Descripcion { get; set; }

    }
}
