import { API_BIENESTAR_BASE } from './constants';

/**
 * If an endpoint finish with a "/", is because need a url param
 * 
 * If an enpoint not finish with a sufix, is because it's method is GET
 */

//* ============================= *//
//*        API BIENESTAR          *//
//* ============================= *//

export const GET_PERIODOS = `${API_BIENESTAR_BASE}/periodos`; //GET all periods
export const GET_ADMIN_CONFIG = `${API_BIENESTAR_BASE}/admin/config`; //GET all general admin config 
export const GET_ADMIN_CONFIG_SPECIFIC = `${GET_ADMIN_CONFIG}/admin/config/`; //GET specific admin config var /varname 

//Estudiante
export const LOGIN = `${API_BIENESTAR_BASE}/auth/autenticar`; // POST Login
export const MIS_ACTIVIDADES = `${API_BIENESTAR_BASE}/actividades`; //GET subscribed personal activities in current period
export const TRANSACCIONES_PUNTOS = `${API_BIENESTAR_BASE}/puntos/`; //GET points transactions /minpage/?idstudent
export const TRANSACCIONES_HORAS = `${TRANSACCIONES_PUNTOS}horas/`; //GET hours transactions /minpage/?idstudent
export const MIS_ACTIVIDADES_DETALLE = `${MIS_ACTIVIDADES}/`; //GET subscribed personal activity details {idactividad}
export const USER_STATUS = `${MIS_ACTIVIDADES}/estado`; // GET principal user status
export const ACTIVIDADES_OFERTA = `${MIS_ACTIVIDADES}/oferta`; //GET all avaliable offers for students
export const ACTIVIDADES_HISTORIAL = `${MIS_ACTIVIDADES}/historial`; //GET offers history vinculated to an estudent 
export const ACTIVIDADES_OFERTA_DETALLE = `${ACTIVIDADES_OFERTA}/`; //GET offer detail {id_offer}
export const ACTIVIDADES_HISTORIAL_DETALLE = `${ACTIVIDADES_HISTORIAL}/`; //GET activity history detail
export const ACTIVIDADES_INSCRIBIR_POST = `${MIS_ACTIVIDADES}/inscribir`; //subscribe to an activity (student) {idactividad, item}
export const ACTIVIDADES_CANCELAR_POST = `${MIS_ACTIVIDADES}/cancelar`; //unsubscribe to an activity (student) {idactividad, item}
export const ACTIVIDADES_EVALUAR_POST = `${MIS_ACTIVIDADES}/evaluar`; //Evaluate an activity done (student) {idactividad, puntaje, comentario}
export const CERTIFICADO_NUEVO = `${API_BIENESTAR_BASE}/ethereum/certificate/new`; //Request new certificate {id_aproba, address?}
export const GUARDAR_ADDRESS = `${API_BIENESTAR_BASE}/participantes/update/address`; //Request new certificate {address}
export const REVOKE_OWN_CERTIFICATE = `${API_BIENESTAR_BASE}/certificate/revoke`; //POST {id_aproba}
export const AUTO_ASISTANCE = `${API_BIENESTAR_BASE}/actividades/inscribirxqr`; //POST {idact,item,dnipart = "",estado=1,observacion="Inscrito por QR"}


