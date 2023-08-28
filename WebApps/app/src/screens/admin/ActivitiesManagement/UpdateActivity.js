import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import ActivityAsistance from '../../../components/QR/ActivityAsistance';
import { CheckIconFill, ChevronRightIcon, InfoIcon, PencilSquare } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ACTIVITY_DATA, DELETE_ACTIVITY, DELETE_SESSIONS, INSERT_SESSIONS, INS_ACTIVIDADES_DETALLES, UPDATE_ACTIVITY, UPDATE_ACTIVITY_PROGRAMS, UPDATE_ACTIVITY_ROLES, UPDATE_SESSIONS } from '../../../services/endPoints';
import lazyLoaderComponents from '../../../services/lazyLoaderComponents';
import { setActivitiesList } from '../../../store/admin/actions/activitiesAction';
import { APP_URL } from '../../../services/constants';
import "./style.css";

const CreateSessions = lazy(() => lazyLoaderComponents(() => import('../../../components/CreateSessions')));
const NewActivityForm = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')))
const ProgramsChooser = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')).then(m => ({ default: m.ProgramsChooser })))
const RolesChooser = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')).then(m => ({ default: m.RolesChooser })))
const ParticipantsApprovations = lazy(() => lazyLoaderComponents(() => import('../../../components/ParticipantsList/ParticipantsApprovations')));
const AddParticipant = lazy(() => lazyLoaderComponents(() => import('../../../components/ParticipantsList/AddParticipant')));
const ActivityComments = lazy(() => lazyLoaderComponents(() => import('../../../components/ActivityComments')));

class UpdateActivity extends Component {

    constructor() {
        super();
        this.state = {
            copyUrlToClipboard: false,
            loadedComponent: false,
            activeTab: 0,
            edit: [],
            activity: null,
            loader: null,
            modal: null,
            loader2: null,
            activityData: {},
            programascsv: [],
            rolescsv: [],
            sessions: null,
            participants: null,
            editSessions: false
        }
    }

    selectTab = activeTab => {
        if (this.state.loadedComponent) {
            if (activeTab === 1 && !(this.state.sessions?.length)) {
                this.getSessionsList(this.state.activity.id)
            }
            this.setState({ activeTab })
        }
    }

    goToBackPage = () => this.props.history.goBack()

    updateInList(data, sectionEditIndex) {
        this.enableEdition(sectionEditIndex);
        if (this.props.activitiesList?.length > 0) {
            let idx = this.props.activitiesList.findIndex(e => e.id === this.state.activity.id);
            if (idx >= 0) {
                this.props.activitiesList[idx] = { ...this.state.activity, ...data };
                this.props.setActivitiesList(this.props.activitiesList);
            }
        }
    }

