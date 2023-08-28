import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, UncontrolledCollapse } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ACTIVIDADES_INSCRIBIR_POST, ACTIVIDADES_OFERTA_DETALLE } from '../../../services/endPoints';
import { getActivitiesList, setSubscribedActivities } from '../../../store/user/actions/activitiesAction';
import "./index.css";
import Sessions from './Sessions';

const basePage = "/inscripcion";

class ActivityOffer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            activityNotFound: false,
            sessionsList: null,
            modal: null,
            loader: null
        }
    }

    getSessionsList = id => {
        return AXIOS_REQUEST(ACTIVIDADES_OFERTA_DETALLE + id).then(resp => {
            let activitySessions = this.makeSessionItem(resp.data)
            this.setState({
                sessionsList: <div className="list-group">{activitySessions}</div>
            })
        })
    }

    subscribeMe = () => {
        this.setState({
            modal: {
                open: true,
                size: "md",
                type: "question",
                title: "Confirmación",
                alert: "¿Deseas inscribirte esta actividad?",
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
                        text: "SI", click: () => this.finallyInscription, color: "primary"
                    }
                ]
            }
        })
    }

    finallyInscription = () => {
        this.setState({
            loader: "Realizando inscripción",
            modal: null
        });

        AXIOS_REQUEST(ACTIVIDADES_INSCRIBIR_POST, "post", { idactividad: this.state.activity.id }).then(resp => {
            if (resp.cod === "200") {
                if (!!(resp.data.error)) {
                    throw new Error(resp.data.error);
                }
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        size: "md",
                        type: "success",
                        title: "¡Muy bien!",
                        alert: "Su inscripción a la actividad ha sido exitosa",
                        onClosed: () => {
                            this.setState({ modal: null });
                            this.props.history.replace(basePage)
                        },
                        buttons: [
                            { text: "OK", close: true }
                        ]
                    }
                })

                let { match: { params: { idactividad } }, activities, subscribed } = this.props;
                if (!!(activities?.[idactividad])) {
                    activities[idactividad].inscritos = Number(activities[idactividad].inscritos) + 1;
                    subscribed.push(activities[idactividad])
                    this.props.setList(subscribed)
                }
            } else {
                throw new Error("No se pudo realizar la inscripción a la actividad, vuelva a intentarlo");
            }
        }).catch(err => {
            this.setState({
                loader: null,
                modal: {
                    open: true,
                    size: "sm",
                    type: "danger",
                    title: "Ops...",
                    alert: err.message,
                    onClosed: () => this.setState({ modal: null }),
                    buttons: [
                        { text: "OK", close: true }
                    ]
                }
            })
        })
    }

    makeSessionItem = (list) => {
        list = list.map(i => { delete i.lugar_sesion; delete i.enlace_url; return i; })
        return <Sessions list={list} />;
    }

    setActivity(activity) {
        if (!(activity)) {
            this.setState({ activityNotFound: true })
        } else {
            this.setState({ activity })
            this.getSessionsList(activity?.id);
        }
    }

    componentDidMount() {
        let { match: { params: { idactividad } }, location: { state }, history, activities } = this.props
        if (!!(state)) {
            this.setActivity(state)
        } else if (!!(idactividad)) {
            if (activities.length > 0) {
                this.setActivity(activities.find(i => i.id == idactividad))
            } else {
                this.props.getActivitiesList().then(resp => {
                    this.setActivity(resp?.find(i => i.id == idactividad))
                })
            }
        } else {
            return history.replace(basePage)
        }

    }

    render() {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const item = this.state.activity;
        const { sessionsList, modal, activityNotFound } = this.state;

        if (activityNotFound) {
            return <div className='mt-5 pt-5 d-flex justify-content-center text-gray'>
                <h5>La actividad no existe o no se encuentra disponible</h5>
            </div>
        }
        if (!(item)) {
            return null
        }
        return (
            <>
                {modal && <ModalUI {...modal} />}
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div className="activity-details mb-5">
                    <div className="card">
                        <div className="card-body pr-0 pr-md-3">
                            <div className="row mb-4">
                                <div className="col-12 col-sm-9 col-md-10 col-lg-10">
                                    <h4 className="text-muted">
                                        <b>{item.nomb_acti}</b>
                                    </h4>
                                </div>
                                <div className="col text-center p-0">
                                    <button disabled={item.inscritos >= item.cupos} className="btn btn-success d-none d-sm-inline-block" onClick={() => this.subscribeMe()}>
                                        Inscribirme
                                    </button>
                                </div>
                            </div>
                            <div className="text-muted">
                                <div className="row">
                                    <div className="col-12 col-md-10">
                                        <p><span>{item.descripcion}</span></p>
                                        <p><b>Código: </b> <br /><span>{item.id}</span> </p>
                                        {/* {!!(item.horas_cert) && <p><b>Horas certificadas: </b> <br /><span>{item.horas_cert}</span> </p>} */}
                                        <p><b>Categoría: </b> <br /><span>{item.categoria}</span> </p>
                                        <div>
                                            <p className="d-sm-inline-block mr-5"><b>Inicia a partir del: <br /></b> {new Date(item.inicio).toLocaleString([], dateOptions)} </p>
                                            <p className="d-sm-inline-block"><b>Termina el: </b><br /> {new Date(item.fin).toLocaleString([], dateOptions)} </p>
                                        </div>
                                        <p><b>Ofertado por: </b> <br />{item.depart} </p>
                                    </div>
                                    <div className="col text-center mb-3 mt-3 mb-lg-0 h-100">
                                        <div className="row">
                                            <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Sesiones</b><br />
                                                <span>{item.sesiones}</span>
                                            </div>
                                            <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Cupos</b><br />
                                                <span>{item.cupos - item.inscritos}</span>
                                            </div>
                                            <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Inscritos</b><br />
                                                <span>{item.inscritos}</span>
                                            </div>
                                            <div className="pb-3 border-left col-6 col-sm-3 col-md-12">
                                                <b>Puntos</b><br />
                                                <span>{item.puntos}</span>
                                            </div>
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
                    <div className="text-center p-0">
                        <button className="mt-4 mb-4 w-100  btn btn-success d-sm-none" onClick={() => this.subscribeMe()}>
                            Inscribirme
                        </button>
                    </div>
                    <div className="mt-5">
                        <h6><b>Sesiones de la actividad: </b>  </h6>
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
    activities: state.activities.list,
    subscribed: state.activities.subscribed
})
const mapDispatchToProps = dispatch => ({
    setList: (list) => dispatch(setSubscribedActivities(list)),
    getActivitiesList: () => dispatch(getActivitiesList()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ActivityOffer);