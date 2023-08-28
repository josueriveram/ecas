import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ADD_EXTERNAL_PARTICIPANTS, FIND_PARTICIPANT } from '../../services/endPoints';
import ModalUI from '../ModalUI';
import Loader from '../UI/Loader';

class AddParticipant extends Component {

    constructor() {
        super();
        this.state = {
            modal: null,
            loader: null,
            loader2: null
        }
    }

    searchParticipant = (email) => {
        if (/^[\w-\.]+@((curn(virtual)?\.edu\.co)|(gmail(\.[\w-]+)+))$/.test(email)) {
            this.setState({ modal: null, loader: "Buscando" }, () => {
                AXIOS_REQUEST(FIND_PARTICIPANT + email).then(resp => {
                    if (resp.msg === "ERROR" || resp.data?.length === 0) { throw new Error() }
                    this.showParticipantData(resp.data[0]);
                }).catch(err => {
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "warning",
                            title: "No se encontró participante",
                            alert: <p className="text-gray">Verifique el correo ingresado y asegurese de que sea de tipo <b>curn.edu.co</b>, <b>curnvirtual.edu.co</b> o <b>gmail.com</b></p>,
                            size: "md",
                            onClosed: (submit) => {
                                this.setState({ modal: null })
                            },
                            buttons: [
                                { color: "success", text: "Ok", close: true }
                            ]
                        }
                    })
                })
            });
        }
    }


    appendParticipant = (data) => {
        this.setState({ modal: null, loader: "Añadiendo participante" }, () => {
            AXIOS_REQUEST(ADD_EXTERNAL_PARTICIPANTS, "post", [data]).then(resp => {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "success",
                        title: "¡Muy bien!",
                        alert: "Se ha registrado el participante en esta actividad",
                        size: "md",
                        onClosed: (submit) => {
                            this.setState({ modal: null })
                        },
                        buttons: [
                            { color: "success", text: "Ok", close: true }
                        ]
                    }
                }, this.props.onSuccess)
            }).catch(err => {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "danger",
                        title: "Ops...",
                        alert: "No se pudo añadir el participante a la actividad, intentelo nuevamente",
                        size: "md",
                        onClosed: (submit) => {
                            this.setState({ modal: null })
                        },
                        buttons: [
                            { color: "success", text: "Ok", close: true }
                        ]
                    }
                })
            })
        });
    }

    showParticipantData = (data) => {
        const { nomb_part, dni_part, email_part, apel_part } = data;
        this.setState({
            loader: null,
            modal: {
                open: true,
                type: "info",
                title: "Añadir participante",
                alert: "Datos del participante",
                size: "lg",
                closeIcon: true,
                onClosed: (submit) => {
                    if (!(submit)) {
                        this.setState({ modal: null })
                    } else {
                        submit({
                            nombres: nomb_part,
                            apellidos: apel_part,
                            dni: dni_part,
                            correo: email_part,
                            actividad: this.props.activity.id
                        });
                    }
                },
                children: <div className="d-flex flex-wrap justify-content-between">
                    <p>
                        <small><b>Nombre:</b></small><br />
                        <span>{nomb_part} {apel_part}</span>
                    </p>
                    <p>
                        <small><b>Identificación:</b></small><br />
                        <span>{dni_part}</span>
                    </p>
                    <p>
                        <small><b>Correo:</b></small><br />
                        <span>{email_part}</span>
                    </p>
                </div>,
                buttons: [
                    { color: "info", text: "Cancelar", close: true },
                    { color: "success", text: "Registrar", click: () => this.appendParticipant }]
            }
        })
    }

    openModalToSearch = () => {
        const email = createRef();
        this.setState({
            modal: {
                open: true,
                type: "warning",
                title: "Añadir participante",
                alert: "Indíque el correo del participante que desea añadir a la actividad (debe ser de tipo curn.edu.co, curnvirtual.edu.co o gmail.com)",
                size: "md",
                onClosed: (search) => {
                    if (!(search)) {
                        this.setState({ modal: null })
                    }
                },
                children: <form onSubmit={(e) => { e.preventDefault(); this.searchParticipant(email.current.value); }}>
                    <div className="form-group">
                        <input type="email" placeholder="Correo" className="form-control" ref={email} />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-success">Buscar</button>
                    </div>
                </form>,
                backdrop: true,
                closeIcon: true,
                buttons: []
            }
        })
    }

    render() {
        return (
            <>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <button onClick={() => this.openModalToSearch()} className="btn btn-info">Añadir participante</button>
            </>
        );
    }
}

AddParticipant.propTypes = {
    activity: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default AddParticipant;