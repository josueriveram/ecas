import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Spinner, UncontrolledCollapse } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import { WarningIconFill, XCloseIconFill, CheckIconFill, CheckIcon, XCloseIcon, WarningIcon, Award, ShieldFillCheck, ShieldFillWarning } from '../../../components/UI/Icons';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ACTIVIDADES_EVALUAR_POST, ACTIVIDADES_HISTORIAL_DETALLE, CERTIFICADO_NUEVO, GUARDAR_ADDRESS, REVOKE_OWN_CERTIFICATE, UPDATE_USER_NAME } from '../../../services/endPoints';
import Sessions from './Sessions';
import StarRatings from 'react-star-ratings';
import "./index.css";
import { getUserStatus, setUserInfo } from '../../../store/user/actions/userAction';
import { UpdateName } from '../../../forms/user/UpdateName';
import { WALLET_URL } from '../../../services/constants';

const basePage = "/historial";

class ActivityHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            sessionsList: null,
            modal: null,
            calification: null,
            loader: null
        }
    }

    getSessionsList = id => {
        let url = this.props.url + id || ACTIVIDADES_HISTORIAL_DETALLE + id;
        return AXIOS_REQUEST(url).then(resp => {
            let activitySessions = <Sessions list={resp.data} statusCallback={this.getSesionStatus} />
            this.setState({
                sessionsList: <div className="list-group">{activitySessions}</div>
            })
        })
    }

    calification = () => {
        document.getElementById("calification-container").scrollIntoView({ behavior: "smooth" });
    }

    setCalificationNumber = (n) => {
        const comment = createRef()
        this.setState({
            // calification: { stars: n },
            modal: {
                open: true,
                // type: "info",
                size: "md",
                title: "Calificación",
                onClosed: (callback) => {
                    if (!!(callback)) {
                        callback(n, comment.current.value);
                    } else {
                        this.setState({ modal: null, calification: null })
                        // setTimeout(()=>{
                        //     this.setState({ calification: null })
                        // }, 1000)
                    }
                },
                children: <>
                    <div className="text-center mb-4">
                        <StarRatings
                            starRatedColor="#ff9400"
                            rating={n}
                            numberOfStars={5}
                            name='rated'
                            starDimension={35}
                            starSpacing={0}
                        />
                    </div>
                    <p className="text-center">¿Te gustaría añadir un comentario?</p>
                    <div className="form-group">
                        <textarea type="email" className="form-control" id="comment" ref={comment} aria-describedby="emailHelp" rows="4" />
                    </div>
                </>,
                buttons: [
                    { text: "Cerrar", color: "danger", close: true },
                    {
                        text: "Enviar", click: () => this.sendRating, color: "primary"
                    }
                ]
            }
        })
    }

    finishUpdateName = (data) => {
        this.setState({ modal: null, loader: "Actualizando nombre" }, () => {
            AXIOS_REQUEST(UPDATE_USER_NAME, "POST", data)
                .then(resp => {
                    if (resp.data !== "1") {
                        throw new Error(resp)
                    }
                    const { aprobacion: { id_aproba } } = this.state.activity;

                    AXIOS_REQUEST(REVOKE_OWN_CERTIFICATE, "POST", {
                        id_aproba
                    }).then(resp => {
                        this.submitRequestCertification(id_aproba).then(resp => {
                            const user = { ...this.props.userInfo, nombre: data.nombres, apellido: data.apellidos };
                            this.props.setUserInfo({ user });
                        })
                    })
                })
                .catch(err => {
                    this.setState({
                        modal: {
                            open: true,
                            type: "danger",
                            title: "Ops...",
                            onClosed: () => this.setState({ modal: null }),
                            size: "sm",
                            children: <p className="text-center">{err.msg || "No se pudo actualizar, por favor intente nuevamente"}</p>,
                            buttons: [{ text: "OK", close: true, color: "success" }]
                        },
                        loader: null
                    })
                })
        })
    }

    updateName = () => {
        this.setState({
            modal: {
                open: true,
                size: "md",
                title: "Actualizar certificado",
                onClosed: (callback) => {
                    if (!!(callback)) {
                        callback();
                    } else {
                        this.setState({ modal: null })
                    }
                },
                children: <>
                    <p className="text-center mt-4 mb-5">Si el nombre que aparece en el certificado es incorrecto por favor corrijalo, tenga en cuenta que este será el nuevo nombre de usuario</p>
                    <div>
                        <UpdateName defaultData={{
                            nombres: this.props.userInfo.nombre,
                            apellidos: this.props.userInfo.apellido,
                        }} onSubmit={this.finishUpdateName} />
                    </div>
                </>,
                buttons: [
                    { text: "Cancelar", color: "danger", close: true },
                    {
                        text: "Listo, actualizar", click: () => () => document.getElementById("submitnewnamebtn").click(), color: "primary"
                    }
                ]
            }
        })
    }

    sendRating = (stars, comment) => {
        this.setState({
            calification: { stars, comment },
            modal: null,
            loader: "Enviando tu calificación"
        })
        AXIOS_REQUEST(ACTIVIDADES_EVALUAR_POST, "post", {
            comentario: comment,
            puntaje: stars,
            idactividad: this.state.activity.id
        }).then(resp => {
            this.setState({ loader: null })
        })
    }

    getSesionStatus = status => {
        let icon = null;
        switch (status.toLowerCase()) {
            case "asistió":
                icon = <div className="text-success"><CheckIconFill size={21} /></div>
                break;
            case "no asistió":
                icon = <div className="text-danger"><XCloseIconFill size={21} /></div>
                break;
            case "inscrito":
                icon = <div className="text-warning"><WarningIconFill size={21} /></div>
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

    getActivityStatus = (status, points, comment) => {
        let icon = null;
        let pts = null;
        switch (status.aprobado) {
            case 1:
                status = { ...status, nombestado: "Aprobado" };
                icon = <div className="text-success mb-2"><CheckIcon size={50} /></div>
                pts = <div className="text-success"><b><big>+ {points}</big> Puntos</b></div>
                break;
            case 0:
                status = { ...status, nombestado: "No aprobado" };
                icon = <div className="text-danger mb-2"><XCloseIcon size={50} /></div>
                pts = <div className="text-muted"><b>{comment}</b></div>
                break;
            default:
                status = { nombestado: "Pendiente" };
                icon = <div className="text-warning mb-2"><WarningIcon size={50} /></div>
                pts = <div className="text-muted"><b>Sumarías {points} puntos</b></div>
                break;
        }
        return <div className="text-center text-muted row pb-3 mb-md-3 align-items-center pt-md-3" style={{ borderRadius: "10px" }}>
            <div className="col-12 text-left text-md-center mb-3">
                <b>Estado <span className="d-md-none">de la actividad:</span></b>
            </div>
            <div className="col col-md-12">
                {icon}
                <b >{status.nombestado}</b>
            </div>
            <div className="col col-md-12">
                <hr className="d-md-block d-none" />
                {pts}
            </div>
            {!!(this.state.activity.horasacumuladas) && <div className="col col-md-12">
                <div className="text-success mt-md-3"><b><big>+ {this.state.activity.horasacumuladas.replace(/^(\d+):(\d+):.*/, "$1:$2")}</big> Horas</b></div>
            </div>}
        </div>
    }

    protectCertificate = () => {
        this.setState({
            modal: {
                open: true,
                type: "info",
                closeIcon: true,
                size: "lg",
                unmountOnClose: true,
                title: "Proteger certificado",
                onClosed: (callback) => {
                    if (!!(callback)) {
                        callback();
                    } else {
                        this.setState({ modal: null })
                    }
                },
                children: <>
                    <p>Proteger tu certificado significa manterlo seguro y que se mantenga válido de forma permanente.</p>
                    <div className="mt-4 mb-3"><b className="pl-3 pt-1 pb-1 pr-3 bg-success rounded-pill text-white">PASO 1</b></div>
                    <p>Debes dar click en el enlace <a href={WALLET_URL} target="_blank"><b>Iniciar protección</b></a>, el cual te llevará a nuestra wallet (Billetera digital) para que sigas las indicaciones y obtengas tu cuenta donde se mantendran tus certificados.</p>
                    <p>¡El proceso es sencillo, rápido y solo tendrás que hacerlo una única vez!</p>
                    <div className="mt-4 mb-3"><b className="pl-3 pt-1 pb-1 pr-3 bg-success rounded-pill text-white">PASO 2</b></div>
                    <p>Luego de haber seguido las indicaciones de la wallet deberás dar click en el botón "<b>Finalizar</b>" y así podrás proteger este y todos los certificados que consigas.</p>
                    <br />
                </>,
                buttons: [
                    { text: "Cerrar", color: "danger", close: true },
                    { text: "Finalizar", click: () => this.submitRequestProtection, color: "primary" }
                ]
            }
        })
    }

    submitRequestProtection = () => {
        if (!!(window.ethereum)) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
                let address = accounts[0];
                this.props.getUserStatus(address);
                this.setState({
                    loader: "Verificando cuenta"
                })
                AXIOS_REQUEST(GUARDAR_ADDRESS, "POST", { address }).then(resp => {
                    if (resp.data === "1") {
                        this.requestCertification(address);
                    }
                })
            }).catch(err => {
                // console.log({ err });
            })
        } else {
            this.setState({
                modal: {
                    open: true,
                    type: "warning",
                    closeIcon: true,
                    size: "md",
                    unmountOnClose: true,
                    title: "Espera",
                    onClosed: (callback) => {
                        this.setState({ modal: null })
                    },
                    children: <>
                        <p className="text-center">Abre la extención de Metamask y conecta tu cuenta para poder continuar</p>
                    </>,
                    buttons: [
                        { text: "Ok", color: "success", close: true },
                    ]
                }
            })
        }
    }

    requestCertification = (address = this.props.userStatus?.address) => {
        const { aprobacion: { id_aproba } } = this.state.activity;
        if (!!(address)) {
            this.submitRequestCertification(id_aproba, address);
        } else {
            const { nombre, apellido, dni } = this.props.userInfo;
            this.setState({
                modal: {
                    open: true,
                    type: "info",
                    closeIcon: true,
                    size: "lg",
                    title: "Certificado de participación",
                    onClosed: (callback) => {
                        if (!!(callback)) {
                            callback(id_aproba);
                        } else {
                            this.setState({ modal: null })
                        }
                    },
                    children: <>
                        <p>El certificado será generado con los siguientes datos:</p>
                        <div className="row">
                            <div className="col col-md-6">
                                <p><small><b>Nombre:</b></small><br /><span>{nombre} {apellido}</span></p>
                            </div>
                            <div className="col col-md-6">
                                <p><small><b>Identificación:</b></small><br /><span>{dni}</span></p>
                            </div>
                        </div>
                        {["7", "3", "4", "6"].includes(this.props.userInfo.rol) && <p className='mt-3'><small><span className='btn-link cursor-pointer' onClick={() => this.updateName()}>¿El nombre es incorrecto?</span></small></p>}
                    </>,
                    buttons: [
                        { text: "Cerrar", color: "danger", close: true },
                        {
                            text: "Generar", click: () => this.submitRequestCertification, color: "primary"
                        }
                    ]
                }
            })
        }
    }

    submitRequestCertification = (id_aproba, address = this.props.userStatus?.address) => {
        this.setState({ loader: <span>Generando certificado<br />Puede tardar unos minutos</span> })
        let data = { idaprobacion: id_aproba }
        if (!!(address)) { data.ethaddress = address }
        return AXIOS_REQUEST(CERTIFICADO_NUEVO, "POST", data).then(resp => {
            if (resp.msg === "ERROR") {
                throw new Error(resp.data.error)
            } else {
                this.setState({
                    activity: { ...this.state.activity, aprobacion: { ...this.state.activity.aprobacion, file: resp.data.File, protegido: 1 } },
                    loader: null
                });
                window.open(resp.data.File, "_blank")
                return true;
            }
        }).catch(err => {
            this.setState({
                modal: {
                    open: true,
                    type: "danger",
                    title: "Ops...",
                    onClosed: () => this.setState({ modal: null }),
                    size: "sm",
                    children: <p className="text-center">{err.message}</p>,
                    buttons: [{ text: "OK", close: true, color: "success" }]
                },
                loader: null
            }); return true;
        })
    }

    componentDidMount() {
        let { match: { params: { idactividad } }, location: { state }, history, activities } = this.props
        let activity = null;
        if (!!(state)) {
            activity = state;
        } else if (!!(idactividad) && activities[this.props.selectedPeriod]?.length > 0) {
            activity = activities[this.props.selectedPeriod][idactividad]
        } else {
            return history.replace(basePage)
        }
        let aprobacion = !!(activity.aprobacion) ? JSON.parse(activity.aprobacion) : {};
        this.setState({ activity: { ...activity, aprobacion }, calification: { stars: activity.calificacion } })
        this.getSessionsList(activity.id);
    }

    render() {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const item = this.state.activity;
        const { sessionsList, modal, calification, loader } = this.state;

        if (!(item)) {
            return null
        }
        return (
            <>
                {modal && <ModalUI {...modal} />}
                <Loader open={!!(loader)} color="warning">{loader}</Loader>
                <div className="activity-details mb-5">
                    <div className="card">
                        <div className="card-body pr-0 pr-md-3">
                            <div className="row mb-4">
                                <div className="col-12 col-sm-8 col-md-9 col-lg-10">
                                    <h4 className="text-muted">
                                        <b>{item.nomb_acti}</b>
                                    </h4>
                                </div>
                                {!(this.props.hideStarsRating) && calification === null &&
                                    <div className="col text-center p-0">
                                        <button className="btn btn-primary d-none d-sm-inline-block" onClick={() => this.calification()}>
                                            Calificar actividad
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="text-muted">
                                <div className="row flex-column-reverse flex-md-row">
                                    <div className="col-12 col-md-9 col-lg-10">
                                        <p><span>{item.descripcion}</span></p>
                                        <p><b>Código: </b> <br /><span>{item.id}</span> </p>
                                        <p><b>Categoría: </b> <br /><span>{item.categoria}</span> </p>
                                        <div>
                                            <p className="d-sm-inline-block mr-5"><b>Inició a partir del: <br /></b> {new Date(item.inicio).toLocaleString([], dateOptions)} </p>
                                            <p className="d-sm-inline-block"><b>Terminó el: </b><br /> {new Date(item.fin).toLocaleString([], dateOptions)} </p>
                                        </div>
                                        <p><b>Ofertado por: </b> <br />{item.depart} </p>
                                    </div>
                                    <div className="col text-center">
                                        {this.getActivityStatus(item.aprobacion, item.puntos, item.comentario)}
                                    </div>
                                    {/* <p className="col-12 mb-3 mt-3">
                                        <div className="mr-2 d-inline-block">
                                            <b>Inscritos</b><br />
                                            <span>{item.inscritos}</span>
                                        </div>
                                        <div className="mr-2 d-inline-block">
                                            <b>puntos</b><br />
                                            <span>{item.puntos}</span>
                                        </div>
                                    </p> */}
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
                    {!(this.props.hideStarsRating) && calification === null &&
                        <div className=" text-center p-0">
                            <button className="mt-4 mb-4 w-100 btn btn-primary d-sm-none" onClick={() => this.calification()}>
                                Calificar actividad
                            </button>
                        </div>
                    }
                    <div className="mt-5 mb-5">
                        <h6><b>Sesiones de la actividad: </b> {item.sesiones}</h6>
                        <div>
                            {sessionsList || <div className="d-flex  align-items-center justify-content-center mt-3 mb-3 flex-column"><Spinner />Consultando sesiones</div>}
                        </div>
                    </div>
                    {item.certificable === 1 && item.aprobacion.aprobado === 1 && <div className="mb-5 card">
                        <div className="card-body">
                            <div>
                                <b><span className="mr-2 text-muted"><Award size={20} /></span>Certificado de participación: </b>
                                {!!(item.aprobacion.file) ? <>
                                    <a target="_blank" href={item.aprobacion.file} className="mt-3 mt-sm-0 btn btn-primary rounded btn-sm ml-2">Ver certificado</a>
                                    {["7", "3", "4", "6"].includes(this.props.userInfo.rol) && <p className='mt-3'><small><span className='btn-link cursor-pointer' onClick={() => this.updateName()}>Actualizar certificado</span> con nombre correcto</small></p>}
                                    <div>
                                        {!!(WALLET_URL) &&
                                            (item.aprobacion.protegido === 1 ?
                                                <div className="mt-3">
                                                    <span className=" rounded-pill text-success"><ShieldFillCheck size={20} /> <b className="pt-1">Certificado protegido</b></span>
                                                </div>
                                                :
                                                <div className="mt-3">
                                                    <span className=" rounded-pill text-danger"><ShieldFillWarning size={20} /> <b className="pt-1">Certificado sin protección</b></span>
                                                    {!(this.props.hideStarsRating) && <span className="d-block"><small>Su certificado no se encuentra protegido, <button className="btn btn-link btn-sm p-0" onClick={this.protectCertificate}>PROTEJALO</button> para evitar su pérdida y validez</small></span>}
                                                </div>
                                            )}
                                    </div>
                                </> : !(this.props.hideStarsRating) &&
                                <button className="mt-3 mt-sm-0 btn btn-primary rounded btn-sm ml-2" onClick={() => this.requestCertification()}>Solicitar certificado</button>
                                }
                            </div>
                        </div>
                    </div>}
                    <div >
                        <button className="btn btn-info rounded btn-sm" id="aprob_button">¿Cómo se aprobó esta actividad?</button>
                        <UncontrolledCollapse toggler={`#aprob_button`}>
                            <div className="card mt-3">
                                <div className="card-body d-block">
                                    <b>{item.tipo_aprob}</b><br />
                                    <i>{item.tipo_aprob_desc}</i>
                                </div>
                            </div>
                        </UncontrolledCollapse>
                    </div>
                </div>
                {!(this.props.hideStarsRating) && <div className="mb-5 text-center" id="calification-container">
                    <h5>{!(calification?.stars) ? "¿Cómo calificarías esta actividad?"
                        : "Calificación que le diste a esta actividad"}</h5>
                    <StarRatings
                        starRatedColor="#ff9400"
                        starHoverColor="#ff9400"
                        rating={calification?.stars}
                        changeRating={!(calification?.stars) ? this.setCalificationNumber : null}
                        numberOfStars={5}
                        name='rating'
                    />
                </div>}
            </>
        );
    }
}
const mapStateToProps = state => ({
    activities: state.activities.history,
    selectedPeriod: state.activities.selectedPeriod,
    userStatus: state.user.userStatus,
    userInfo: state.user.userInfo
})

const mapDispatchToProps = dispatch => ({
    getUserStatus: () => dispatch(getUserStatus()),
    setUserInfo: (data) => dispatch(setUserInfo(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityHistory);