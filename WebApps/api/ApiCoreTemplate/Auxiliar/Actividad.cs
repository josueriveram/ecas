using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Auxiliar
{
    public class Actividad
    {
        public string Nomb_activ { get; set; }
        public string Descripcion { get; set; }
        public string Categoria { get; set; }
        public string IdCreador { get; set; }
        public string Sesiones { get; set; }
        public string Cupos { get; set; }
        public string IdDepart { get; set; }
        public string IdBonus { get; set; }
        public string DniDocente { get; set; }
        public string TipoAprobacion { get; set; }
        public string ProgramasCsv { get; set; }
        public string RolesCsv { get; set; }
        public string Periodo { get; set; }
        public string Id { get; set; }
        public string HorasCert { get; set; }
    }
}
