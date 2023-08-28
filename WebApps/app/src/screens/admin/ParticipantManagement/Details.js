import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ModalUI from '../../../components/ModalUI';
import { CheckIconFill, ChevronRightIcon, WarningIconFill } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import GeneralApprobation from '../../../forms/admin/GeneralApprobation';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { BIENESTAR_GENERAL_APPROBATION, BIENESTAR_GENERAL_CANCEL_APPROBATION, RESUMEN_PARTICIPANTE } from '../../../services/endPoints';

class Details extends Component {

    constructor(props) {
        super();
        this.state = {
            resumen: null,
            modal: null,
            info: props.location.state
        }
    }

    goToBackPage = () => {
        this.props.history.goBack()
    }

    getResumen = (dni) => {
        AXIOS_REQUEST(RESUMEN_PARTICIPANTE, "POST", { dni })
            .then(resp => {
                if (resp.msg === "ERROR") {
                    throw new Error();
                }
                if (resp.data.aprobien === "") {
                    resp.data.aprobien = null;
                } else {
                    resp.data.aprobien = JSON.parse(resp.data.aprobien);
                }

                this.setState({ resumen: resp.data })
            }).catch(err => {
                this.setState({
                    resumen: false,
                })
            });
    }

    viewActivitiesList = (period) => {
        this.props.history.push({
            pathname: `/gestion-participante/actividades/${period}/${this.state.info.dni_part}`
        })
    }

    makeApprobation = () => {
        this.setState({
            modal: {
                open: true,
                type: "info",
                title: "Aprobar participante",
                alert: "Está a punto de realizar la aprobación de este participante, por favor diligencie los datos a continuación",
                closeIcon: true,
                onClosed: () => this.setState({ modal: null }),
                children: <>
                    <GeneralApprobation
                        onSubmit={this.startApprobation}
                        onCancel={() => this.setState({ modal: null })}
                    />
                </>,
                buttons: []
            }
        })
    }

