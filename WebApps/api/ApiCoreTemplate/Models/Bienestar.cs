using ApiBienestar.Auxiliar;
using ApiBienestar.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBienestar.Models
{
    public class Bienestar
    {
        #region Actividades
        //Consulta la oferta disponible de actividades para un usuario con rol y programa especifico 
        public async Task<DataSet> GetOferta(UserToken ut)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            if (!string.IsNullOrEmpty(ut.CodProg))
            {
                ds = await m.QuerySelect(" SELECT * FROM v_actividades_ofertadas WHERE UNIX_TIMESTAMP(SYSDATE()) < ROUND(UNIX_TIMESTAMP(inicio)) AND CONCAT(oferta_programa,',') LIKE '%" + ut.CodProg + ",%' AND CONCAT(oferta_rol,',') LIKE '%" + ut.GetUserType(ut.Type) + ",%' AND esParticipanteActividad(id,'" + ut.Dni + "')='0' ORDER BY inicio");
            }
            else
            {
                ds = await m.QuerySelect(" SELECT * FROM v_actividades_ofertadas WHERE UNIX_TIMESTAMP(SYSDATE()) < ROUND(UNIX_TIMESTAMP(inicio)) AND CONCAT(oferta_rol,',') LIKE '%" + ut.GetUserType(ut.Type) + ",%' AND esParticipanteActividad(id,'" + ut.Dni + "')='0' ORDER BY inicio");
            }
            return ds;
        }
        //Consulta detalles (sesiones) de una actividad
        public async Task<DataSet> GetOfertaDetalle(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            
                ds = await m.QuerySelect("SELECT id_actividad, item, fecha, DATE_FORMAT(fecha,'%W, %M %e %Y') AS fechhum, hora_ini, hora_fin, enlace_url,expositores, tipo_sesion,lugar_sesion,id_creador, marc_temp,descripcion FROM bienes_actividades_horarios WHERE id_actividad='"+idactividad+"' AND eliminado='0' ORDER BY 3,5");
            
            
            return ds;
        }
        
        //Historial de actividades pasadas - maestro detalle
        public async Task<DataSet> GetHistorial(UserToken ut, string periodo="")
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            string query = "";
            if (periodo == "")
            {
                query = "SELECT *, getAprobacionActParticipante(id,'" + ut.Dni + "') AS aprobacion, getHorasAcumActividadParticipante(id, '" + ut.Dni + "') as horasacumuladas, getEvalActividad(id, '" + ut.Dni + "') as calificacion, esCertificable(id) as certificable FROM v_actividades_ofertadas WHERE esParticipanteActividad(id,'" + ut.Dni + "')='1' AND periodo=periodoActivo() AND UNIX_TIMESTAMP(SYSDATE()) > ROUND(UNIX_TIMESTAMP(fin))";

            }
            else
            {
                query = "SELECT *, getAprobacionActParticipante(id,'" + ut.Dni + "') AS aprobacion, getHorasAcumActividadParticipante(id, '" + ut.Dni + "') as horasacumuladas, getEvalActividad(id, '" + ut.Dni + "') as calificacion, esCertificable(id) as certificable FROM v_actividades_ofertadas WHERE esParticipanteActividad(id,'" + ut.Dni + "')='1' AND periodo='" + periodo + "' AND UNIX_TIMESTAMP(SYSDATE()) > ROUND(UNIX_TIMESTAMP(fin))";
            }
            ds = await m.QuerySelect(query);
            return ds;
        }
        public async Task<DataSet> GetHistorialDetalle(UserToken ut, string idactividad, string item)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            if (item == "") { item = "%"; }
            ds = await m.QuerySelect("SELECT  *, getEstadoActiParticipante(p.estado) as nombestado FROM bienes_actividades_horarios AS h  INNER JOIN bienes_actividades_participantes AS p ON h.id_actividad= p.id_actividad AND h.item=p.item WHERE h.id_actividad='" + idactividad+ "' AND h.eliminado='0' AND p.id_participante='" + ut.Dni+"' AND h.item LIKE '"+item+"'");
            return ds;
        }

        //actividades en curso - maestro detalle
        public async Task<DataSet> GetActividadesencurso(UserToken ut)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT *,getHorasAcumActividadParticipante(id, '" + ut.Dni + "') as horasacumuladas, getHorasActividad(id) as horas_cert FROM v_actividades_ofertadas WHERE esParticipanteActividad(id,'" + ut.Dni + "')='1' AND UNIX_TIMESTAMP(SYSDATE()) <= ROUND(UNIX_TIMESTAMP(fin))");
            return ds;
        }
        public async Task<string> InsertInscripcion(string idactividad, UserToken ut)
        {
            //obtener número de sesiones
            DataSet ds = new DataSet();
            ds = await GetDatosDetallesActividad(idactividad);
            int i = 0;
            Main m = new Main();
            string r = "";
            if ( ds.Tables[0].Rows.Count > 0)
            {
                for (i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    r = await m.QueryIUD("INSERT INTO bienes_actividades_participantes (id_actividad, item, id_participante) VALUES ('" + idactividad + "','" + ds.Tables[0].Rows[i]["item"].ToString() + "', '" + ut.Dni + "')");
                }

            }
           
            
            return r;
        }
        public async Task<string> InsertInscripcionItem(string idactividad, string item, string idpart)
        {
            //obtener número de sesiones
            DataSet ds = new DataSet();
            Main m = new Main();
            string r = "";
            r = await m.QueryIUD("INSERT INTO bienes_actividades_participantes (id_actividad, item, id_participante) VALUES ('" + idactividad + "','" + item + "', '" + idpart + "')");
            return r;
        }

        public async Task<string> CancelarInscripcion(string idactividad, UserToken ut)
        {

            DataSet ds = new DataSet();
            ds = await GetDatosDetallesActividad(idactividad);
            int i = 0;
            Main m = new Main();
            string r = "";
            if (ds.Tables[0].Rows.Count > 0)
            {
                for (i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    r = await m.QueryIUD("DELETE FROM bienes_actividades_participantes WHERE id_actividad='" + idactividad + "' AND item='" + ds.Tables[0].Rows[i]["item"].ToString() + "' AND id_participante='" + ut.Dni + "'");
                }

            }
            
            return r;
        }
        public async Task<string> EvaluarActividad(string idactividad, string comentario, string puntaje, UserToken ut)
        {

            
            Main m = new Main();
            string r = "";
            
            r = await m.QueryIUD("INSERT IGNORE INTO bienes_actividades_participantes_calificacion (id_acti,dni_part,califica,comentario) VALUES ('"+idactividad+"','"+ut.Dni+"','"+puntaje+"','"+comentario+"')");
  
            return r;
        }
    
        public async Task<int> GetSesiones(string idactividad)
        {
            int ret = 0;
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getSesiones('"+idactividad+"')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            return ret;
        }
        public async Task<int> GetInscritos(string idactividad)
        {
            int ret = 0;
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getInscritos('" + idactividad + "')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            return ret;
        }
        public async Task<int> TieneCuposDisponibles(string idactividad)
        {
            int ret = 0;
            bool rst = false;
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT tieneCuposDisponibles('" + idactividad + "')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                rst = Convert.ToBoolean(ds.Tables[0].Rows[0][0].ToString());
                ret = Convert.ToInt32(rst);
            }
            return ret;
        }
        public async Task<string> GetAprobacionBienesParticipante(string dni)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getAprobacionBienesParticipante('" + dni + "')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetHorasAcumuladas(string dni)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getHorasAcumParticipante('" + dni + "')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<DataSet> GetDatosActividad(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
          
                ds = await m.QuerySelect("SELECT nomb_acti,descripcion,categoria,sesiones,depart,DATE_FORMAT(inicio,'%W, %M %e %Y, %H:%i:%S') AS hinicio,DATE_FORMAT(fin,'%W, %M %e %Y, %H:%i:%S') AS hfin FROM v_actividades_ofertadas WHERE id='" + idactividad+"'");
          
            return ds;
        }
        public async Task<DataSet> GetDatosDetallesActividad(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();

            ds = await m.QuerySelect("SELECT item,DATE_FORMAT(fecha,'%W, %M %e %Y')as hfecha,fecha,hora_ini,hora_fin,tipo_sesion,lugar_sesion,enlace_url,expositores FROM bienes_actividades_horarios WHERE id_actividad='" + idactividad+"' AND eliminado='0' ORDER BY 3,4");

            return ds;
        }
        public async Task<string> GetDocenteActividad(string idactividad)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT dni_docente FROM bienes_actividades WHERE id='"+idactividad+"'");
            if (ds.Tables[0].Rows.Count>0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<Asistencia[]> SetAsistencia(Asistencia[] a, UserToken ut)
        {
            Asistencia[] ras = a;
            string r = "";
            Main m = new Main();
            int i = 0;
            foreach(Asistencia asist in a)
            {
                r = await m.QueryIUD("UPDATE bienes_actividades_participantes SET estado = '"+asist.Estado+"', observacion = '"+asist.Observacion+"', dni_docente = '"+ut.Dni+"' WHERE id_participante = '"+asist.DniPart+"' AND id_actividad = '"+asist.IdAct+"' AND item = '"+asist.Item+"'");

                ras[i].Result = r;
                i++;
                          
            }
            
         
            return ras;
        }
        public async Task<Asistencia> SetAsistenciaXqr(Asistencia a, string dni_docente)
        {
            
            string r = "";
            Main m = new Main();
            int i = 0;
            
                r = await m.QueryIUD("UPDATE bienes_actividades_participantes SET estado = '" + a.Estado + "', observacion = '" + a.Observacion + "', dni_docente = '" + dni_docente + "' WHERE id_participante = '" + a.DniPart + "' AND id_actividad = '" + a.IdAct + "' AND item = '" + a.Item + "'");

                a.Result = r;
                i++;

         
            return a;
        }

        public async Task<int> EsAprobableXqr(string idactividad, string item)
        {
            int ret = 0;
            
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT esAprobableXqr('" + idactividad + "','"+item+"')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                        ret = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
            }
            return ret;
        }

        public async Task<Aprobacion[]> SetAprobacion(Aprobacion[] a, UserToken ut)
        {
            Aprobacion[] ras = a;
            string r = "";
            Main m = new Main();
            int i = 0;
            DataSet ds = new DataSet();
            foreach (Aprobacion aprob in a)
            {

                //Consultar si existen aprobaciones
                ds = await m.QuerySelect("SELECT CONVERT(aprobado,CHAR) FROM bienes_aprobaciones_actividades AS a WHERE a.id_actividad='" + aprob.IdAct+"' AND a.dni_part='"+aprob.DniPart+"' AND anulado='0'");
                if (ds.Tables[0].Rows.Count > 0)
                {
                    //Si existen diferencias se debe anular anterior y registrar nueva aprobación
                    if (ds.Tables[0].Rows[0][0].ToString() != aprob.Aprobado)
                    {

                        r = await m.QueryIUD("UPDATE bienes_aprobaciones_actividades SET anulado='1' WHERE id_actividad='" + aprob.IdAct + "' AND dni_part='" + aprob.DniPart + "' AND anulado='0';");
                        r = await m.QueryIUD("INSERT INTO bienes_aprobaciones_actividades (id_actividad,dni_part,id_creador,aprobado) VALUES ('" + aprob.IdAct + "','" + aprob.DniPart + "','" + ut.Dni + "','" + aprob.Aprobado + "')");
                        ras[i].Result = r;
                    }
                    else
                    {
                        ras[i].Result = "0";
                    }
                }
                else
                {
                    // si no existen crear aprobación
                    r = await m.QueryIUD("INSERT INTO bienes_aprobaciones_actividades (id_actividad,dni_part,id_creador,aprobado) VALUES ('" + aprob.IdAct + "','" + aprob.DniPart + "','" + ut.Dni + "','" + aprob.Aprobado + "')");
                    ras[i].Result = r;

                }


               

                
                i++;

            }


            return ras;
        }
       
        public async Task<DataSet> SetAutoAprobacion(string idactividad, UserToken ut)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("CALL AprobarActividadPorcent('"+idactividad+"','"+ut.Dni+"')");
            return ds;
        }
        public async Task<string> SetAutoAprobacionBienestar(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            await m.QuerySelect("CALL AprobarBienestarHAcum('"+ut.Dni+"')");
            ret = "1";
            return ret;
        }
        public async Task<DataSet> GetActividadesencursoDocente(UserToken ut)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT *, getSesionProxima(id) AS proximasesion FROM v_actividades_ofertadas WHERE esDocenteActividad(id,'" + ut.Dni + "')='1' AND periodo=periodoActivo() AND UNIX_TIMESTAMP(SYSDATE()) <= ROUND(UNIX_TIMESTAMP(fin))");
            return ds;
        }

        public async Task<DataSet> GetActividadesGestorAdmin(UserToken ut, string periodo, string docente="", string nombre="", string categoria="", string indice="0", string dnidoc="")
        {
            DataSet ds = new DataSet();
            string idpart = "";
            string query = "";
            if (ut.Role == "2")
            {
                Bienestar b = new Bienestar();
                idpart = await b.GetAdminDeparts(ut);
                query = "SELECT * FROM v_actividades WHERE id_depart IN(" + idpart + ") AND periodo='" + periodo + "' AND docente LIKE '%" + docente + "%' AND (nomb_acti LIKE '%" + nombre + "%' OR descripcion LIKE '%" + nombre + "%') AND categoria LIKE '%" + categoria + "%' AND dni_docente LIKE '%" + dnidoc + "%'  LIMIT " + indice + ",20";
            }
            else
            {
                query = "SELECT * FROM v_actividades WHERE periodo='" + periodo + "' AND docente LIKE '%" + docente + "%' AND (nomb_acti LIKE '%" + nombre + "%' OR descripcion LIKE '%" + nombre + "%') AND categoria LIKE '%" + categoria + "%' AND dni_docente LIKE '%" + dnidoc + "%' LIMIT " + indice + ",20";
            }

            Main m = new Main();
            
            ds = await m.QuerySelect(query);
            return ds;
        }
        public async Task<string> GetIsActividadGestorAdmin(UserToken ut, string idactividad)
        {
            DataSet ds = new DataSet();
            string r = "0";
            string idpart = "";
            string query = "";
            if (ut.Role == "2")
            {
                Bienestar b = new Bienestar();
                idpart = await b.GetAdminDeparts(ut);
                query = "SELECT * FROM v_actividades WHERE id_depart IN(" + idpart + ") AND id='" + idactividad + "'";
            }
            else
            {
                query = "SELECT * FROM v_actividades WHERE id='" + idactividad + "'";
            }
            Main m = new Main();
            ds = await m.QuerySelect(query);
            if (ds.Tables[0].Rows.Count > 0)
            {
                r = "1";
            }
            return r;
        }
        public async Task<DataSet> GetActividades(UserToken ut, string idactividad)
        {
            DataSet ds = new DataSet();
            string idpart = "";
            string query = "";
            if (ut.Role == "2")
            {
                Bienestar b = new Bienestar();
                idpart = await b.GetAdminDeparts(ut);
                query = "SELECT * FROM v_actividades WHERE id_depart IN(" + idpart + ") AND id='"+idactividad+"'";
            }
            else
            {
                query = "SELECT * FROM v_actividades WHERE id='" + idactividad + "'"; 
            }

            Main m = new Main();

            ds = await m.QuerySelect(query);
            return ds;
        }
        public async Task<DataSet> GetDetallesActividadInstructor(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();

            ds = await m.QuerySelect("SELECT id_actividad, item, fecha, DATE_FORMAT(fecha,'%W, %M %e %Y') AS fechhum, hora_ini, hora_fin, enlace_url,expositores, tipo_sesion,lugar_sesion,id_creador, marc_temp, getRegistroAsistenciaActividad(id_actividad,item) AS registasist, descripcion  FROM bienes_actividades_horarios WHERE id_actividad='" + idactividad + "' AND eliminado='0' ORDER BY fecha");


            return ds;
        }
        public async Task<DataSet> GetHistorialDocente(UserToken ut,string periodo="")
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            string query = "";
            if (periodo == "")
            {
                query = "SELECT *, (SELECT AVG(c.califica) FROM bienes_actividades_participantes_calificacion AS c WHERE c.id_acti = id) AS promeval, tieneAprobaciones(id) AS tieneaprob FROM v_actividades_ofertadas WHERE esDocenteActividad(id,'" + ut.Dni + "')= '1' AND periodo = periodoActivo() AND UNIX_TIMESTAMP(SYSDATE()) > ROUND(UNIX_TIMESTAMP(fin))";

            }
            else
            {
                query = "SELECT *, (SELECT AVG(c.califica) FROM bienes_actividades_participantes_calificacion AS c WHERE c.id_acti=id) AS promeval, tieneAprobaciones(id) AS tieneaprob FROM v_actividades_ofertadas WHERE esDocenteActividad(id,'" + ut.Dni + "')='1' AND periodo='"+periodo+"' AND UNIX_TIMESTAMP(SYSDATE()) > ROUND(UNIX_TIMESTAMP(fin))";
            }


            ds = await m.QuerySelect(query);
            return ds;
        }
        public async Task<DataSet> GetParticipantes(string idactividad, string item) 
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM v_participantes WHERE id_actividad='"+idactividad+"' AND item='"+item+"'");
            return ds;
        }
        public async Task<DataSet> GetParticipantesAprob(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT dni_part, nomb_part, apel_part, email_part,getSesiones(id_actividad) AS sesiones, CONVERT(getEstadoActiParticipanteCount(id_actividad,'2',dni_part),CHAR) AS asistencia, CONVERT(getEstadoActiParticipanteCount(id_actividad,'4',dni_part),CHAR) AS con_excusa, CONVERT(getEstadoActiParticipanteCount(id_actividad,'3',dni_part),CHAR) AS inasistencia, tieneAprobacionesParticipanteActividad(dni_part,id_actividad) AS aprobad, getAprobacionActParticipanteCertificado(id_actividad,dni_part) as tienecertificado, programa as programa_part FROM v_participantes WHERE id_actividad = '" + idactividad+"' GROUP BY dni_part");
            return ds;
        }
        public async Task<DataSet> GetParticipantesDNI(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect(" SELECT DISTINCT id_participante FROM bienes_actividades_participantes WHERE id_actividad='"+idactividad+"'");
            return ds;
        }
        public async Task<DataSet> GetEvalComentarios(string idactividad)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT califica, comentario, marc_temp FROM bienes_actividades_participantes_calificacion WHERE id_acti='"+idactividad+"'");
            return ds;
        }
        public async Task<string> GetEvalPromedio(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT AVG((SELECT AVG(c.califica) FROM bienes_actividades_participantes_calificacion AS c WHERE c.id_acti=id)) AS promedio FROM v_actividades_ofertadas WHERE esDocenteActividad(id,'" + ut.Dni+"')='1' AND UNIX_TIMESTAMP(SYSDATE()) > ROUND(UNIX_TIMESTAMP(fin))");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }

        public async Task<string> GetNumActPendientesAprob(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM bienes_actividades WHERE dni_docente='"+ut.Dni+ "' AND eliminado='0' AND tieneAprobaciones(id) IS FALSE AND ROUND(UNIX_TIMESTAMP(getFechaFinActividad(id))) <= UNIX_TIMESTAMP(SYSDATE())");
            if(ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetNumActPendientesAprobXDepart(string depart)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM bienes_actividades WHERE id_depart IN ("+depart+ ") AND eliminado='0' AND tieneAprobaciones(id) IS FALSE AND getInscritos(id) != '0' AND ROUND(UNIX_TIMESTAMP(getFechaFinActividad(id))) <= UNIX_TIMESTAMP(SYSDATE())");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetNumActPeriodoActivo(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM bienes_actividades WHERE dni_docente='" + ut.Dni + "' AND eliminado='0' AND periodo=periodoActivo()");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }

        public async Task<string> GetNumActPeriodoActivoXDepart(string depart)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM bienes_actividades WHERE id_depart IN (" + depart + ")  AND eliminado='0' AND periodo=periodoActivo()");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }

        public async Task<DataSet> GetNumActPeriodo(UserToken ut)
        {
            
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT periodo, COUNT(id) AS actividades FROM bienes_actividades WHERE dni_docente='"+ut.Dni+"' AND eliminado='0' GROUP BY periodo");
            
            return ds;
        }
        public async Task<DataSet> GetNumActPeriodoParticipante(UserToken ut)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT periodo, COUNT(id) AS actividades FROM bienes_actividades WHERE esParticipanteActividad(id,'"+ut.Dni+"') AND eliminado='0' GROUP BY periodo");

            return ds;
        }
        public async Task<string> GetNumActEnCurso(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM v_actividades_ofertadas WHERE esDocenteActividad(id,'"+ut.Dni+"')='1' AND periodo=periodoActivo() AND UNIX_TIMESTAMP(SYSDATE()) <= ROUND(UNIX_TIMESTAMP(fin))");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetNumActEnCursoXDepart(string depart)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT COUNT(id) FROM v_actividades_ofertadas WHERE id_depart IN ("+depart+") AND periodo=periodoActivo() AND UNIX_TIMESTAMP(SYSDATE()) <= ROUND(UNIX_TIMESTAMP(fin))");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }

        public async Task<string> GetDepartamento(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT GROUP_CONCAT((SELECT nomb_depart FROM bienes_departamentos WHERE id_depart=codi_depart) SEPARATOR ',') FROM bienes_admin_departamentos WHERE dni_admin='"+ut.Dni+"'");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetDepartamentoCSV(UserToken ut)
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT GROUP_CONCAT(codi_depart SEPARATOR ',') FROM bienes_admin_departamentos WHERE dni_admin='" + ut.Dni + "'");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> GetPeriodoActivo()
        {
            string ret = "0";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT periodoActivo()");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        #endregion

        #region Admin

        public async Task<DataSet> GetAdmin(UserToken ut)
        {
            
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT idTipo, getAdminRoleName(idTipo) as rolName FROM bienes_admin WHERE dni_admin='" + ut.Dni+"' AND email_admin ='"+ut.Mail+"' AND enabled='1'");

            


            return ds;
        }
        public async Task<DataSet> GetAdminXDni(string dni)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_admin WHERE dni_admin='" + dni + "' AND enabled='1'");




            return ds;
        }
        public async Task<DataSet> GetAdminXDniXidTipo(string dni, string idTipo)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_admin WHERE dni_admin='" + dni + "' AND enabled='1' AND (idTipo='1' OR idTipo='2')");




            return ds;
        }
        public async Task<DataSet> GetConfig(string var="")
        {
            
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_config WHERE nomb_conf like '%"+var+"%'");

            return ds;
        }
        public async Task<DataSet> GetAdminDepart(UserToken ut)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT codi_depart AS iddepart, (SELECT nomb_depart FROM bienes_departamentos WHERE id_depart=sd.codi_depart) AS nombdepart FROM bienes_admin_departamentos AS sd WHERE dni_admin='"+ut.Dni+"'");

            return ds;
        }
        public async Task<string> GetAdminDeparts(UserToken ut)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            try
            {
                ds = await m.QuerySelect("SELECT GROUP_CONCAT(codi_depart) FROM bienes_admin_departamentos AS sd WHERE dni_admin='" + ut.Dni + "'");
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            catch (Exception e) { }
           
            return ret;
        }
        public DataSet GetConfigSync(string var = "")
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            ds = m.QuerySelectSync("SELECT * FROM bienes_config WHERE nomb_conf like '%" + var + "%'");

            return ds;
        }
        //Obtener usuarios del departamento y rol
        public async Task<DataSet> GetUsersRole(string id_tipo, string codi_depart="", string todos="0")
        {
           
            Main m = new Main();
            DataSet ds = new DataSet();
            string q = "";
            if (todos == "0")
            {
                q = "SELECT DISTINCT a.dni_admin, CONCAT(a.nomb_admin,' ',a.apel_admin) AS nombres, a.email_admin AS correo, enabled FROM bienes_admin AS a, bienes_admin_departamentos AS d  WHERE a.dni_admin=d.dni_admin AND d.codi_depart LIKE '"+codi_depart+"%' AND a.idTipo='"+id_tipo+"' AND enabled='1'";
            }
            else
            {
                q = "SELECT a.dni_admin, CONCAT(a.nomb_admin,' ',a.apel_admin) AS nombres, a.email_admin AS correo, enabled FROM bienes_admin AS a, bienes_admin_departamentos AS d  WHERE a.dni_admin=d.dni_admin AND d.codi_depart LIKE '" + codi_depart + "%' AND a.idTipo='" + id_tipo + "'";
            }
            ds = await m.QuerySelect(q);

            return ds;
        }
        public async Task<string> GetEmailAdmin(string dni)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getAdminEmail('"+dni+"')");

            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }


            return ret;
        }
        public async Task<string> GetNameAdminSesion(string dni)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT CONCAT(getAdminName('"+dni+"'),' <', getAdminEmail('"+dni+"'),'>')");

            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }


            return ret;
        }

        public async Task<string> GetAdminRoleName(string id_tipo)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getAdminRoleName('" + id_tipo + "')");

            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }


            return ret;
        }
        #endregion

        #region Participantes
        public async Task<DataSet> GetParticipantexCodnum(string codnum)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_participantes WHERE codnum_part='"+codnum+ "' AND codprog_part IS NOT NULL");

            return ds;
        }
        public async Task<DataSet> GetParticipantexDni(string dni)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_participantes WHERE dni_part = '" + dni + "'");

            return ds;
        }
        public async Task<DataSet> GetParticipantexEmail(string email)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM bienes_participantes WHERE email_part = '" + email + "'");

            return ds;
        }
        public async Task<DataSet> BuscarParticipante(string nombre, string apellido, string correo, string dni)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT p.dni_part, p.nomb_part, p.apel_part, p.email_part, (SELECT desc_rol FROM bienes_participantes_role WHERE id_rol=p.role_part) AS rol_part, (SELECT CONCAT(nomb_prog,' ',ciudad) FROM bienes_programas WHERE codi_prog=p.codprog_part) AS programa  FROM bienes_participantes AS p WHERE p.nomb_part  LIKE '%" + nombre+"%' AND p.apel_part LIKE '"+apellido+"%' AND p.email_part LIKE '"+correo+"%' AND p.dni_part LIKE '"+dni+"%'");

            return ds;
        }     
        public async Task<string> InsertParticipante(JObject ent)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            
            string cn = "";
            string cprog = "";
            if (!string.IsNullOrEmpty(ent["Codnum"].ToString()))
            {
                //c = int.Parse(ent["Codnum"].ToString());
                cn = ent["Codnum"].ToString();
            }
            if (!string.IsNullOrEmpty(ent["CodPrograma"].ToString()))
            {
                cprog = ent["CodPrograma"].ToString();
            }

            if (!(cn == "0000" || cn == "0" || cn == "00000" || cn =="000000"))
            {
                if (cprog != "")
                {
                    // Caso cuentas con programa y codnum
                    if (!string.IsNullOrEmpty(ent["Codnum"].ToString()) && !string.IsNullOrEmpty(ent["EmployeeNumber"].ToString()) && !string.IsNullOrEmpty(ent["GivenName"].ToString()) && !string.IsNullOrEmpty(ent["Sn"].ToString()) && !string.IsNullOrEmpty(ent["Mail"].ToString()) && !string.IsNullOrEmpty(ent["Branch"].ToString()) && !string.IsNullOrEmpty(ent["CodPrograma"].ToString()))
                    {
                        r = await m.QueryIUD("INSERT INTO bienes_participantes (codnum_part,dni_part,nomb_part,apel_part,email_part,role_part,codprog_part) VALUES ('" + ent["Codnum"].ToString() + "','" + ent["EmployeeNumber"].ToString() + "','" + ent["GivenName"].ToString() + "','" + ent["Sn"].ToString() + "','" + ent["Mail"].ToString() + "','" + ut.GetUserType(ent["Branch"].ToString()) + "','" + ent["CodPrograma"].ToString() + "')");
                    }
                }
                else
                {
                    //Caso cuentas sin programas
                    if (!string.IsNullOrEmpty(ent["Codnum"].ToString()) && !string.IsNullOrEmpty(ent["EmployeeNumber"].ToString()) && !string.IsNullOrEmpty(ent["GivenName"].ToString()) && !string.IsNullOrEmpty(ent["Sn"].ToString()) && !string.IsNullOrEmpty(ent["Mail"].ToString()) && !string.IsNullOrEmpty(ent["Branch"].ToString()))
                    {
                        r = await m.QueryIUD("INSERT INTO bienes_participantes (codnum_part,dni_part,nomb_part,apel_part,email_part,role_part) VALUES ('" + ent["Codnum"].ToString() + "','" + ent["EmployeeNumber"].ToString() + "','" + ent["GivenName"].ToString() + "','" + ent["Sn"].ToString() + "','" + ent["Mail"].ToString() + "','" + ut.GetUserType(ent["Branch"].ToString()) + "')");
                    }
                }

            }
            else
            {
                //Caso cuentas sin codnum ni programa
                if (!string.IsNullOrEmpty(ent["EmployeeNumber"].ToString()) && !string.IsNullOrEmpty(ent["GivenName"].ToString()) && !string.IsNullOrEmpty(ent["Sn"].ToString()) && !string.IsNullOrEmpty(ent["Mail"].ToString()) && !string.IsNullOrEmpty(ent["Branch"].ToString()))
                {
                    r = await m.QueryIUD("INSERT INTO bienes_participantes (dni_part,nomb_part,apel_part,email_part,role_part) VALUES ('" + ent["EmployeeNumber"].ToString() + "','" + ent["GivenName"].ToString() + "','" + ent["Sn"].ToString() + "','" + ent["Mail"].ToString() + "','" + ut.GetUserType(ent["Branch"].ToString()) + "')");
                }
            }

                return r;
        }
        public async Task<string> UpdateParticipante(JObject ent)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            r = await m.QueryIUD("UPDATE bienes_participantes SET dni_part = '"+ ent["EmployeeNumber"].ToString() + "', nomb_part = '"+ ent["GivenName"].ToString() + "', apel_part = '"+ ent["Sn"].ToString() + "', email_part = '"+ ent["Mail"].ToString() + "', codprog_part = '"+ ent["CodPrograma"].ToString() + "', role_part = '"+ ut.GetUserType(ent["Branch"].ToString()) + "' WHERE codnum_part = '"+ ent["Codnum"].ToString() + "'");
            return r;
        }
        public async Task<string> UpdateParticipanteCodnum(string dni,string ncodnum)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            r = await m.QueryIUD("UPDATE bienes_participantes SET codnum_part='"+ncodnum+"' WHERE dni_part = '" + dni + "'");
            return r;
        }
        public async Task<Participante[]> InsertParticipantes(Participante[] part, UserToken utk)
        {
            Main m = new Main();
            string r = "0";
            DataSet ds = new DataSet();
            Notify noti = new Notify();
            Dictionary<string, string> actv = new Dictionary<string, string>();

            ds = await GetConfig("url_base");
            string url_base = ds.Tables[0].Rows[0]["valor_conf"].ToString();
            ds.Clear();
            foreach (Participante p in part)
            {
                if (p.Correo.Contains("gmail.com"))
                {
                    //Validar si está en BD
                    ds = await GetParticipantexEmail(p.Correo.Trim().ToLower());
                    if (ds.Tables[0].Rows.Count <= 0)
                    {

                        //No está en BD ->  INSERT
                        
                        if (string.IsNullOrEmpty(p.Dni) || string.IsNullOrEmpty(p.Nombres) || string.IsNullOrEmpty(p.Apellidos) || string.IsNullOrEmpty(p.Correo))
                        {
                            p.MsgExec = "Oops, error en los datos";
                        }
                        else
                        {
                            r = await m.QueryIUD("INSERT INTO bienes_participantes (dni_part,nomb_part,apel_part,email_part,role_part) VALUES ('" + p.Dni.ToUpper() + "','" + p.Nombres.ToUpper() + "','" + p.Apellidos.ToUpper() + "','" + p.Correo.Trim().ToLower() + "','7')");

                            //Notificar regisro en Uninúñez Activa
                            //Notificar
                            if (r == "1")
                            {
                                p.MsgExec = "OK, cuenta agregada correctamente";
                                //inscribir
                                if (!string.IsNullOrEmpty(p.Actividad))
                                {
                                    //Validar Actividad
                                    r = "";
                                    if (!actv.TryGetValue(p.Actividad, out r))
                                    {
                                        actv.Add(p.Actividad, await GetIsActividadGestorAdmin(utk, p.Actividad));
                                    }

                                    if (actv[p.Actividad] == "1")
                                    {

                                        r = await InsertInscripcion(p.Actividad, new UserToken { Dni = p.Dni });
                                        if (r == "1")
                                        {
                                            //Notificar inscripcion
                                            await noti.NotificarActividad("notify_inscribe", p.Correo, p.Actividad);
                                            p.MsgExec += ", inscrito en actividad " + p.Actividad;
                                        }
                                        else
                                        {
                                            p.MsgExec += ", error insert database actividad_horarios";
                                        }
                                    }
                                    else
                                    {
                                        p.MsgExec += ", no tiene permiso para inscribir en la actividad";
                                    }

                                }
                                else
                                {
                                    await noti.NotificarBasic("notify_registro", p.Correo, url_base);
                                }

                                
                            }
                            else
                            {
                                p.MsgExec = "Oops, error insert database participantes";
                            }
                        }
                        
                        
                       
                    }
                    else
                    {
                        p.MsgExec = "Oops, cuenta existente";
                        //inscribir
                        if (!string.IsNullOrEmpty(p.Actividad))
                        {
                            //Validar Actividad
                            r = "";
                            if (!actv.TryGetValue(p.Actividad, out r))
                            {
                                actv.Add(p.Actividad, await GetIsActividadGestorAdmin(utk, p.Actividad));
                            }
                            
                                if (actv[p.Actividad] == "1")
                                {

                                    r = await InsertInscripcion(p.Actividad, new UserToken { Dni = ds.Tables[0].Rows[0]["dni_part"].ToString() });
                                    if (r == "1")
                                    {
                                        //Notificar inscripcion
                                        await noti.NotificarActividad("notify_inscribe", p.Correo, p.Actividad);
                                        p.MsgExec += ", inscrito en actividad " + p.Actividad;
                                }
                                    else
                                    {
                                        p.MsgExec += ", error insert database actividad_horarios";
                                    }
                                }
                                else
                                {
                                    p.MsgExec += ", no tiene permiso para inscribir en la actividad";
                                }
                            
                        }
                    }
                    
                }
               
                if (p.Correo.Contains("@curnvirtual.edu.co") || p.Correo.Contains("@curn.edu.co"))
                {
                    //Cuentas internas

                    //Consultar Datos
                    var client2 = new RestClient("https://axis.curn.edu.co/apildap/api/ldap/account/" + p.Correo);
                    client2.Timeout = -1;
                    var request2 = new RestRequest(Method.GET);
                    IRestResponse response2 = client2.Execute(request2);
                    var rpt = JsonConvert.DeserializeObject(response2.Content);
                    Respuesta resp = JsonConvert.DeserializeObject<Respuesta>(rpt.ToString());

                    if (resp.cod == "200")
                    {
                        
                        ds = await GetParticipantexEmail(p.Correo);
                        if (ds.Tables[0].Rows.Count <= 0)
                        {
                            //No está en BD - INSERT
                            r = await InsertParticipante(resp.data.entidad);
                            if (r == "1")
                            {
                                p.MsgExec = "OK, cuenta agregada correctamente";
                                //Inscribir
                                if (!string.IsNullOrEmpty(p.Actividad))
                                {

                                    //Validar Actividad
                                    r = "";
                                    if (!actv.TryGetValue(p.Actividad, out r))
                                    {
                                        actv.Add(p.Actividad, await GetIsActividadGestorAdmin(utk, p.Actividad));

                                    }

                                    if (actv[p.Actividad] == "1")
                                    {
                                        r = await InsertInscripcion(p.Actividad, new UserToken { Dni = resp.data.entidad.EmployeeNumber });
                                        if (r == "1")
                                        {
                                            //Notificar inscripcion
                                            await noti.NotificarActividad("notify_inscribe", p.Correo, p.Actividad);
                                            p.MsgExec += ", inscrito en actividad " + p.Actividad;
                                        }
                                        else
                                        {
                                            p.MsgExec += ", error insert database actividad_horarios";
                                        }
                                    }
                                    else
                                    {
                                        p.MsgExec += ", no tiene permiso para inscribir en la actividad";
                                    }

                                }
                                else
                                {

                                    //Notificar regisro en Uninúñez Activa
                                    await noti.NotificarBasic("notify_registro", p.Correo, url_base);
                                }
                            }
                        }
                        else
                        {
                            r = "";
                            p.MsgExec = "Oops, cuenta existente";
                            //inscribir
                            if (!string.IsNullOrEmpty(p.Actividad))
                            {
                                //Validar Actividad
                                if (!actv.TryGetValue(p.Actividad, out r))
                                {
                                    actv.Add(p.Actividad, await GetIsActividadGestorAdmin(utk, p.Actividad));
                                }
                                
                                    if (actv[p.Actividad] == "1")
                                    {
                                        r = await InsertInscripcion(p.Actividad, new UserToken { Dni = resp.data.entidad.EmployeeNumber });
                                        if (r == "1")
                                        {
                                            //Notificar inscripcion
                                            await noti.NotificarActividad("notify_inscribe", p.Correo, p.Actividad);
                                            p.MsgExec += ", inscrito en actividad " + p.Actividad;
                                    }
                                        else
                                        {
                                            p.MsgExec += ", error insert database actividad_horarios";
                                        }
                                    }
                                    else
                                    {
                                        p.MsgExec += ", no tiene permiso para inscribir en la actividad";
                                    }
                               
                            }
                        }
                    }
                    else
                    {
                        p.MsgExec = "Oops, cuenta no existe en el dominio";
                    }

                }
               
            }
              
            return part;
        }
        public async Task<string> UpdateParticipanteName(string dni, string nombres, string apellidos)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            r = await m.QueryIUD("UPDATE bienes_participantes SET nomb_part = '" + nombres + "', apel_part = '" + apellidos + "' WHERE dni_part = '" + dni + "'");
            return r;
        }
        public async Task<string> GetParticipanteAddressxDni(string dni)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getAdrressEth('" + dni + "')");
            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }
            return ret;
        }
        public async Task<string> UpdateParticipanteAddress(string dni, string address)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            r = await m.QueryIUD("UPDATE bienes_participantes SET address = '" + address + "' WHERE dni_part = '" + dni + "'");
            return r;
        }


        #endregion

        #region Lealtad
        public async Task<string> GetLealtad(string puntos)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getLealtad(" + puntos + ")");
            ret = ds.Tables[0].Rows[0][0].ToString();
            return ret;
        }
        public async Task<int> GetPuntos(string dni)
        {
            int ret = 0;
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getPointsSaldo('" + dni + "')");
            ret = int.Parse(ds.Tables[0].Rows[0][0].ToString());
            return ret;
        }
        public async Task<DataSet> GetTransacciones(string dni, string min)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM v_transac WHERE dni_part='"+dni+"' LIMIT "+min+",10");

            return ds;
        }
        public async Task<DataSet> GetHistorialHoras(string dni, string min)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT getActividadName(id_actividad) AS actividad ,item,getFechaInicioSesion(id_actividad,item) AS fechasesion,marc_update AS fechatransac,horas AS horas FROM bienes_actividades_participantes WHERE id_participante='" + dni+"' AND horas IS NOT NULL ORDER BY marc_update DESC LIMIT "+min+",10");

            return ds;
        }

        public async Task<int> GetSaldoSinAddress(string dni)
        {
            int ret = 0;
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT SUM(monto) FROM bienes_lealtad_transacciones WHERE dni_part='"+dni+"' AND idEstado='2' AND eth_transact IS NULL");
            ret = int.Parse(ds.Tables[0].Rows[0][0].ToString());
            return ret;
        }
        public async Task<string> UpdateTransactSinAddress(string dni, string eth_transact)
        {
            int r = 0;
            Main m = new Main();
            UserToken ut = new UserToken();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT id FROM bienes_lealtad_transacciones WHERE dni_part='" + dni + "' AND idEstado='2' AND eth_transact IS NULL");

            for (int i= 0; i< ds.Tables[0].Rows.Count; i++)
            {
                await m.QueryIUD("UPDATE bienes_lealtad_transacciones SET eth_transact='"+eth_transact+"' WHERE id='"+ds.Tables[0].Rows[i][0].ToString()+"'");
                r++;
            }
         
            return r.ToString();
        }
        public async Task<DataSet> GetTransaccionData(string id)
        {
           
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT CONCAT(tipo_transac,' | ', detalle) as datos, monto FROM v_transac WHERE id_transac" + id + "'");
           
            return ds;
        }
        public async Task<string> UpdateTransact(string idtransact, string eth_transact="")
        {
            string r = "0";
            Main m = new Main();
            UserToken ut = new UserToken();

            if (eth_transact == "")
            {
                r = await m.QueryIUD("UPDATE bienes_lealtad_transacciones SET idEstado='2' WHERE id='" + idtransact + "'");
            }
            else
            {
                r = await m.QueryIUD("UPDATE bienes_lealtad_transacciones SET idEstado='2', eth_transact='" + eth_transact + "' WHERE id='" + idtransact + "'");
            }

            return r;
        }
       
        #endregion

        #region Registro_Actividades

        public async Task<string> InsertActividad(Actividad act)
        {
                     
            Main m = new Main();
            string r = "";
            r = await m.QueryIUDReturn("INSERT INTO bienes_actividades(nomb_acti,categoria,periodo,descripcion,id_creador,sesiones,cupos,id_depart,idBonus,tipo_aprob,dni_docente,eliminado,horas_cert) VALUES "+
            "('"+act.Nomb_activ+"','"+act.Categoria+"',periodoActivo(),'"+act.Descripcion+"','"+act.IdCreador+"','"+act.Sesiones+"','"+act.Cupos+"','"+act.IdDepart+"','"+act.IdBonus+"','"+act.TipoAprobacion+"','"+act.DniDocente+"','1','"+act.HorasCert+"')");
            if (r != "")
            {
                //r = "0";
                //DataSet ds = await m.QuerySelect("SELECT LAST_INSERT_ID()");
                //r = ds.Tables[0].Rows[0][0].ToString();
                //if (r != "0")
                //{                 
                    //Insert Actividades Programas
                    string[] prog = act.ProgramasCsv.Split(',');
                    foreach (string p in prog)
                    {
                        await m.QueryIUD("INSERT INTO bienes_actividades_programa (id_acti, id_prog) VALUES ('" + r + "', '"+p+"')");
                    }
                    //Insert Actividade Role
                    string[] role = act.RolesCsv.Split(',');
                    foreach (string x in role)
                    {
                        await m.QueryIUD("INSERT INTO bienes_actividades_role (id_acti, id_role) VALUES ('"+r+"', '"+x+"')");
                    }

                //}

                //string query = "SELECT id,nomb_acti,periodo,descripcion,sesiones,cupos," +
                //               "getCategoriaActividad(categoria) AS categoria," +
                //               "getDepartamento(id_depart)  AS depart," +
                //               "getPointsBonus(idBonus) AS puntos," +
                //               "getAprobacionTipo(tipo_aprob) AS tipo_aprob," +
                //               "getAprobacionTipoDesc(tipo_aprob) AS tipo_aprob_desc," +
                //               "getProgramaOfertaActividad(id) AS oferta_programa," +
                //               "getProgramaNameOfertaActividad(id) AS oferta_programahum," +
                //               "getRoleOfertaActividad(id) AS oferta_rol," +
                //               "getRoleNameOfertaActividad(id) AS oferta_rolhum," +
                //               "getAdminName(dni_docente) AS docente " +
                //               " FROM bienes_actividades WHERE id = '"+r+"'";
                // dds = await m.QuerySelect(query);

            }
            return r;
        }
        public async Task<string> UpdateActividad(Actividad act)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            string r = "";
            r = await m.QueryIUD("UPDATE bienes_actividades SET nomb_acti = '"+act.Nomb_activ.ToString()+"',categoria = '"+act.Categoria.ToString()+"',descripcion = '"+act.Descripcion.ToString()+"',cupos = '"+act.Cupos.ToString()+"',id_depart = '"+act.IdDepart.ToString()+"',idBonus = '"+act.IdBonus.ToString()+"',tipo_aprob = '"+act.TipoAprobacion.ToString()+"',dni_docente = '"+act.DniDocente.ToString()+"',horas_cert='"+act.HorasCert+"'  WHERE id = '"+act.Id.ToString()+"'");
            return r;
        }
        public async Task<string> UpdateActividadProgramas(Actividad act)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            string r = "";
            //Insert Actividades Programas
            string[] prog = act.ProgramasCsv.Split(',');
            r = await m.QueryIUD("DELETE FROM bienes_actividades_programa WHERE id_acti = '" + act.Id.ToString() + "'");
            foreach (string p in prog)
            {
                r = await m.QueryIUD("INSERT INTO bienes_actividades_programa (id_acti, id_prog) VALUES ('" + act.Id.ToString() + "', '" + p + "')");
            }

            return r;
        }
        public async Task<string> UpdateActividadRoles(Actividad act)
        {

            Main m = new Main();
            DataSet ds = new DataSet();
            string r = "";
            
                string[] role = act.RolesCsv.Split(',');
                r = await m.QueryIUD("DELETE FROM bienes_actividades_role WHERE id_acti = '" + act.Id.ToString() + "'");
                foreach (string x in role)
                {
                   r =  await m.QueryIUD("INSERT INTO bienes_actividades_role (id_acti, id_role) VALUES ('" + act.Id.ToString() + "', '" + x + "')");
                }
            return r;
        }
        public async Task<string>DeleteActividad(string idactividad)
        {
            string ret = "";
            Main m = new Main();
                     
            ret = await m.QueryIUD("UPDATE bienes_actividades SET eliminado='1' WHERE id='"+idactividad+"'");
         
            return ret;
        }
        public async Task<string> InsertSesiones(Sesion[] s)
        {
            string r = "";
            Main m = new Main();
            int i = 0;
            DataSet ds = new DataSet();
            foreach (Sesion sesion in s)
            {

                string query = "INSERT INTO bienes_actividades_horarios (id_actividad,item,fecha,hora_ini,hora_fin,enlace_url,expositores,tipo_sesion,lugar_sesion,id_creador,descripcion) VALUES " +
                "('"+sesion.IdAct+"', '"+sesion.Item+"', '"+sesion.Fecha+"', '"+sesion.HoraIni+"', '"+sesion.HoraFin+"', '"+sesion.UrlVC+"', '"+sesion.Expositores+"', '"+sesion.TipoSesion+"', '"+sesion.Lugar+"', '"+sesion.IdCreador+"','"+sesion.Descripcion+"')";
                    r = await m.QueryIUD(query);
            }
            //actualizar actividad.
            r = await m.QueryIUD("UPDATE bienes_actividades SET eliminado = '0' WHERE id = '"+s[0].IdAct+"'");
            ////consultar datos insertados
            //ds = await GetDatosDetallesActividad(s[0].IdAct);
            return r;
        }
        public async Task<string> InsertSesion(Sesion s)
        {
            string r = "";
            Main m = new Main();
            int i = 0;
            DataSet ds = new DataSet();
           

                string query = "INSERT INTO bienes_actividades_horarios (id_actividad,item,fecha,hora_ini,hora_fin,enlace_url,expositores,tipo_sesion,lugar_sesion,id_creador,descripcion) VALUES " +
                "('" + s.IdAct + "', '" + s.Item + "', '" + s.Fecha + "', '" + s.HoraIni + "', '" + s.HoraFin + "', '" + s.UrlVC + "', '" + s.Expositores + "', '" + s.TipoSesion + "', '" + s.Lugar + "', '" + s.IdCreador + "','"+s.Descripcion+"')";
                r = await m.QueryIUD(query);

            //Update Actividad
            r = await m.QueryIUD("UPDATE bienes_actividades SET sesiones = getSesionesCount("+ s.IdAct + ")  WHERE id ='" + s.IdAct + "'");
            //consultar datos insertados
            //ds = await m.QuerySelect(" SELECT * FROM bienes_actividades_horarios WHERE id_actividad='"+s.IdAct+"' AND item = '"+s.Item+"'");
            return r;
           
        }
        public async Task<DataSet> UpdateSesion(Sesion s)
        {
            string r = "";
            Main m = new Main();
            int i = 0;
            DataSet ds = new DataSet();
           

                string query = "UPDATE bienes_actividades_horarios" + 
                " SET fecha = '"+s.Fecha+"', hora_ini = '"+s.HoraIni+"', hora_fin = '"+s.HoraFin+"', enlace_url = '"+s.UrlVC+"', expositores = '"+s.Expositores+"',"+
                " tipo_sesion = '"+s.TipoSesion+"', lugar_sesion = '"+s.Lugar+"', id_creador = '"+s.IdCreador+"', descripcion='"+s.Descripcion+"' "+
                " WHERE id_actividad = '"+s.IdAct+"' AND item = '"+s.Item+"' AND eliminado = '0'";
                r = await m.QueryIUD(query);
           
            
            //consultar datos actualizados
            ds = await m.QuerySelect(" SELECT * FROM bienes_actividades_horarios WHERE id_actividad='"+s.IdAct+"' AND item = '"+s.Item+"'");
            return ds;
        }
        public async Task<string> DeleteSesion(string idactividad, string item)
        {
            string ret = "";
            Main m = new Main();

            ret = await m.QueryIUD("UPDATE bienes_actividades_horarios SET eliminado='1' WHERE id_actividad='" + idactividad + "' AND item='"+item+"'");

            //Update Actividad
            ret = await m.QueryIUD("UPDATE bienes_actividades SET sesiones = getSesionesCount(" + idactividad + ")  WHERE id ='" + idactividad + "'");

            return ret;
        }

        public async Task<int> GetMaxItem(string idactividad)
        {
       
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT IFNULL(MAX(item),0) FROM bienes_actividades_horarios WHERE id_actividad='" + idactividad+"'");
            return int.Parse(ds.Tables[0].Rows[0][0].ToString());
        }
        #endregion

        #region Aprobacion
        public async Task<DataSet> GetAprobacionCertificado(string idaprobacion)
        {
            Main m = new Main();
            DataSet ds = new DataSet();

            ds = await m.QuerySelect("select * from bienes_aprobaciones_certificados where id_aproba='"+idaprobacion+"'");


            return ds;
        }

        public async Task<DataSet> GetDataCertificado(string idaprobacion)
        {
            Main m = new Main();
            DataSet ds = new DataSet();

            ds = await m.QuerySelect("SELECT ac.dni_part,getParticipanteName(ac.dni_part) AS participante,getParticipanteEmail(ac.dni_part) AS correo,a.periodo, a.id, LPAD(ac.id_aproba,10,'0') as idaprob,a.nomb_acti,HOUR(getHorasActividad(a.id)) AS nhoras,getDepartamento(a.id_depart) AS dpto, DATE_FORMAT(ac.marc_update, '%d-%m-%Y') AS fecha FROM bienes_aprobaciones_actividades ac INNER JOIN bienes_actividades a ON ac.id_actividad = a.id WHERE ac.aprobado = '1' AND ac.anulado = '0' AND ac.id_aproba = '" + idaprobacion+"'");


            return ds;
        }

        public async Task<string> UpdateAprobacionCertificado(string idaprobacion, string file, string description, string active, string eth_address="",string eth_contract="", string eth_transact= "", string eth_network="", string eth_indexcert="")
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
            if (eth_address == "")
            {
                r = await m.QueryIUD("UPDATE bienes_aprobaciones_certificados SET file = '" + file + "',description = '" + description + "',active = '" + active + "' WHERE id_aproba = '" + idaprobacion + "'");
            }
            else
            {
              
                r = await m.QueryIUD("UPDATE bienes_aprobaciones_certificados SET  emitido = '1', file = '" + file + "',description = '" + description + "', active = '" + active + "', eth_address = '" + eth_address + "', eth_contract = '" + eth_contract + "',eth_transact = '" + eth_transact + "', eth_network = '" + eth_network + "',eth_date = NOW(), eth_indexcert='"+eth_indexcert+"' WHERE id_aproba = '" + idaprobacion + "'");

            }
            return r;
        }

        public async Task<string> UpdateAprobacionCertificadoURlFile(string idaprobacion, string url_file)
        {
            Main m = new Main();
            UserToken ut = new UserToken();
            string r = "";
           
                r = await m.QueryIUD("UPDATE bienes_aprobaciones_certificados SET url_file = '" + url_file + "' WHERE id_aproba = '" + idaprobacion + "'");
           
            return r;
        }

        public async Task<DataSet> AprobadosCualificacion()
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT * FROM v_aprobados_cualificacion");

            return ds;
        }
        public async Task<string> ValingAprobacion(string idaprobacion)
        {
            string ret = "";
            Main m = new Main();
            DataSet ds = new DataSet();

            ds = await m.QuerySelect("select dni_part from bienes_aprobaciones_actividades where id_aproba='" + idaprobacion + "' AND aprobado='1' AND anulado='0'");

            if (ds.Tables[0].Rows.Count > 0)
            {
                ret = ds.Tables[0].Rows[0][0].ToString();
            }

            return ret;
        }

        #endregion

        #region History

        public async Task<DataSet> GetDatosHistory(string bd, string dni = "", string nombres = "", string indice = "0")
        {
            DataSet ds = new DataSet();
            string query = "";
            Bienestar b = new Bienestar();
            nombres = nombres.ToUpper();
            nombres = nombres.Replace("'", "");
            dni = dni.Replace(",", "");
            dni = dni.Replace(".", "");
            dni = dni.Replace("'", "");

            if (bd == "1")
            {
                query = "SELECT estudiante AS nombres,  actividad, ano AS periodo, facultad AS programa FROM history_datos1 WHERE estudiante LIKE '%" + nombres+"%' LIMIT "+indice+",50";
            }
            else
            {
                query = "SELECT dni,nombres,actividad,grupo,periodo,instructor,estado,programa FROM history_datos2 WHERE nombres LIKE '%"+nombres+"%' AND dni LIKE '"+dni+"%' ORDER BY nombres,periodo DESC LIMIT "+indice+",50";
            }
          

            Main m = new Main();

            ds = await m.QuerySelect(query);
            return ds;
        }

        #endregion

        #region Seguimiento

        public async Task<DataSet> GetDocentesxDepart(string periodo, string id_depart)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT  tt.docente, tt.dni_docente, SUM(tt.sesiones) AS total_sesiones, SUM(tt.sesiones_completadas) AS sesiones_completadas, COUNT(*) AS total_actividades,SUM(tt.tieneaprobaciones) AS actividades_completadas, getAdminEmail(tt.dni_docente) AS email_docente, getAdminEnabled(tt.dni_docente) AS enabled FROM ( SELECT va.dni_docente, va.docente, va.id, va.sesiones, va.tieneaprobaciones, (SELECT SUM(getRegistroAsistenciaActividad(bah.id_actividad, bah.item)) FROM bienes_actividades_horarios AS bah WHERE bah.id_actividad = va.id) AS sesiones_completadas    FROM v_actividades AS va    WHERE va.periodo LIKE '"+periodo+"' AND va.id_depart = '"+id_depart+"') AS tt GROUP BY dni_docente");

            return ds;
        }

        public async Task<DataSet> GetResumenXDocente(string periodo, string id_depart, string dni)
        {
            Main m = new Main();
            DataSet ds = new DataSet();
            ds = await m.QuerySelect("SELECT va.id, va.nomb_acti, va.tieneaprobaciones, va.sesiones, SUM(getRegistroAsistenciaActividad(va.id, bah.item)) as sesiones_registra_asistencia, SUM(IF(CONCAT(bah.fecha, ' ', bah.hora_fin) < CURRENT_TIMESTAMP, 1, 0)) as sesiones_fecha_finalizada, va.fecha_inicio, va.fecha_fin FROM v_actividades as va INNER JOIN bienes_actividades_horarios bah ON bah.id_actividad = va.id WHERE va.periodo LIKE '"+periodo+"' AND va.id_depart = '"+id_depart+"' AND va.dni_docente = '"+dni+"'  GROUP BY va.id");

            return ds;
        }

        #endregion
    }
}