    updateActivityData = ({ horas_cert, ...data }) => {
        const { activity } = this.state;
        this.setState({
            loader: "Actualizando actividad",
        });
        let data_send = {
            ...data,
            horascert: !!(horas_cert) ? `${horas_cert}:00:00` : null,
            id: activity.id,
        }
        AXIOS_REQUEST(UPDATE_ACTIVITY, "POST", data_send).then(resp => {
            if (resp.msg === "ERROR") { throw new Error(); }
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity, activityData: { horas_cert, ...data } }, () => this.updateInList({ horas_cert, ...data }, 0));
            })
        }).catch((e) => {
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity });
            })
            this.submitError("No se pudo hacer la modificación de la actividad, intente nuevamente");
        })
    }

    updateActivityRoles = (data, programsRequired) => {
        const { activity } = this.state;
        this.setState({
            loader: "Actualizando roles de la actividad",
        });

        AXIOS_REQUEST(UPDATE_ACTIVITY_ROLES, "POST", {
            id: activity.id,
            rolescsv: data.join(",")
        }).then(resp => {
            if (resp.msg === "ERROR") { throw new Error(); }
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity, rolescsv: data }, () => this.updateInList({ oferta_rol: data.join(",") }, 2));
            })
        }).catch((e) => {
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity }, () => {
                    this.submitError("No se pudo realizar la modificación de la actividad, intente nuevamente");
                })
            })
        })
    }

    updateActivityPrograms = (data) => {
        const { activity } = this.state;
        this.setState({
            loader: "Actualizando programas de la actividad",
        });

        AXIOS_REQUEST(UPDATE_ACTIVITY_PROGRAMS, "POST", {
            id: activity.id,
            programascsv: data.join(",")
        }).then(resp => {
            if (resp.msg === "ERROR") { throw new Error(); }
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity, programascsv: data }, () => this.updateInList({ oferta_programa: data.join(",") }, 1));
            })
        }).catch((e) => {
            this.setState({ loader: null, activity: null }, () => {
                this.setState({ activity }, () => {
                    this.submitError("No se pudo hacer la modificación de la actividad, intente nuevamente");
                })
            })
        })
    }

    updateActivitySessions = async (data) => {

        if (data.length === 0) {

        } else {
            var sessionsdeleted, sessionsupdated, sessionsinserted;
            let { sessions } = this.state;

            if (this.sessionsData.delete.length > 0) {
                sessionsdeleted = await this.deleteSessions(sessions.filter(s => this.sessionsData.delete.includes(s.item)));
            }

            if (this.sessionsData.update.length > 0) {
                let ss = data.filter(s => this.sessionsData.update.includes(s.item)).map(s => {
                    let { item, fecha, horaini, horafin, tiposesion, urlvc, lugar, expositores } = s;
                    return { item, fecha, horaini, horafin, tiposesion, urlvc, lugar, expositores };
                })
                sessionsupdated = await this.updateSessions(ss)
            }

            if (this.sessionsData.insert.length > 0) {
                let ss = data.filter(s => this.sessionsData.insert.includes(s.fecha)).map(s => {
                    let { fecha, horaini, horafin, tiposesion, urlvc, lugar, expositores } = s;
                    return { fecha, horaini, horafin, tiposesion, urlvc, lugar, expositores };
                })
                sessionsinserted = await this.insertSessions(ss)
            }

            if (sessionsdeleted || sessionsupdated || sessionsinserted) {
                this.submitSuccess("Se han realizado las modificaciones en las sesiones de la actividad", () => {
                    this.sessionsData = { update: [], delete: [], insert: [] }
                    this.setState({ editSessions: false }, () => {
                        this.getSessionsList(this.state.activity.id);
                    })
                })
            }
        }
    }

    deleteSessions = (sessions) => {
        let session = sessions.pop();
        this.setState({ loader: `Eliminando sesión ${session.fecha}` });
        return AXIOS_REQUEST(DELETE_SESSIONS, "post", { item: session.item, idactividad: this.state.activity.id }).then(resp => {
            if (sessions.length > 0) {
                return this.deleteSessions(sessions);
            } else {
                return true;
            }
        })
    }
    updateSessions = (sessions) => {
        let session = sessions.pop();
        this.setState({ loader: `Actualizando sesión del ${session.fecha}` });
        return AXIOS_REQUEST(UPDATE_SESSIONS, "post", { ...session, idact: this.state.activity.id }).then(resp => {
            if (sessions.length > 0) {
                return this.updateSessions(sessions);
            } else {
                return true;
            }
        })
    }
    insertSessions = (sessions) => {
        let session = sessions.pop();
        this.setState({ loader: `Registrando sesión para el ${session.fecha}` })
        return AXIOS_REQUEST(INSERT_SESSIONS, "post", { ...session, idact: this.state.activity.id }).then(resp => {
            if (sessions.length > 0) {
                return this.insertSessions(sessions);
            } else {
                return true;
            }
        })
    }

    submitError = (text, type = "danger", title = "Ops...", size = "sm", callback = () => { }) => {
        this.setState({
            loader: null,
            modal: {
                type,
                title,
                size,
                alert: text,
                open: true,
                onClosed: () => {
                    this.setState({ modal: null, loader: null }, callback)
                },
                buttons: [{ text: "Ok", color: "success", close: true }]
            }
        })
    }

    submitSuccess = (text, callback, size = "sm") => {
        this.submitError(text, "success", "¡Muy bien!", size, callback)
    }

    steps = () => [
        {
            title: <><h5 className="mb-0 text-muted">Actividad</h5></>,
            info: this.state.edit.includes(0) && <p className="mb-2 text-gray">Indíque la información básica para la actividad.</p>,
            form: <NewActivityForm
                disabled={!this.state.edit.includes(0)}
                onSubmit={this.updateActivityData}
                onlyRead={this.state.activity.finalizada}
                btnText={"Actualizar"}
                allActivityData={this.state.activity}
                defaultData={{ ...this.state.activityData }} />
        },
        {
            title: <><h5 className="mb-0 text-muted">Roles</h5></>,
            info: this.state.edit.includes(1) && <p className="mb-2 text-gray">Elija uno o varios roles a los cuales se ofertará la actividad. </p>,
            form: <RolesChooser
                disabled={!this.state.edit.includes(1)}
                selected={[...this.state.rolescsv]}
                minSelect={1}
                submitBtn={{ onClick: this.updateActivityRoles, text: "Actualizar" }}
            />
        },
        {
            title: <><h5 className="mb-0 text-muted">Programas</h5></>,
            info: this.state.edit.includes(2) && <p className="mb-2 text-gray">Elija uno o varios programas a los cuales se ofertará la actividad</p>,
            form: <ProgramsChooser
                disabled={!this.state.edit.includes(2)}
                selected={[...this.state.programascsv]}
                minSelect={1}
                submitBtn={{ onClick: this.updateActivityPrograms, text: "Actualizar" }}
            />
        },
    ];

    getActivityDetails = (id) => AXIOS_REQUEST(ACTIVITY_DATA + id).then(resp => resp.msg === "ERROR" ? null : resp.data[0]).catch(() => null)

    enableEdition = (idx) => {
        if (this.state.edit.includes(idx)) {
            this.setState({
                edit: this.state.edit.filter(e => e !== idx)
            })
        } else {
            this.setState({
                edit: [...this.state.edit, idx]
            });
        }
    }

    mapData = (activity) => {
        let programascsv = activity.oferta_programa?.split(",") || [];
        let rolescsv = activity.oferta_rol?.split(",") || [];
        let activityData = {
            horas_cert: activity.horas_cert,
            nomb_activ: activity.nomb_acti,
            iddepart: activity.id_depart,
            cupos: activity.cupos,
            dnidocente: activity.dni_docente,
            descripcion: activity.descripcion,
            tipoaprobacion: activity.idtipo_aprob,
            categoria: activity.idcateg,
            idbonus: activity.idBonus
        }
        return { programascsv, rolescsv, activityData };
    }

    getSessionsList = id => {
        return AXIOS_REQUEST(`${INS_ACTIVIDADES_DETALLES}${id}`).then(resp => {
            let today = new Date().getTime()
            this.setState({
                sessions: resp.data?.map(s => {
                    let d = new Date(s.fecha.replace(/(.+T).+/, "$1" + s.hora_ini)).getTime();
                    let expositores = s.expositores.split(">,");
                    expositores.shift();
                    return {
                        expositores: expositores.join(">,"),
                        notDeletable: today > d,
                        urlvc: s.enlace_url,
                        descripcion: s.descripcion,
                        lugar: s.lugar_sesion,
                        registasist: s.registasist,
                        fecha: s.fecha.split("T")[0],
                        horaini: s.hora_ini,
                        horafin: s.hora_fin,
                        tiposesion: s.tipo_sesion,
                        idact: s.id_actividad,
                        item: s.item
                    }
                }),
            })
        })
    }

    sessionsData = {
        update: [], //items ID
        delete: [], //items ID
        insert: []  //date yyyy-mm-dd
    }

    toggleEditSessions = () => {
        let { sessions, editSessions } = this.state;
        if (editSessions) {
            this.setState({ editSessions: !editSessions, sessions: null }, () => {
                this.setState({ sessions })
            })
            this.sessionsData = {
                update: [],
                delete: [],
                insert: []
            }
        } else {
            this.setState({ editSessions: !editSessions })
        }
    }

    handleEditSessions = (action, data) => {
        this.sessionsData[action] = [...this.sessionsData[action], data];
    }

    deleteActivity = () => {
        this.setState({
            modal: {
                type: "question",
                title: "¿Está seguro?",
                size: "md",
                alert: "Se eliminará la actividad de forma permanente y esta acción no es reversible",
                open: true,
                onClosed: (act) => {
                    if (act) {
                        this.setState({ loader: "Eliminando actividad", modal: null }, () => {
                            AXIOS_REQUEST(DELETE_ACTIVITY, "post", { idactividad: this.state.activity.id }).then(resp => {
                                if (resp.msg === "ERROR") { throw new Error(); }
                                this.submitSuccess("Se ha eliminado la actividad", () => {
                                    this.props.setActivitiesList(this.props.activitiesList?.filter(a => a.id !== this.state.activity.id))
                                    this.goToBackPage();
                                })
                            }).catch(err => this.submitError("No se pudo eliminar la actividad, intente nuevamente"))
                        })
                    } else {
                        this.setState({ modal: null, editSessions: false })
                    }
                },
                buttons: [{ text: "No, cancelar", color: "success", close: true }, { text: "Si, eliminar", color: "success", click: () => true }]
            }
        })
    }

    showComments = () => {
        this.setState({
            loader: null,
            modal: {
                open: true,
                title: <p className="mt-4 mb-5">Comentarios y calificaciones</p>,
                onClosed: () => this.setState({ modal: null }),
                size: "xl",
                closeIcon: true,
                children: <div className="mb-5">
                    <Suspense fallback={<Loader2 open></Loader2>}>
                        <ActivityComments activity={this.state.activity} />
                    </Suspense>
                </div>,
                buttons: [{ text: "Cerrar", color: "success", close: true }]
            }
        })
    }

    copyUrl = () => {
        let data = `${this.props.config?.url_base || APP_URL}/inscripcion/${this.state.activity.id}`;

        navigator.clipboard?.writeText(data).then(
            () => {
                this.setState({ copyUrlToClipboard: true }, () => {
                    setTimeout(() => {
                        this.setState({ copyUrlToClipboard: false })
                    }, 3000)
                })
            },
            (e) => {
            }
        );
    }

    async componentDidMount() {
        let { match: { params: { idactividad } }, activitiesList } = this.props
        let activity = null;
        if (!!(idactividad)) {
            if (activitiesList?.length > 0) {
                activity = activitiesList.find(i => i.id == idactividad);
            }
            if (!(activity)) {
                activity = await this.getActivityDetails(idactividad)
                if (!(activity)) {
                    return this.goToBackPage();
                }
            }
        } else {
            return this.goToBackPage();
        }
        activity.finalizada = new Date(activity.fecha_fin).getTime() < new Date().getTime();
        this.setState({ activity, ...this.mapData(activity), loadedComponent: true })
    }

    render() {
        const { activeTab, activity, edit, copyUrlToClipboard } = this.state;
        return (
            <>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-gray">
                        <h4 className="mb-0 d-block">Detalles: <b>{activity?.id}</b></h4>
                        {/* <span className='text-success'><SendCheck size/></span> */}
                    </div>
                    {activity?.sesiones === 1 && !activity?.tieneaprobaciones && <div className='flex-grow-1 ml-2'>
                        <ActivityAsistance
                            url={this.props.config?.url_base}
                            activityId={activity.id}
                            activityName={activity.nomb_acti}
                            title={this.props.config?.titulo}
                        />
                    </div>}
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>
                {activity?.id && <div className=' mb-5'>
                    {copyUrlToClipboard ?
                        <span className='alert alert-success mt-2'><CheckIconFill size={20} /> ENLACE COPIADO</span>
                        :
                        <span className='btn btn-link p-0' onClick={() => this.copyUrl()}><small>Copiar enlace para compartir</small></span>
                    }
                </div>}
                <div className="mb-4">
                    <nav className="nav nav-tabs flex-row">
                        <span className={`flex-fill text-center nav-link cursor-pointer ${activeTab === 0 ? "active bg-warning text-white font-weight-bold rounded-lg border-0" : "text-gray"}`}
                            onClick={() => this.selectTab(0)}>Actividad</span>
                        <span className={`flex-fill text-center nav-link cursor-pointer ${activeTab === 1 ? "active bg-warning text-white font-weight-bold rounded-lg border-0" : "text-gray"}`}
                            onClick={() => this.selectTab(1)}>Sesiones</span>
                        <span className={`flex-fill text-center nav-link cursor-pointer ${activeTab === 2 ? "active bg-warning text-white font-weight-bold rounded-lg border-0" : "text-gray"}`}
                            onClick={() => this.selectTab(2)}>Participantes</span>
                    </nav>
                </div>

                <div className="mt-5 mb-5">
                    {activeTab === 0 && (!!(activity) ? <>
                        {activity.finalizada && !(activity.tieneaprobaciones) && <div className="alert alert-warning">
                            <b className="mr-2"><InfoIcon /></b>La actividad finalizó el <b>{new Date(activity.fecha_fin).toLocaleString([], { dateStyle: "long", timeStyle: "medium" })}</b> pero el instructor no ha realizado el <button className="btn btn-link pl-0 pt-1" onClick={() => this.selectTab(2)}>proceso de aprobación</button></div>}
                        <div className={`card border-0 completed mb-4`}>
                            <div className="card-body row">
                                <div className="col-12 col-sm-4 text-sm-center mb-2 mb-sm-0">
                                    <small className="d-inline-block d-sm-block"><b>Inicio: </b></small>
                                    <span> {new Date(activity.fecha_inicio).toLocaleString([], { dateStyle: "long" })}</span>
                                </div>
                                <div className="col-12 col-sm-4 text-sm-center mb-2 mb-sm-0">
                                    <small className="d-inline-block d-sm-block"><b>Finalizacion: </b></small>
                                    <span> {new Date(activity.fecha_fin).toLocaleString([], { dateStyle: "long" })}</span>
                                </div>
                                <div className="col-12 col-sm-4 text-sm-center">
                                    <small className="d-inline-block d-sm-block"><b>Total inscritos: </b></small>
                                    <span> {activity.inscritos}</span>
                                </div>
                            </div>
                        </div>
                        {this.steps().map((step, idx) =>
                            <div
                                className={`card border-0 completed mb-4`}
                                key={idx}
                                id={`step-${idx}`}
                            >
                                <div className="card-body">
                                    {!(activity.finalizada) && <Button
                                        size="sm"
                                        active={edit.includes(idx)}
                                        className="rounded-pill float-right"
                                        // color={edit.includes(idx) ? "warning" : "light"}
                                        color={"light"}
                                        onClick={() => this.enableEdition(idx)}
                                    >
                                        <PencilSquare /> <small className="ml-1">Editar</small>
                                    </Button>}
                                    <div className="d-flex align-items-center">
                                        <span className="step-indicator mr-2"><CheckIconFill /></span>
                                        {step.title}
                                    </div>
                                    <div className="mt-3">
                                        {step.info && <div className="text-muted">{step.info}</div>}
                                        <Suspense fallback={<Loader2 open></Loader2>}>
                                            <div className="mt-5 mb-4">{step.form}</div>
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-5 mt-5 text-center">
                            <button className="btn btn-info" onClick={() => this.showComments()}>Ver comentarios</button>
                        </div>
                    </>
                        : <Loader2 open>Cargando detalles de la actividad</Loader2>
                    )}
                    {activeTab === 0 && !!(activity) && !(activity.finalizada) && <div className="mb-5 mt-5 d-flex justify-content-center">
                        <button className="btn btn-danger" onClick={() => this.deleteActivity()}>Eliminar Actividad</button>
                    </div>}

                    {activeTab === 1 && <>
                        <Suspense fallback={<Loader2 open></Loader2>}>
                            <div
                                className={`card border-0 completed mb-4`}
                                id={`step-${3}`}
                            >
                                <div className="card-body">
                                    {!!(this.state.sessions) ?
                                        <>{(this.state.sessions.length !== 0 && !(activity.finalizada)) ?
                                            <><Button
                                                size="sm"
                                                active={this.state.editSessions}
                                                className="rounded-pill mb-4"
                                                color={"light"}
                                                onClick={() => { this.toggleEditSessions() }}
                                            >
                                                <PencilSquare /> <small className="ml-1">{this.state.editSessions ? "Cancelar edición" : "Editar sesiones"}</small>
                                            </Button>
                                                <p className="text-gray">Solo se pueden modificar las sesiones de los días que no hayan pasado.</p>
                                            </>
                                            :
                                            <p className="text-gray">Las sesiones que registran asistencia son las que se encuentran marcadas con el simbolo <span className='text-success'><CheckIconFill /></span></p>
                                        }
                                            <CreateSessions
                                                handleActions={this.handleEditSessions}
                                                disabled={!this.state.editSessions}
                                                sessions={[...this.state.sessions]}
                                                submitBtn={{ onClick: this.updateActivitySessions, text: "Actualizar sesiones" }}
                                            />
                                        </>
                                        :
                                        <Loader2 open>Consultando sesiones</Loader2>
                                    }
                                </div>
                            </div>
                        </Suspense>
                    </>}
                    {activeTab === 2 && <>
                        <Suspense fallback={<Loader2 open></Loader2>}>
                            <ParticipantsApprovations
                                showAutoapprobation={!(this.state.activity?.tieneaprobaciones) && activity.finalizada}
                                activity={{ ...this.state.activity, tieneaprob: this.state.activity?.tieneaprobaciones }}
                                onlyRead={true}
                            />
                            <div className="mt-5 d-flex justify-content-between">
                                {/* <div>
                                    <button className="btn btn-info">Descargar lista</button>
                                </div> */}
                                {!(activity.finalizada) && <AddParticipant activity={this.state.activity} onSuccess={() => {
                                    this.setState({
                                        activeTab: null
                                    }, () => this.setState({
                                        activeTab: 2
                                    }))
                                }} />
                                }
                            </div>
                        </Suspense>
                    </>}

                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    activitiesList: state.activities.activitiesList,
    config: state.user.config
})

const mapDispatchToProps = dispatch => ({
    setActivitiesList: (list) => (dispatch(setActivitiesList(list))),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateActivity);