    startApprobation = (data) => {
        this.setState({
            modal: null,
            loader: "Aprobando participante"
        }, () => {
            AXIOS_REQUEST(BIENESTAR_GENERAL_APPROBATION, "post", {
                dni_part: this.state.info.dni_part, ...data
            }).then(resp => {
                if (resp.msg === "ERROR") { throw new Error(); }
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "success",
                        title: "¡Muy bien!",
                        alert: "El participante ha sido aprobado",
                        onClosed: () => this.setState({ modal: null, resumen: null }, () => {
                            this.getResumen(this.state.info.dni_part)
                        }),
                        buttons: [{ color: "success", text: "Ok", close: true }]
                    }
                })
            }).catch(err => {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "danger",
                        title: "Ops...",
                        alert: "No se pudo realizar la aprobación del participante, intentelo nuevamente",
                        onClosed: () => this.setState({ modal: null }),
                        buttons: [{ color: "success", text: "Ok", close: true }]
                    }
                })
            });
        })
    }

    undoApprobation = () => {
        this.setState({
            modal: {
                open: true,
                type: "warning",
                title: "Anular aprobación",
                alert: "Está a punto de anular la aprobación de este participante",
                children: <p className="text-center">¿Está seguro de esta acción?</p>,
                closeIcon: true,
                onClosed: callback => !(callback) ? this.setState({ modal: null }) : callback(),
                buttons: [
                    { color: "info", text: "No, cancelar", close: true },
                    { color: "success", text: "Sí, continuar", click: () => this.startCancelApprobation }
                ]
            }
        })
    }

    startCancelApprobation = () => {
        this.setState({
            modal: null,
            loader: "Cancelando aprobación"
        }, () => {
            AXIOS_REQUEST(BIENESTAR_GENERAL_CANCEL_APPROBATION, "post", {
                dni_part: this.state.info.dni_part, id_aproba: this.state.resumen?.aprobien?.id_aproba
            }).then(resp => {
                if (resp.msg === "ERROR") { throw new Error(); }
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "success",
                        title: "¡Muy bien!",
                        alert: "Se ha cancelado la aprobación del participante",
                        onClosed: () => this.setState({ modal: null, resumen: null }, () => {
                            this.getResumen(this.state.info.dni_part)
                        }),
                        buttons: [{ color: "success", text: "Ok", close: true }]
                    }
                })
            }).catch(err => {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "danger",
                        title: "Ops...",
                        alert: "No se pudo realizar la cancelación de aprobación, intentelo nuevamente",
                        onClosed: () => this.setState({ modal: null }),
                        buttons: [{ color: "success", text: "Ok", close: true }]
                    }
                })
            });
        })
    }

    componentDidMount() {
        const { dni } = this.props.match.params;
        if (!(dni) || dni !== this.props.location.state?.dni_part) {
            this.goToBackPage();
        } else {
            this.getResumen(dni)
        }
    }

    render() {
        const { info, resumen, loader, modal } = this.state;
        return (
            <>
                <ModalUI open={modal?.open || false} {...modal} />
                <Loader open={!!(loader)}>{loader}</Loader>
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Información del participante</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>

                <div>
                    {info && <div className="card border-0 mb-4">
                        <div className="card-body">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p className="mr-3">
                                    <small><b>Nombre:</b></small><br />
                                    <span>{info.nomb_part} {info.apel_part}</span>
                                </p>
                                <p className="mr-3">
                                    <small><b>Identificación:</b></small><br />
                                    <span>{info.dni_part}</span>
                                </p>
                                <p className="mr-3">
                                    <small><b>Correo:</b></small><br />
                                    <a href={`mailto:${info.email_part}`}>{info.email_part}</a>
                                </p>
                                <p className="">
                                    <small><b>Tipo de usuario:</b></small><br />
                                    <span>{info.rol_part}</span>
                                </p>
                            </div>
                            <div className="d-flex flex-wrap">
                                <p className="mr-4">
                                    <small><b>Programa:</b></small><br />
                                    <span>{info.programa}</span>
                                </p>
                            </div>
                        </div>
                    </div>}

                    {resumen === false ?
                        <div className="alert alert-danger mb-5 mt-5">No se pudo obtener los demás detalles del participante, intentelo en otro momento</div>
                        :
                        resumen !== null ? <>
                            <div className="card mb-4 border-0">
                                <div className="card-body">
                                    {!(resumen.aprobien) ?
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <div className="mb-3">
                                                    <small><b>Estado de bienestar institucional:</b></small>
                                                </div>
                                                <p className="text-warning ">
                                                    <WarningIconFill size={30} /><b className="ml-2 text-muted">Sin aprobar</b>
                                                </p>
                                                {resumen.apruebabienestar === "True" && <button className="btn btn-info btn-sm" onClick={() => this.makeApprobation()}>Realizar aprobación</button>}
                                            </div>
                                            <div>
                                                <p className="mr-4">
                                                    <small><b>Horas acumuladas:</b></small><br />
                                                    <span>{resumen.totalhoras || "00:00:00"}</span>
                                                </p>
                                                <p className="mr-4">
                                                    <small><b>Puntos acumulados:</b></small><br />
                                                    <span>{resumen.puntosacum} puntos</span>
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <div className="mb-3">
                                                    <small><b>Estado de bienestar institucional:</b></small>
                                                </div>
                                                <div className="d-flex align-items-center mb-4">
                                                    <div className="mr-3 text-success">
                                                        <CheckIconFill size={40} />
                                                    </div>
                                                    <div>
                                                        <span className="text-muted"><b>Aprobado</b> <br /> {new Date(resumen.aprobien.marc_temp).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</span>
                                                    </div>
                                                </div>
                                                <p className="mr-4">
                                                    <small><b>Horas acumuladas:</b></small><br />
                                                    <span>{resumen.totalhoras}</span>
                                                </p>
                                                <p className="mr-4">
                                                    <small><b>Puntos acumulados:</b></small><br />
                                                    <span>{resumen.puntosacum} puntos</span>
                                                </p>
                                            </div>
                                            <div className="col border-left">
                                                <div className="">
                                                    <p>
                                                        <small><b>Aprobado por:</b></small><br />
                                                        {resumen.aprobien.name_creador}
                                                    </p>
                                                    <p>
                                                        <small><b>Tipo de aprobación:</b></small><br />
                                                        {resumen.aprobien.tipo_aprob}<br />
                                                    </p>
                                                    <p>
                                                        <small><b>Observación:</b></small><br />
                                                        {resumen.aprobien.obser_aproba}
                                                    </p>
                                                </div>
                                                {resumen.apruebabienestar === "True" && <button className="btn btn-danger btn-sm" onClick={() => this.undoApprobation()}>Anular aprobación</button>}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="card border-0 mb-4">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small><b>Histórico de actividades por periodo:</b></small>
                                    </div>
                                    <div className="row">
                                        {!(resumen.actperiodo.length) ?
                                            <span className="ml-3">No tiene nada para mostrar</span>
                                            : resumen.actperiodo.map((p, i) => <div className="col-6 col-sm-4 col-md-3 col-xl-2 mb-4" key={i}>
                                                <div className="card border border-light shadow-none zoom-hover-in" onClick={() => this.viewActivitiesList(p.periodo)}>
                                                    <div className="card-body text-center">
                                                        <span>
                                                            <b className=" pr-4 pl-4 pt-1 pb-1 rounded-pill">{p.actividades}</b>
                                                            <br />
                                                            <small>Actividades</small>
                                                        </span>
                                                        <hr />
                                                        <h5 className="text-gray">{p.periodo}</h5>
                                                    </div>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-5"><Link to="/historicos">Buscar actividades en bases de datos antiguas</Link></p>
                        </>
                            :
                            <Loader2 open>Consultando detalles</Loader2>
                    }
                </div>
            </>
        );
    }
}

export default Details;