// Instructor
export const INS_ESTADO = `${API_BIENESTAR_BASE}/instructor/estado`; //GET resume instructor status
export const INS_ACTIVIDADES = `${API_BIENESTAR_BASE}/instructor/actividades/lista/`; //GET activity list /
export const INS_ACTIVIDADES_DETALLES = `${API_BIENESTAR_BASE}/instructor/actividades/`; //GET activity sessions 
export const INS_HISTORIAL = `${API_BIENESTAR_BASE}/instructor/historial`; //GET activity history [/period]
export const INS_ASISTENCIA = `${API_BIENESTAR_BASE}/instructor/asistencia`; //POST set activity attendance {idact,item,dnipart,estado,observacion}
export const INS_APROBACION = `${API_BIENESTAR_BASE}/instructor/aprobacion`;  //POST set user approvation of an activity  {idact,dnipart,aprobado:[0,1]}
export const INS_AUTOAPROBACION = `${API_BIENESTAR_BASE}/instructor/autoaprobacion`;  //POST set user automatic approvation of an activity  {idacttividad: id}
export const INS_PARTICIPANTES = `${API_BIENESTAR_BASE}/instructor/participantes`; // POST activity participants list by session {idactividad, item}
export const INS_PARTICIPANTES_APROB = `${API_BIENESTAR_BASE}/instructor/participantesaprob`; // POST, get activity participants list by activity form make approbation {idactividad}
export const INS_EVA_COMENTARIOS = `${API_BIENESTAR_BASE}/instructor/evaluacion/comentarios/`; //GET activity comments {id: idactividad}


// Admin
export const LOAD_CATEGORIES = `${API_BIENESTAR_BASE}/actividadescategoria`; //GET categories list; [/id] 
export const LOAD_DEPARTMENTS = `${API_BIENESTAR_BASE}/departamentos/departamentos`; //GET departments list; [/id]
export const LOAD_MY_DEPARTMENTS = `${API_BIENESTAR_BASE}/departamentos/misdepartamentos`; //GET my onws departments list;
export const LOAD_BONUS = `${API_BIENESTAR_BASE}/puntos/bonos`; //GET bonus list; [/id]
export const LOAD_TEACHERS = `${API_BIENESTAR_BASE}/admin/usuarios`; //POST teachers list {codi_depart?, idtipo, todos: 1|0};
export const LOAD_APPROBATION_TYPE = `${API_BIENESTAR_BASE}/aprobaciontipo`; //GET Aprobation type list; [/id]
export const LOAD_ROLES = `${API_BIENESTAR_BASE}/participantesrole`; //GET Roles list; [/id]
export const LOAD_PROGRAMS = `${API_BIENESTAR_BASE}/programas`; //GET programs list; [/id]

//Manager
export const ACTIVITIES_LIST = `${API_BIENESTAR_BASE}/gestionactividades`; //post {indice, periodo, docente: }
export const ADMIN_ESTADO = `${API_BIENESTAR_BASE}/gestionactividades/estado`; //GET
export const ACTIVITY_DATA = `${API_BIENESTAR_BASE}/gestionactividades/consulta/`; //get data activity (idactividad) 
export const NEW_ACTIVITY = `${API_BIENESTAR_BASE}/gestionactividades/registro`; //insert new activity {nomb_activ,descripcion,categoria,sesiones,cupos,iddepart,idbonus,dnidocente,tipoaprobacion,programascsv,rolescsv}
export const UPDATE_ACTIVITY = `${API_BIENESTAR_BASE}/gestionactividades/registro/update`; //Update an activity {id, nomb_activ,descripcion,categoria,cupos,iddepart,idbonus,dnidocente,tipoaprobacion}
export const UPDATE_ACTIVITY_ROLES = `${API_BIENESTAR_BASE}/gestionactividades/registro/update/roles`; //Update an activity roles {id, rolescsv}
export const UPDATE_ACTIVITY_PROGRAMS = `${API_BIENESTAR_BASE}/gestionactividades/registro/update/programas`; //Update an activity programs {id, programascsv}
export const DELETE_ACTIVITY = `${API_BIENESTAR_BASE}/gestionactividades/registro/delete`; //Delete activity by id {idactividad}
export const NEW_SESSIONS = `${API_BIENESTAR_BASE}/gestionactividades/registro/sesiones`; //Insert new activity sessions [{idact,fecha,horaini,horafin,tiposesion,urlvc,lugar,expositores}] 
export const UPDATE_SESSIONS = `${API_BIENESTAR_BASE}/gestionactividades/registro/sesiones/update`; //update an activity session {idact,item,fecha,horaini,horafin,tiposesion,urlvc,lugar,expositores} 
export const INSERT_SESSIONS = `${API_BIENESTAR_BASE}/gestionactividades/registro/sesiones/insert`; //insert an activity session {idact,fecha,horaini,horafin,tiposesion,urlvc,lugar,expositores} 
export const DELETE_SESSIONS = `${API_BIENESTAR_BASE}/gestionactividades/registro/sesiones/delete`; //delete an activity session {idactividad,item} 
export const ADD_EXTERNAL_PARTICIPANTS = `${API_BIENESTAR_BASE}/participantes/add/massive`; //Add external participants [{dni, nombres, apellidos, correo, actividad:(opcional)}]
export const ADD_PARTICIPANTS = `${API_BIENESTAR_BASE}/participantes/add`; //POST Add participants { correo }
export const FIND_PARTICIPANT = `${API_BIENESTAR_BASE}/participantes/correo/`; //Get participant information /email
export const SEARCH_PARTICIPANTS = `${API_BIENESTAR_BASE}/participantes/buscar`; //POST Search partcipants by params {dni, nombre, apellido, correo}
export const CREATE_INSTRUCTOR = `${API_BIENESTAR_BASE}/admin`; //POST: Create a new instructor {dni_admin, idTipo, apel_admin, nomb_admin, email_admin}
export const UPDATE_INSTRUCTOR = `${CREATE_INSTRUCTOR}/`; //PUT: Update instructor data /dni_admin {idTipo, apel_admin, nomb_admin, email_admin, enabled}
export const ENABLE_DISABLE_INSTRUCTOR = `${CREATE_INSTRUCTOR}/setenable`; //POST: Enable or disable an instructor {dni_admin, enabled: 0|1}
export const ASSOC_DEPARTMENT_INSTRUCTOR = `${API_BIENESTAR_BASE}/admin/asignar_depart`; //Asociate an admin with departments {dni_admin, codi_depart: (Separated by comma)} 
export const RESUMEN_INSTRUCTOR = `${API_BIENESTAR_BASE}/admin/instructor/resumen`; //POST {dni, tipo: optional}
export const RESUMEN_PARTICIPANTE = `${API_BIENESTAR_BASE}/participantes/resumen` // POST {dni} 

