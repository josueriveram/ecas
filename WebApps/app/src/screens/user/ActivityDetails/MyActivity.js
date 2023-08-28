import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, UncontrolledCollapse } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import { CheckIconFill, WarningIconFill, XCloseIconFill } from '../../../components/UI/Icons';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ACTIVIDADES_CANCELAR_POST, MIS_ACTIVIDADES_DETALLE } from '../../../services/endPoints';
import "./index.css";
import Sessions from './Sessions';
import CircleProgress from '../../../components/UI/CircleProgress/CircleProgress';
import { setSubscribedActivities } from '../../../store/user/actions/activitiesAction';

const basePage = "/inicio";

class MyActivity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            sessionsList: null,
            modal: null,
            loader: null
        }
    }

    getSesionStatus = (status) => {
        let icon = null;
        switch (status.toLowerCase()) {
            case "asistió":
                icon = <div className="text-success"><CheckIconFill size={21} /></div>
                break;
            case "no asistió":
                icon = <div className="text-danger"><XCloseIconFill size={21} /></div>
                break;
            case "inscrito":
                icon = <div className="text-muted"><WarningIconFill size={21} /></div>
                break;
            default:
                icon = <div className="text-warning"><CheckIconFill size={21} /></div>
                break;
        }
        return <div className="tag mr-3 text-center">
            {icon}
            <small className="d-block">{status}</small>
        </div>
    }

    getSessionsList = id => {
        return AXIOS_REQUEST(`${MIS_ACTIVIDADES_DETALLE}${id}`).then(resp => {
            let today = new Date().getTime();
            let completed = resp.data.reduce((prev, current) =>
                (new Date(current.fecha.replace(/^(.+)T(.+)/, `$1T${current.hora_ini}`)).getTime() < today) ? ++prev : prev
                , 0);
            let activitySessions = <Sessions list={resp.data} statusCallback={this.getSesionStatus} />
            this.setState({
                activity: { ...this.state.activity, completed },
                sessionsList: <div className="list-group">{activitySessions}</div>
            })
        })
    }

    unsubscribeMe = () => {
        this.setState({
            modal: {
                open: true,
                size: "md",
                type: "warning",
                title: "Espere",
                alert: "¿Seguro que desea cancelar la inscripción a esta actividad?",
                children: "Esta acción es irreversible y otra persona podría tomar el cupo que usted está a punto de liberar.",
                onClosed: (callback) => {
                    if (!!(callback)) {
                        callback();
                    } else {
                        this.setState({ modal: null })
                    }
                    // this.setState({ modal: { ...this.state.modal, "title": "hey", onClosed: () => this.setState({ modal: null }) } });
                },
                buttons: [
                    { text: "NO", color: "danger", close: true },
                    {
                        text: "SI", click: () => this.finallyUnsubscribe, color: "primary"
                    }
                ]
            }
        })
    }

    finallyUnsubscribe = () => {
        this.setState({
            loader: "Cancelando inscripción",
            modal: null
        });

        AXIOS_REQUEST(ACTIVIDADES_CANCELAR_POST, "post", { idactividad: this.state.activity.id }).then(resp => {
            if (resp.data === "1") {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        size: "md",
                        type: "success",
                        title: "¡Muy bien!",
                        alert: "Su inscripción se ha cancelado exitosamente",
                        onClosed: () => {
                            this.setState({ modal: null });
                            this.props.history.replace(basePage)
                        },
                        buttons: [
                            { text: "OK", close: true }
                        ]
                    }
                });
                let { match: { params: { idactividad } }, activities } = this.props;
                activities.splice(idactividad, 1)
                this.props.setList(activities)
            } else {
                throw new Error();
            }
        }).catch(err => {
            this.setState({
                loader: null,
                modal: {
                    open: true,
                    size: "sm",
                    type: "danger",
                    title: "Ops...",
                    alert: err.msg ?? "No se pudo cancelar la inscripción a la actividad, vuelva a intentarlo",
                    onClosed: () => this.setState({ modal: null }),
                    buttons: [
                        { text: "OK", close: true }
                    ]
                }
            })
        })
    }

    componentDidMount() {
        let { match: { params: { idactividad } }, location: { state }, history, activities } = this.props
        let activity = null;
        if (!!(state)) {
            activity = state;
        } else if (!!(idactividad) && activities.length > 0) {
            activity = activities[idactividad]
        } else {
            return history.replace(basePage)
        }
        activity.can_unsubscribe = new Date().getTime() > new Date(activity.inicio).getTime();
        this.setState({ activity })
        this.getSessionsList(activity.id);
    }

    render() {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const item = this.state.activity;
        const { sessionsList, modal } = this.state;
        if (!(item)) {
            return null
        }
        // const enableUnsubscribeButton = !(item.can_unsubscribe);
        const enableUnsubscribeButton = !(item.completed === item.sesiones || item.completed > 3);
        return (
            <>
                {modal && <ModalUI {...modal} />}
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div className="activity-details mb-5">
                    <div className="card">
                        <div className="card-body pr-0 pr-md-3">
                            <div className="row mb-4">
                                <div className="col-12 col-sm-8 col-md-9 col-lg-10">
                                    <h4 className="text-muted">
                                        <b>{item.nomb_acti}</b>
                                    </h4>
                                </div>
                                {sessionsList && enableUnsubscribeButton &&
                                    <div className="col text-center p-0">
                                        <button className="btn btn-danger d-none d-sm-inline-block" onClick={() => this.unsubscribeMe()}>
                                            Cancelar inscripción
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="text-muted">
                                <div className="row">
                                    <div className="col-12 col-md-9 col-lg-10">
                                        <p><span>{item.descripcion}</span></p>
                                        <p><b>Código: </b> <br /><span>{item.id}</span> </p>
                                        <p><b>Categoría: </b> <br /><span>{item.categoria}</span> </p>
                                        <div>
                                            <p className="d-sm-inline-block mr-5"><b>Inicia a partir del: <br /></b> {new Date(item.inicio).toLocaleString([], dateOptions)} </p>
                                            <p className="d-sm-inline-block"><b>Termina el: </b><br /> {new Date(item.fin).toLocaleString([], dateOptions)} </p>
                                        </div>
                                        <p><b>Ofertado por: </b> <br />{item.depart} </p>
                                    </div>
                                    <div className="col text-center mb-3 mt-3 mb-lg-0 h-100">
                                        <div className="row">
                                            {/* <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Sesiones</b><br />
                                                <span>{item.sesiones}</span>
                                            </div> */}
                                            {/* <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Cupos</b><br />
                                                <span>{item.cupos - item.inscritos}</span>
                                            </div> */}
                                            <div className="col-12 text-center mb-3">
                                                <div className="row align-items-center">
                                                    <div className="col-12 text-left text-md-center">
                                                        <b>Progreso</b>
                                                    </div>
                                                    <div className="col col-md-12">
                                                        <CircleProgress
                                                            radius={60}
                                                            stroke={8}
                                                            progress={(item.completed * 100) / item.sesiones}
                                                            content={<span>{item.completed} de {item.sesiones}<br />sesiones</span>}
                                                        />
                                                    </div>
                                                    <div className="col col-md-12">
                                                        <b>Puntos</b><br />
                                                        <span>{item.puntos}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="pb-3  col-6 col-sm-3 col-md-12">
                                                <b>Inscritos</b><br />
                                                <span>{item.inscritos}</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                {!!(item.horas_cert) && <p><b>Horas certificadas: </b> <br /><span>{item.horas_cert}</span></p>}
                                <p><b>Oferta dirigida para: </b>  </p>
                                <div className="mb-3">
                                    {item.oferta_rolhum?.split(",").map(e => <a key={e} href="#" style={{ fontSize: "12px", maxWidth: "100%" }} className="mr-2 mb-1 rounded-pill btn btn-primary btn-lg disabled btn-sm text-truncate" tabIndex="-1" role="button" aria-disabled="true">{e}</a>)}<br />
                                    {!!(item.oferta_programahum) && <div className='mt-3'>
                                        <button className="btn btn-info rounded-pill btn-sm mb-3 pl-3 pr-3" id="show_progs">{item.oferta_programahum.split(",").length} programas</button>
                                        <UncontrolledCollapse toggler={`#show_progs`} >
                                            {item.oferta_programahum.split(",").map(e => <a key={e} href="#" style={{ fontSize: "12px", maxWidth: "100%" }} className="mr-2 mb-1 rounded-pill btn btn-success btn-lg disabled btn-sm text-truncate" tabIndex="-1" role="button" aria-disabled="true">{e}</a>)}
                                        </UncontrolledCollapse>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {enableUnsubscribeButton &&
                        <div className=" text-center p-0">
                            <button className="mt-4 mb-4 w-100  btn btn-danger d-sm-none" onClick={() => this.unsubscribeMe()}>
                                Cancelar Inscripción
                            </button>
                        </div>}
                    <div className="mt-5">
                        <h6><b>Sesiones de la actividad: </b> {item.sesiones} </h6>
                        <div>
                            {sessionsList || <div className="d-flex  align-items-center justify-content-center mt-3 mb-3 flex-column"><Spinner />Consultando sesiones</div>}
                        </div>
                    </div>
                    <div className="mt-5">
                        <button className="btn btn-info rounded btn-sm" id="aprob_button">¿Cómo se aprueba esta actividad?</button>
                        <UncontrolledCollapse toggler={`#aprob_button`} >
                            <div className="card mt-3">
                                <div className="card-body d-block">
                                    <b>{item.tipo_aprob}</b><br />
                                    <i>{item.tipo_aprob_desc}</i>
                                </div>
                            </div>
                        </UncontrolledCollapse>
                    </div>
                </div>
            </>
        );
    }
}
const mapStateToProps = state => ({
    activities: state.activities.subscribed
})
const mapDispatchToProps = dispatch => ({
    setList: (list) => dispatch(setSubscribedActivities(list))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyActivity);