import React, { Component, createRef } from 'react';
import ModalUI from '../../../components/ModalUI';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { GET_ACCOUNT_INFO } from '../../../services/constants';
import { ASSOC_DEPARTMENT_INSTRUCTOR, CREATE_INSTRUCTOR } from '../../../services/endPoints';
import { default as Form } from './../../../forms/admin/NewInstructor';

class NewInstructor extends Component {

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
                            alert: <span className="text-gray">Verifique el correo <mark>{email}</mark> y asegurese de que sea de tipo <b>curn.edu.co</b> o <b>curnvirtual.edu.co</b></span>,
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

    showUserData = (data, defaultData = {}, callback) => {
        const { GivenName, Sn, EmployeeNumber, Mail } = data;
        this.setState({
            loader: null,
            modal: {
                open: true,
                type: "info",
                title: "Asociar",
                alert: "Datos del usuario",
                size: "lg",
                closeIcon: true,
                onClosed: () => {
                    this.setState({ modal: null });
                    !!(callback) && callback();
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
                    <div className="border-top pt-4 mt-2">
                        <Form
                            defaultData={defaultData}
                            btnText={this.props.btnText}
                            onSubmit={(codi_depart) => {
                                this.submitAll({
                                    ...codi_depart,
                                    dni_admin: EmployeeNumber,
                                    nomb_admin: GivenName,
                                    apel_admin: Sn,
                                    email_admin: Mail
                                })
                            }}
                            departmentsList={this.props.departmentsList} />
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
                title: "Asociar",
                alert: "Indíque el correo del usuario que desea asociar como instructor (debe ser de tipo curn.edu.co o curnvirtual.edu.co)",
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
                        <button className="btn btn-success" >Buscar</button>
                    </div>
                </form>,
                closeIcon: true,
                buttons: []
            }
        })
    }

    associateWithDepartments = (instructor, codi_depart) => {
        this.setState({ loader: "Asociando departamentos" });
        return AXIOS_REQUEST(ASSOC_DEPARTMENT_INSTRUCTOR, "post", { dni_admin: instructor.dni_admin, codi_depart: codi_depart.join(",") })
            .then(resp => {
                this.savedInstructor = false;
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "success",
                        title: "¡Muy bien!",
                        onClosed: () => {
                            this.setState({ modal: null })
                        },
                        alert: resp.msg === "ERROR" ? "Se creó el instructor pero no se pudo asociar a los departamentos indicados, deberá asociarlo manualmente"
                            : `Se ha asociado correctamente el instructor ${instructor.nomb_admin}`,
                        buttons: [{ text: "Ok", color: "success", close: true }]
                    }
                }, () => {
                    this.props.onSuccess(codi_depart)
                })
            })
    }

    submitAll = (data) => {
        const { codi_depart, ...instructor } = data;
        let funct = () => {
            instructor.idTipo = 3;
            this.savedInstructor = false;
            return AXIOS_REQUEST(CREATE_INSTRUCTOR, "post", instructor).then(resp => {
                if (resp.msg === "ERROR") { throw new Error() }
                this.savedInstructor = resp.data.map(d => d.iddepart.toString());
                return this.associateWithDepartments(instructor, [...this.savedInstructor, ...codi_depart])
            });
        }

        this.setState({ loader: "Asociando instructor", modal: null }, () => {
            if (this.savedInstructor !== false) {
                funct = () => this.associateWithDepartments(instructor, [...this.savedInstructor, ...codi_depart]);
            }
            funct().catch(err => {
                this.setState({
                    loader: null,
                    modal: {
                        open: true,
                        type: "danger",
                        onClosed: () => {
                            this.setState({ modal: null })
                        },
                        title: "Ops...",
                        alert: err.message || `No se pudo asociar el instructor, intente nuevamente`,
                        buttons: [{ text: "Ok", color: "success", close: true }]
                    }
                })
            })
        })
    }

    render() {
        return (
            <>
                <button className="btn btn-outline-info" onClick={() => { this.openModalToSearch() }}>+ Asociar instructor</button>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
            </>
        );
    }
}