export const PARTICIPANT_HISTORY = `${API_BIENESTAR_BASE}/actividades/participante/historial/`; //GET activities ended /dni [header: periodo: string]
export const PARTICIPANT_HISTORY_DETAILS = `${API_BIENESTAR_BASE}/actividades/participante/historial/`; //GET ended activity details by /:dni/:id_actividad
export const PARTICIPANT_CURRENT_ACTIVITIES = `${API_BIENESTAR_BASE}/actividades/participante/`; //GET activities ended /dni 

export const TRACKING_MASTER = `${API_BIENESTAR_BASE}/seguimiento/docentes`; //POST {periodo, id_depart} 
export const TRACKING_DETAILS = `${API_BIENESTAR_BASE}/seguimiento/actividades`; //POST {periodo, id_depart, dni_doc} 

export const UPDATE_USER_NAME = `${API_BIENESTAR_BASE}/participantes/update`; //POST {nombres, apellidos} 



//bd = "1" only accept the "nombres" param
export const ACTIVITIES_HISTORY_1998_2020 = `${API_BIENESTAR_BASE}/history`; // POST {bd: "1"(1998 , 2010-01) | "2"(2010-01 , 2020-02), dni, nombres, indice}

export const BIENESTAR_GENERAL_APPROBATION = `${API_BIENESTAR_BASE}/bienestar/aprobacion`; //POST manual approbation {dni_part, id_tapro, obser_aproba}`;
export const BIENESTAR_GENERAL_AUTO_APPROBATION = `${API_BIENESTAR_BASE}/bienestar/autoaprobacion`; //POST auto approbation {dni_part, id_tapro, obser_aproba}
export const BIENESTAR_GENERAL_CANCEL_APPROBATION = `${API_BIENESTAR_BASE}/bienestar/anulacion`; //POST {dni_part, id_aproba}

/**
 *
 *
 * /actividades/participante/:dni/:id_actividad   GET /dni
 *
 *
 *  */


