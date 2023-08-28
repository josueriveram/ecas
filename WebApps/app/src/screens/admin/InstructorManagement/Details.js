import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { Button } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import { ChevronRightIcon, PencilSquare } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import Switch from '../../../components/UI/Switch';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ASSOC_DEPARTMENT_INSTRUCTOR, ENABLE_DISABLE_INSTRUCTOR, RESUMEN_INSTRUCTOR } from '../../../services/endPoints';
import NewInstructor from './../../../forms/admin/NewInstructor';

class Details extends Component {

    constructor(props) {
        super();

        if (!(props.location?.state?.info)) {
            props.history.replace("/gestion-instructores")
        }

        this.state = {
            modal: null,
            loader: null,
            loader2: null,
            info: props.location?.state?.info || {},
            editDepartments: false,
            resumen: null,
        }
    }

    goToBackPage = () => this.props.history.goBack();

    toggleEnable = (status, cancelCallback) => {
        this.setState({
            loader: "Cambiando estado del instructor",
            modal: null
        }, () => {
            const { dni_admin } = this.state.info;
            AXIOS_REQUEST(ENABLE_DISABLE_INSTRUCTOR, "post", { dni_admin, enabled: status ? 1 : 0, idtipo: "3" })
                .then(resp => {
                    if (resp.error || resp.msg === "ERROR") { throw new Error() }
                    this.setState({
                        loader: null,
                        modal: null
                    })
                }).catch(err => {
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "danger",
                            title: "Ops...",
                            alert: "No se pudo cambiar el estado, intente nuevamente",
                            onClosed: () => {
                                this.setState({ modal: null }, cancelCallback)
                            },
                            buttons: [
                                { text: "Ok", color: "success", close: true },
                            ]
                        }
                    })
                })
        })
    }

    confirmToggleEnable = (status, cancelCallback) => {
        this.setState({
            modal: {
                open: true,
                size: "sm",
                type: "question",
                title: "¿Está seguro?",
                alert: "El estado del instructor se cambiará",
                onClosed: (submit) => {
                    if (!!(submit)) {
                        submit(status, cancelCallback);
                    } else {
                        this.setState({ modal: null }, cancelCallback)
                    }
                },
                buttons: [
                    { text: "No, cancelar", color: "info", close: true },
                    { text: "Si, modificar", color: "success", click: () => this.toggleEnable },
                ]
            }
        })
    }

    getResumen = () => {
        this.setState({ loader: "consultando detalles" }, () => {
            AXIOS_REQUEST(RESUMEN_INSTRUCTOR, "post", { dni: this.state.info.dni_admin })
                .then(resp => {
                    if (resp.msg === "ERROR") { throw new Error() }
                    resp.data.departamentos = resp.data.departamentos.map(d => ({ value: d.iddepart, label: d.nombdepart }));
                    let departamentos_chequeables = this.props.location?.state?.departments;
                    let departamentos_seleccionados = [];
                    departamentos_chequeables.forEach(d => {
                        let idx = resp.data.departamentos.findIndex(e => d.value === e.value)
                        if (idx >= 0) {
                            departamentos_seleccionados.push(`${d.value}`);
                            resp.data.departamentos.splice(idx, 1);
                        }
                    });

                    resp.data.departamentos_chequeables = departamentos_chequeables;
                    resp.data.departamentos_seleccionados = departamentos_seleccionados;

                    if (!!(resp.data.evalpromedio)) {
                        resp.data.evalpromedio = Number(Number(resp.data.evalpromedio).toFixed(1));
                    }
                    this.setState({ loader: null, resumen: resp.data });
                }).catch(err => {
                    this.setState({
                        resumen: false,
                        loader: null,
                        modal: {
                            open: true,
                            type: "danger",
                            title: "Ops...",
                            alert: "No se pudo obtener la información del instructor, intentelo más tarde",
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            buttons: [
                                { text: "Ok", color: "success", close: true },
                            ]
                        }
                    })
                })
        })
    }

    viewActivitiesList = periodo => {
        this.props.history.push({
            pathname: `/gestion-instructores/historico/${periodo}/${this.state.info.dni_admin}`
        })
    }

    updateDepartments = (data) => {
        let codi_depart = [...data.codi_depart_onlyread, ...(data?.codi_depart || [])].join(",");
        this.setState({ loader: "Asociando departamentos" }, () => {
            AXIOS_REQUEST(ASSOC_DEPARTMENT_INSTRUCTOR, "post", { dni_admin: this.state.info.dni_admin, codi_depart })
                .then(resp => {
                    // this.savedInstructor = false;
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: resp.msg === "ERROR" ? "danger" : "success",
                            title: resp.msg === "ERROR" ? "Ops..." : "¡Muy bien!",
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            alert: resp.msg === "ERROR" ? "No se pudo actualizar los departamentos del instructor"
                                : `Se han actualizado los departamentos`,
                            buttons: [{ text: "Ok", color: "success", close: true }]
                        }
                    }, () => {
                        this.setState({ editDepartments: !this.state.editDepartments })
                    })
                })
        });
    }

    componentDidMount() {
        this.getResumen();
    }

    render() {
        const { info, resumen, editDepartments } = this.state;
        return (
            <>
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Información del instructor</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>

                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <Loader2 open={!!(this.state.loader2)} color="warning">{this.state.loader2}</Loader2>

                <div>
                    <div className="card border-0 mb-4">
                        <div className="card-body">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p>
                                    <small><b>Nombre:</b></small><br />
                                    <span>{info.nombres}</span>
                                </p>
                                <p>
                                    <small><b>Identificación:</b></small><br />
                                    <span>{info.dni_admin}</span>
                                </p>
                                <p>
                                    <small><b>Correo:</b></small><br />
                                    <a href={`mailto:${info.correo}`}>{info.correo}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    {resumen === false ?
                        <div className="alert alert-danger mb-5 mt-5">No se pudo obtener los demás detalles del instructor, intentelo en otro momento</div>
                        :
                        resumen !== null && <>
                            <div className="card border-0 mb-4">
                                <div className="card-body">
                                    <div className="mb-4">
                                        <small><b>Departamentos asociados:</b></small>
                                        <Button
                                            size="sm"
                                            active={editDepartments}
                                            className="rounded-pill float-right"
                                            // color={edit.includes(idx) ? "warning" : "light"}
                                            color={"light"}
                                            onClick={() => { this.setState({ editDepartments: !editDepartments }) }}
                                        >
                                            <PencilSquare /> <small className="ml-1">{editDepartments ? "Cancelar " : "Editar"}</small>
                                        </Button>
                                    </div>
                                    {!(resumen.departamentos.length) && !(resumen.departamentos_chequeables.length) ?
                                        <p><b className="text-gray mt-4">No se encuentra asociado en ningún departamento</b></p>
                                        :
                                        <div className="mt-3">
                                            <NewInstructor
                                                disabled={!editDepartments}
                                                defaultData={{
                                                    codi_depart: resumen.departamentos_seleccionados,
                                                    codi_depart_onlyread: resumen.departamentos.map(d => d.value)
                                                }}
                                                btnText={"Actualizar"}
                                                onSubmit={this.updateDepartments}
                                                departmentsList={resumen.departamentos_chequeables}
                                                departmentsList_onlyread={resumen.departamentos}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="card border-0 mb-5">
                                <div className="card-body">
                                    <div className="mb-5">
                                        <div className="mb-2">
                                            <small><b>Calificación promedio:</b> <span>{!!(resumen.evalpromedio) ? resumen.evalpromedio : "Sin calificaciones"}</span></small>
                                        </div>
                                        <StarRatings
                                            rating={!!(resumen.evalpromedio) ? resumen.evalpromedio : 0}
                                            numberOfStars={5}
                                            starSpacing="2px"
                                            starRatedColor={"#ff9400"}
                                            starDimension="40px"
                                        />
                                    </div>
                                    <div>
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
                            </div>
                        </>
                    }

                    <div className="mb-5">
                        <Switch
                            onToggle={(data, callback) => {
                                this.confirmToggleEnable(data, () => { callback(!data) })
                            }}
                            // disabled
                            checked={info.enabled}
                            className="d-flex align-items-center"
                            onLabel="Activo"
                            offLabel="Inactivo"
                        >Estado:</Switch>
                    </div>

                    <p className="mb-5"><Link to="/historicos">Buscar actividades en bases de datos antiguas</Link></p>

                </div>
            </>
        );
    }
}

export default Details;