import React, { Component, createRef } from 'react';
import ModalUI from '../../../components/ModalUI';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { GET_ACCOUNT_INFO } from '../../../services/constants';
import { ADD_PARTICIPANTS } from '../../../services/endPoints';

class NewParticipant extends Component {

    constructor(props) {
        super();

        this.state = {
            loader: null,
            modal: null,
        }
    }

    savedInstructor = false;

    searchUser = (emailRef) => {
        emailRef.classList.remove("is-invalid");
        let email = emailRef.value;
        if (/^[\w-\.]+@(curn(virtual)?\.edu\.co)$/.test(email)) {
            this.setState({ modal: null, loader: "Buscando" }, () => {
                AXIOS_REQUEST(null, null, null, false, GET_ACCOUNT_INFO + email).then(resp => {
                    if (resp.msg === "ERROR") { throw new Error() }
                    this.showUserData(resp.data.entidad);
                }).catch(err => {
                    emailRef.classList.add("is-invalid");
                    emailRef.focus()
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "warning",
                            title: "No se encontró usuario",
                            alert: <>
                                <span className="text-gray mb-5">Verifique el correo <mark>{email}</mark> y asegurese de que sea de tipo <b>curn.edu.co</b> o <b>curnvirtual.edu.co</b></span>
                            </>,
                            size: "md",
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            buttons: [
                                { color: "success", text: "Ok", close: true }
                            ]
                        }
                    })
                })
            });
        } else {
            emailRef.classList.add("is-invalid");
            emailRef.focus()
        }
    }

    showUserData = (data) => {
        const { GivenName, Sn, EmployeeNumber, Mail, NombPrograma } = data;
        this.setState({
            loader: null,
            modal: {
                open: true,
                type: "info",
                title: "Registrar",
                alert: "Datos del usuario",
                size: "lg",
                closeIcon: true,
                onClosed: () => {
                    this.setState({ modal: null });
                },
                children: <>
                    <div className="d-flex flex-wrap justify-content-between">
                        <p>
                            <small><b>Nombre:</b></small><br />
                            <span>{GivenName} {Sn}</span>
                        </p>
                        <p>
                            <small><b>Identificación:</b></small><br />
                            <span>{EmployeeNumber}</span>
                        </p>
                        <p>
                            <small><b>Correo:</b></small><br />
                            <span>{Mail}</span>
                        </p>
                    </div>
                    <p>
                        <small><b>Programa:</b></small><br />
                        <span>{NombPrograma}</span>
                    </p>
                    <div className=" text-center pt-4 mt-2">
                        <button className="btn btn-success" onClick={() => this.submitAll(Mail)}>Finalizar</button>
                    </div>
                </>,
                buttons: []
            }
        })
    }

    openModalToSearch = () => {
        const email = createRef();
        this.setState({
            modal: {
                open: true,
                type: "warning",
                title: "Registrar participante",
                alert: "Indíque el correo del usuario que desea registrar como nuevo participante (debe ser de tipo curn.edu.co o curnvirtual.edu.co)",
                size: "md",
                onClosed: (search) => {
                    if (!(search)) {
                        this.setState({ modal: null })
                    }
                },
                children: <form onSubmit={(e) => { e.preventDefault(); this.searchUser(email.current); }}>
                    <div className="form-group pt-4">
                        <input type="email" placeholder="Correo" className="form-control manual-validation" ref={email} />
                        <small className='text-danger error-message d-none'>Debe ser @curn.edu.co / @curnvirtual.edu.co</small>
                    </div>
                    <div className="text-center mt-5">
                        <button className="btn btn-success" >Buscar usuario</button>
                    </div>
                </form>,
                closeIcon: true,
                buttons: []
            }
        })
    }

    submitAll = (correo) => {
        this.setState({ loader: "Registrando participante", modal: null }, () => {
            AXIOS_REQUEST(ADD_PARTICIPANTS, "POST", { correo })
                .then(resp => {
                    if (resp.msg === "ERROR") { throw new Error() }
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "success",
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            title: "¡Muy bien!",
                            alert: `El participante ha sido registrado correctamente`,
                            buttons: [{ text: "Ok", color: "success", close: true }]
                        }
                    })
                })
                .catch(err => {
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "danger",
                            onClosed: () => {
                                this.setState({ modal: null })
                            },
                            title: "Ops...",
                            alert: err.message || `No se pudo registrar el participante, intente nuevamente`,
                            buttons: [{ text: "Ok", color: "success", close: true }]
                        }
                    })
                })
        })
    }

    render() {
        return (
            <>
                <button className="btn btn-outline-info" onClick={() => { this.openModalToSearch() }}>+ Registrar participante</button>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
            </>
        );
    }
}


export default NewParticipant;
