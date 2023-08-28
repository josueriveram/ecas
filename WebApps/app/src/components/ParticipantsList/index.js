import React, { Component } from 'react';
import { Alert, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { INS_ASISTENCIA, INS_PARTICIPANTES } from '../../services/endPoints';
import ModalUI from '../ModalUI';
import { InfoIcon, Search } from '../UI/Icons';
import Loader, { Loader2 } from '../UI/Loader';

const _statusCode = { 2: "Sí", 3: "No", 4: "Con excusa" };

class ParticipantsList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listP: null,
            loader: null,
            loader2: null,
            queryFilter: ""
        }

        this.participants = [];
    }


    componentDidMount() {
        if (!!(this.props.session.participants)) {
            this.setState({ listP: JSON.parse(JSON.stringify(this.props.session.participants)) }, () => {
                this.participants = JSON.parse(JSON.stringify(this.props.session.participants));

                if (!!(this.props.markAttendance) && !!(this.props.actionButtonId)) {
                    document.getElementById(this.props.actionButtonId).addEventListener("click", this.saveData)
                }
            });

        } else {
            this.setState({ loader2: "Consultando participantes" })
            return AXIOS_REQUEST(INS_PARTICIPANTES, "POST", { idactividad: this.props.activity.id, item: this.props.session.item }).then(resp => {

                this.setState({ loader2: null, listP: JSON.parse(JSON.stringify(resp.data)) }, () => {
                    this.participants = JSON.parse(JSON.stringify(resp.data));

                    this.props.onLoadedList(([...this.participants]), this.props.session.item)

                    if (!!(this.props.markAttendance) && !!(this.props.actionButtonId)) {
                        document.getElementById(this.props.actionButtonId).addEventListener("click", this.saveData)
                    }
                });
            })
        }
    }

    filterList = (queryFilter) => {
        this.setState({ queryFilter: queryFilter.trim() })
    }

    setParticipantObservation = (index, obs) => {
        let listP = this.state.listP;
        listP[index].observacion = obs;
        this.setState({ listP })
    }

    setParticipantAttendance = (index, status) => {
        let listP = this.state.listP;
        listP[index].estado = Number(status);
        this.setState({ listP })
    }

    saveData = () => {
        const { item, registasist } = this.props.session;
        let data = this.state.listP.map(p => ({
            item,
            idact: this.props.activity.id,
            dnipart: p.dni_part,
            estado: p.estado === 1 ? 3 : p.estado,
            observacion: p.observacion
        }));
        let filter = [];
        if (registasist === "1") {
            filter = data.filter((p, i) => (p.estado !== this.participants?.[i]?.estado || p.observacion !== this.participants?.[i]?.observacion));
        } else {
            filter = data;
        }

        if (filter.length > 0) {
            this.setState({
                loader: "Guardando asistencia",
            })

            AXIOS_REQUEST(INS_ASISTENCIA, "POST", filter).then(resp => {
                if (resp.msg === "ERROR") {
                    throw new Error();
                } else {
                    this.setState({
                        loader: null,
                        modal: {
                            type: "success",
                            title: "¡Muy bien!",
                            size: "sm",
                            alert: "Se ha registrado la asistencia de la sesión correctamente",
                            open: true,
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            buttons: [{ text: "Ok", color: "success", close: true }]
                        }
                    })
                    this.props.onLoadedList(this.state.listP, this.props.session.item);
                    !!(this.props.onSuccess) && this.props.onSuccess(this.state.listP, this.props.session.item);
                }
            }).catch(e => {
                this.setState({
                    loader: null,
                    modal: {
                        type: "danger",
                        title: "Ops...",
                        size: "sm",
                        alert: "No se pudo guardar la asistencia, por favor intentelo nuevamente",
                        open: true,
                        onClosed: () => {
                            this.setState({ modal: null })
                        },
                        buttons: [{ text: "Ok", color: "success", click: () => { } }]
                    }
                })
            })
        }

    }

    dropdownAttendance = (participant, index) => {
        return <UncontrolledButtonDropdown key={index} disabled={this.props.activity.tieneaprob}>
            <DropdownToggle caret className={`btn-sm btn-${this.props.activity.tieneaprob ? "light" : "info"}`}>
                {_statusCode[participant.estado === 1 ? 3 : participant.estado]}
            </DropdownToggle>
            <DropdownMenu>
                {!(this.props.activity.tieneaprob) && Object.keys(_statusCode).map(i => <DropdownItem onClick={() => this.setParticipantAttendance(index, i)} key={i}>{_statusCode[i]}</DropdownItem>)}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    }

    printParticipant = (p, i) => <tr key={p.dni_part} className="cursor-pointer">
        <td scope="row">{p.dni_part}</td>
        <td>
            <span className="d-block d-lg-inline-block pr-lg-2">{p.nomb_part} {p.apel_part}</span>
            <a href={`mailto:${p.email_part}`}><small>{p.email_part}</small></a>
        </td>
        {this.props.markAttendance &&
            <>
                <td>
                    <textarea disabled={this.props.activity.tieneaprob}
                        rows="1" className="form-control pt-1 pb-1"
                        style={{ minWidth: "200px" }}
                        defaultValue={p.observacion || ""}
                        onBlur={(e) => this.setParticipantObservation(i, e.target.value)}></textarea>
                </td>
                <td className="text-center">
                    {this.dropdownAttendance(p, i)}
                </td>
            </>
        }
    </tr>

    render() {
        if (!!(this.state.loader2)) {
            return <Loader2 open>{this.state.loader2}</Loader2>
        }
        const { markAttendance, session: { registasist } } = this.props;
        const { queryFilter, listP, modal } = this.state;
        return (
            <>
                <ModalUI open={modal?.open || false} {...modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div className="row align-items-center">
                    <div className="col-12 col-sm-5 col-md-6 col-lg-7 mb-4">
                        {this.props.children}
                    </div>
                    {listP?.length > 0 && <div className="col col-md-6 col-lg-5 mb-4 ml-auto ">
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
                        {markAttendance && registasist === "0" && <div>
                            <Alert color="info" className="mb-4">
                                <InfoIcon /> Indíque cuales de los participantes asistieron a la sesión desde las opciones en la columna <b>"¿Asistió?"</b>
                            </Alert>
                        </div>}
                        <div className="table-responsive-lg">
                            <table className="table table-hover text-muted mb-5">
                                <thead>
                                    <tr>
                                        <th scope="col">Identificación</th>
                                        <th scope="col">Nombre</th>
                                        {markAttendance &&
                                            <>
                                                <th scope="col">Observación</th>
                                                <th scope="col" className="text-center">¿Asistió?</th>
                                            </>
                                        }
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
                    </>
                    :
                    <p>Sin participantes inscritos</p>
                }
            </>
        );
    }
}

export default ParticipantsList;