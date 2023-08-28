import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, UncontrolledTooltip } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { INS_APROBACION, INS_AUTOAPROBACION, INS_PARTICIPANTES_APROB } from '../../services/endPoints';
import ModalUI from '../ModalUI';
import { CheckIconFill, InfoIcon, Search, XCloseIconFill } from '../UI/Icons';
import Loader, { Loader2 } from '../UI/Loader';
import { CustomInput } from 'reactstrap';
import { exportToSpreadsheet } from './../../services/xlsxService';

class ParticipantsApprovations extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listP: null,
            loader: null,
            loader2: null,
            approbated: null,
            queryFilter: ""
        }
        this.originalParticipantsData = [];
    }

    componentDidMount() {
        this.setState({ loader2: "Consultando participantes" })
        this.getParticipants();
    }

    getParticipants = () => {
        AXIOS_REQUEST(INS_PARTICIPANTES_APROB, "POST", { idactividad: this.props.activity.id }).then(resp => {
            this.setState({
                loader2: null,
                listP: resp.data || [],
                approbated: resp.data?.reduce((p, c) => c.aprobad ? ++p : p, 0)
            });
            this.originalParticipantsData = resp.data;
            if (!!(this.props.actionButtonId)) {
                document.getElementById(this.props.actionButtonId).addEventListener("click", this.saveData)
            }
        })
    }

    filterList = (queryFilter) => {
        this.setState({ queryFilter: queryFilter.trim() })
    }

    setParticipantApprobation = (index, status) => {
        let listP = this.state.listP;
        listP[index].aprobad = status;
        this.setState({ listP })
    }

    onSuccessApprobation = (callback, data) => {
        this.setState({
            approbated: data.reduce((p, { Result, Aprobado }) => Aprobado === "1" && Result === "1" ? ++p : p, 0),
            loader: null,
            modal: {
                type: "success",
                title: "¡Muy bien!",
                size: "md",
                alert: "Se han registrado las aprobaciones de la actividad correctamente",
                children: this.props.activity.tieneaprob || <p className="text-center">A partir de este momento la actividad será movida a la sección de <Link to="/historial">Historial</Link></p>,
                open: true,
                onClosed: () => {
                    !!(callback) && callback(this.props.activity)
                    this.setState({ modal: null })
                },
                buttons: [{ text: "Ok", color: "success", close: true }]
            }
        })
    }

    onFailApprobation = () => {
        this.setState({
            loader: null,
            modal: {
                type: "danger",
                title: "Ops...",
                size: "sm",
                alert: "No se pudieron guardar las aprobaciones, por favor intentelo nuevamente",
                open: true,
                onClosed: () => {
                    this.setState({ modal: null })
                },
                buttons: [{ text: "Ok", color: "success", click: () => { } }]
            }
        })
    }

    automaticApprobation = () => {
        const { activity, onSuccess } = this.props;
        this.setState({
            loader: "Realizando aprobación automática",
        })
        AXIOS_REQUEST(INS_AUTOAPROBACION, "POST", { idactividad: activity.id }).then(resp => {
            if (resp.msg === "ERROR") {
                throw new Error();
            } else {
                this.getParticipants();
                this.onSuccessApprobation(onSuccess, resp.data)
            }
        }).catch(e => this.onFailApprobation())
    }

    saveData = () => {
        const { session: { registasist }, activity, onSuccess } = this.props;
        let data = this.state.listP.map(p => ({
            idact: activity.id,
            dnipart: p.dni_part,
            aprobado: !!(p.aprobad) ? 1 : 0,
        }));

        let filter = -1;
        if (registasist === "1") {
            filter = data.filter((p, i) => (p.aprobado !== this.originalParticipantsData[i].aprobad)).length;
        }

        if (filter === -1 || filter > 0) {
            this.setState({
                loader: "Guardando aprobación",
            })

            AXIOS_REQUEST(INS_APROBACION, "POST", data).then(resp => {
                if (resp.msg === "ERROR") {
                    throw new Error();
                } else {
                    this.onSuccessApprobation(onSuccess, resp.data)
                }
            }).catch(e => this.onFailApprobation())
        }

    }

    printParticipant = (p, i) => <tr key={p.dni_part} className="cursor-pointer">
        <td scope="row">{p.dni_part}</td>
        <td>
            <span className="d-block d-lg-inline-block pr-lg-2">{p.nomb_part} {p.apel_part}</span>
            <a href={`mailto:${p.email_part}`}><small>{p.email_part}</small></a>
        </td>
        <td className="border-left text-center">{p.asistencia}</td>
        <td className="text-center">{p.con_excusa}</td>
        <td className="text-center">{p.inasistencia}</td>
        <td className="text-center border-left" onClick={e => {
            !(this.props.onlyRead) && this.setParticipantApprobation(i, !(p.aprobad))
        }}>
            <div className="custom-control custom-checkbox" style={{ zIndex: 0 }}>
                <input type="checkbox" className="custom-control-input" id={"chk" + p.email_part}
                    checked={!!(p.aprobad)}
                    disabled={!!(this.props.onlyRead)}
                    onChange={e => {
                        e.stopPropagation()
                        this.setParticipantApprobation(i, !(p.aprobad))
                    }}
                />
                <label className="custom-control-label" htmlFor={"chk" + p.email_part}></label>
            </div>
        </td>
    </tr>

    downloadList = () => {
        this.setState({ loader: "Generando archivo" }, () => {
            let list = this.state.listP.map(({ tienecertificado, sesiones, aprobad, ...i }) => ({ ...i, aprobado: aprobad ? "SI" : "NO" }))
            exportToSpreadsheet(list, `Participantes de actividad ${this.props.activity.id}`)
                .then(respSheet => {
                    setTimeout(() => {
                        this.setState({ loader: null });
                    }, 5000)
                })
        });
    }

    render() {
        if (!!(this.state.loader2)) {
            return <Loader2 open>{this.state.loader2}</Loader2>
        }
        const { queryFilter, listP, modal, loader, approbated } = this.state;
        return (
            <>
                <ModalUI open={modal?.open || false} {...modal} />
                <Loader open={!!(loader)} color="warning">{loader}</Loader>
                {listP?.length > 0 && (this.props.showAutoapprobation || !(this.props.activity.tieneaprob) && !(this.props.onlyRead)) &&
                    <div className="card border-0 mb-5">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-md-8 col-xl-9 d-flex align-items-center">
                                    <span>Puede realizar la aprobación de los participantes de forma automática, el sistema lo hará teniendo en cuenta el número de asistencias mínimo con el que se debe cumplir en la actividad</span>
                                </div>
                                <div className="col text-center d-flex align-items-center justify-content-center justify-content-md-end pt-4 pt-md-0">
                                    <button className="btn btn-info" onClick={() => this.automaticApprobation()}>Aprobación automática</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-12 col-sm-5 col-md-7 mb-4">
                                {this.props.children}
                            </div>
                            {listP?.length > 0 && <div className="col col-md-5 mb-4 ml-auto ">
                                <div className="input-group">
                                    <input type="search" className="form-control" defaultValue={queryFilter} placeholder="Buscar..." onChange={(e) => this.filterList(e.target.value)} />
                                    <div className="input-group-append">
                                        <button className="btn btn-light input-group-text"><Search /></button>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        {listP?.length > 0 ?
                            <>
                                <div>
                                    {!(this.props.activity.tieneaprob) ?
                                        (!(this.props.onlyRead) && <Alert color="info" className="mb-4">
                                            <InfoIcon /> Indíque cuales de los participantes aprueban la actividad desde el check de la columna <b>"Aprobar"</b>
                                        </Alert>)
                                        :
                                        approbated !== null &&
                                        <div className="mb-3 bg-light d-inline-block pb-2 pt-2 pr-3 pl-3 rounded-pill">
                                            <CustomInput type="checkbox" id="approbated" checked readOnly label={<small>Aprobados: {approbated}</small>} className="d-inline-block pr-2 mr-2 border-right" />
                                            <CustomInput type="checkbox" id="no-approbated" checked={false} readOnly label={<small>No aprobados: {listP.length - approbated}</small>} className="d-inline-block" />
                                        </div>
                                    }
                                </div>
                                <div className="table-responsive-lg">
                                    <table className="table table-hover text-muted mb-5">
                                        <thead>
                                            <tr>
                                                <th scope="col">Identificación</th>
                                                <th scope="col">Nombre</th>
                                                <th className="border-left text-success text-center" id="asist">
                                                    <CheckIconFill />
                                                    <UncontrolledTooltip placement="top" target="asist">Asistencias</UncontrolledTooltip>
                                                </th>
                                                <th className="text-warning text-center" id="excuse">
                                                    <CheckIconFill />
                                                    <UncontrolledTooltip placement="top" target="excuse">Con excusas</UncontrolledTooltip>
                                                </th>
                                                <th className="text-danger text-center" id="no-asist">
                                                    <XCloseIconFill />
                                                    <UncontrolledTooltip placement="top" target="no-asist">Inasistencias</UncontrolledTooltip>
                                                </th>
                                                <th scope="col" className="border-left text-center">{!(this.props.onlyRead) ? "Aprobar" : "Aprobado"}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listP?.map((p, i) =>
                                                (new RegExp(`^.*\\s${queryFilter}`, "i").test(` ${p.dni_part.trim()} ${p.nomb_part.trim()} ${p.apel_part.trim()} ${p.email_part.trim()}`))
                                                    ? this.printParticipant(p, i) : null
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between mt-5">
                                    {!(this.state.loader) && <button className="btn btn-info btn-sm" onClick={() => this.downloadList()}>Descargar lista</button>}
                                    {!(this.props.onlyRead) && <button className="btn btn-success btn-sm" onClick={this.saveData}>{this.props.activity.tieneaprob ? "Actualizar aprobación" : "Realizar aprobación"}</button>}
                                </div>
                            </>
                            :
                            <p>Sin participantes inscritos</p>
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default ParticipantsApprovations;