export default NewInstructor;

// import React, { Component } from 'react';
// import ModalUI from '../../../components/ModalUI';
// import { ChevronRightIcon } from '../../../components/UI/Icons';
// import Loader from '../../../components/UI/Loader';
// import { AXIOS_REQUEST } from '../../../services/axiosService';
// import { ASSOC_DEPARTMENT_INSTRUCTOR, CREATE_INSTRUCTOR } from '../../../services/endPoints';
// import { default as Form } from './../../../forms/admin/NewInstructor';

// class NewInstructor extends Component {

//     constructor(props) {
//         super();

//         this.state = {
//             loader: null,
//             modal: null,
//             departmentsList: []
//         }
//     }

//     goToBackPage = () => this.props.history.goBack()

//     associateWithDepartments = (instructor, codi_depart) => {
//         this.setState({ loader: "Asociando departamentos" });
//         return AXIOS_REQUEST(ASSOC_DEPARTMENT_INSTRUCTOR, "post", { dni_admin: instructor.dni_admin, codi_depart: codi_depart.join(",") })
//             .then(resp => {
//                 this.savedInstructor = false;
//                 if (resp.msg === "ERROR") { throw new Error("Se creó el instructor pero no se pudo asociar a los departamentos indicados, intentelo nuevamente") }
//                 this.setState({
//                     loader: null,
//                     modal: {
//                         open: true,
//                         type: "success",
//                         title: "¡Muy bien!",
//                         onClosed: () => {
//                             this.goToBackPage();
//                         },
//                         alert: `Se ha registrado correctamente el instructor ${instructor.nomb_admin}`,
//                         buttons: [{ text: "Ok", color: "success", close: true }]
//                     }
//                 })
//             })
//     }
//     savedInstructor = false;

//     submitAll = (data) => {
//         const { codi_depart, ...instructor } = data;
//         let funct = () => {
//             instructor.idTipo = 3;
//             this.savedInstructor = false;
//             return AXIOS_REQUEST(CREATE_INSTRUCTOR, "post", instructor).then(resp => {
//                 console.log(resp)
//                 if (resp.msg === "ERROR") { throw new Error() }
//                 this.savedInstructor = true;
//                 return this.associateWithDepartments(instructor, codi_depart)
//             });
//         }

//         this.setState({ loader: "Registrando instructor" }, () => {
//             if (this.savedInstructor) {
//                 funct = () => this.associateWithDepartments(instructor, codi_depart);
//             }
//             funct().catch(err => {
//                 this.setState({
//                     loader: null,
//                     modal: {
//                         open: true,
//                         type: "danger",
//                         onClosed: () => {
//                             this.setState({ modal: null })
//                         },
//                         title: "Ops...",
//                         alert: err.message || `No se pudo registrar el instructor, intente nuevamente`,
//                         buttons: [{ text: "Ok", color: "success", close: true }]
//                     }
//                 })
//             })
//         })
//     }

//     componentDidMount() {
//         let { location: { state } } = this.props;
//         if (!!(state?.departments)) {
//             this.setState({ departmentsList: state.departments })
//         } else {
//             this.goToBackPage()
//         }
//     }

//     render() {
//         return (
//             <>
//                 <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
//                 <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
//                 <div className="d-flex justify-content-between mb-5">
//                     <h4 className="text-gray mb-0">Nuevo</h4>
//                     <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
//                         <ChevronRightIcon />
//                     </button>
//                 </div>
//                 <div className="card border-0">
//                     <div className="card-body">
//                         <p className="text-gray mb-5">Indique la información del instructor y seleccione los departamentos a los cuales se asociará.</p>
//                         <Form departmentsList={this.state.departmentsList} onSubmit={this.submitAll} btnText={"Registrar"} />
//                     </div>
//                 </div>
//             </>
//         );
//     }
// }

// export default NewInstructor;