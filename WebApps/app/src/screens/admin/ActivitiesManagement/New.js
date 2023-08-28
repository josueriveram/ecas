import React, { Component, lazy, Suspense } from 'react';
import { Collapse } from 'reactstrap';
import ModalUI from '../../../components/ModalUI';
import { CheckIconFill, ChevronRightIcon } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { NEW_ACTIVITY, NEW_SESSIONS } from '../../../services/endPoints';
import lazyLoaderComponents from '../../../services/lazyLoaderComponents';

import "./style.css";

const CreateSessions = lazy(() => lazyLoaderComponents(() => import('../../../components/CreateSessions')));
const NewActivityForm = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')));
const ProgramsChooser = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')).then(m => ({ default: m.ProgramsChooser })))
const RolesChooser = lazy(() => lazyLoaderComponents(() => import('./../../../forms/admin/NewActivity')).then(m => ({ default: m.RolesChooser })))

class New extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activityData: {},
            programascsv: [],
            rolescsv: [],
            activeStep: 0,
            completedSteps: 0,
            sessions: [],
            loader: null,
            modal: null
        };
    }

    stepAfterProgramsSelected = 1;

    goToStep = (idx) => {
        setTimeout(() => {
            document.getElementById(`step-${idx}`).scrollIntoView({ behavior: "smooth" })
        }, 1000)
    };

    goBack = (step = 1) => {
        let activeStep = this.state.activeStep - step;
        this.setState({ activeStep })
        this.goToStep(activeStep)
    };

    setActivityData = (data) => {
        let activeStep = this.state.activeStep + 1;
        this.setState({
            activeStep,
            activityData: data,
            completedSteps: this.state.completedSteps + 1
        });
        this.goToStep(activeStep);
    }

    setProgramsData = (data) => {
        let activeStep = this.state.activeStep + 1;
        this.setState({
            activeStep,
            programascsv: data,
            completedSteps: this.state.completedSteps + 1
        })
        this.goToStep(activeStep);
    }

    setRolesData = (data, programsRequired) => {
        this.stepAfterProgramsSelected = programsRequired ? 1 : 2;
        let activeStep = this.state.activeStep + this.stepAfterProgramsSelected;
        this.setState({
            activeStep,
            rolescsv: data,
            completedSteps: this.state.completedSteps + this.stepAfterProgramsSelected
        })
        this.goToStep(activeStep);
    }

    setSessions = (data) => {
        let activeStep = this.state.activeStep + 1;
        this.setState({
            activeStep,
            sessions: data,
            completedSteps: this.state.completedSteps + 1
        })
        this.goToStep(activeStep);
    }

    goToBackPage = () => { this.props.history.goBack() }

    idAct_temp = null;

    submitError = (text) => {
        this.setState({
            loader: null,
            modal: {
                type: "danger",
                title: "Ops...",
                size: "sm",
                alert: text,
                open: true,
                onClosed: () => {
                    this.setState({ modal: null })
                },
                buttons: [{ text: "Ok", color: "success", close: true }]
            }
        })
    }

    submitAll = () => {
        let { activityData, sessions, rolescsv, programascsv } = this.state;
        if (this.idAct_temp !== null) {
            return this.saveSessions(sessions, this.idAct_temp)
        }
        activityData.horascert = !!(activityData.horas_cert) ? `${activityData.horas_cert}:00:00` : null;
        delete activityData.horas_cert;
        this.setState({ loader: "Registrando actividad" }, () => {
            AXIOS_REQUEST(NEW_ACTIVITY, "POST", {
                ...activityData,
                programascsv: this.stepAfterProgramsSelected === 1 ? programascsv?.join(",") : "",
                rolescsv: rolescsv.join(","),
                sesiones: sessions.length
            }).then(resp => {
                if (resp.msg === "ERROR") {
                    throw new Error();
                }
                this.idAct_temp = resp.data;
                this.saveSessions(sessions, resp.data)
            }).catch((e) => {
                this.submitError("No se pudo hacer el registro de la actividad, intente nuevamente");
            })
        });
    }

    saveSessions = (sesiones, idact) => {
        sesiones = sesiones.map(s => ({ ...s, idact }));
        this.setState({ loader: "Registrando sesiones de la actividad" }, () => {
            AXIOS_REQUEST(NEW_SESSIONS, "POST", sesiones)
                .then(resp => {
                    if (resp.msg === "ERROR") {
                        throw new Error()
                    }
                    this.idAct_temp = null;
                    this.setState({
                        loader: null,
                        modal: {
                            type: "success",
                            title: "¡Muy bien!",
                            size: "md",
                            alert: "Se ha registrado correctamente la actividad",
                            open: true,
                            onClosed: () => {
                                this.setState({
                                    activeStep: 0,
                                    completedSteps: 0,
                                }, () => {
                                    this.goToBackPage();
                                })
                            },
                            buttons: [{ text: "Ok", color: "success", close: true }]
                        }
                    })
                }).catch(err => {
                    this.submitError("No se pudo hacer el registro de la actividad, intente nuevamente");
                })
        });
    }

    steps = () => [
        {
            title: <><h5 className="mb-0 text-muted">Actividad</h5></>,
            info: <p className="mb-2 text-gray">Indíque la información básica para la actividad.</p>,
            form: <NewActivityForm onSubmit={this.setActivityData} />
        },
        {
            title: <><h5 className="mb-0 text-muted">Roles</h5></>,
            info: <p className="mb-2 text-gray">Elija uno o varios roles a los cuales se ofertará la actividad</p>,
            form: <RolesChooser
                selected={this.state?.rolescsv || []}
                minSelect={1}
                submitBtn={{ onClick: this.setRolesData }}
                cancelBtn={{ onClick: () => this.goBack(), value: "Atrás" }}
            />
        },
        {
            title: <><h5 className="mb-0 text-muted">Programas</h5></>,
            info: <p className="mb-2 text-gray">Elija uno o varios programas a los cuales se ofertará la actividad</p>,
            form: <ProgramsChooser
                selected={this.state?.programascsv || []}
                minSelect={1}
                submitBtn={{ onClick: this.setProgramsData }}
                cancelBtn={{ onClick: () => this.goBack(), value: "Atrás" }}
            />
        },
        {
            title: <><h5 className="mb-0 text-muted">Sesiones</h5></>,
            info: <p className="mb-2 text-gray">Indíque el número de sesiones y especifique los detalles da las mísmas</p>,
            form: <CreateSessions
                sessions={this.state?.sessions}
                submitBtn={{ onClick: this.setSessions }}
                cancelBtn={{ onClick: (data) => { this.setState({ sessions: data }, () => this.goBack(this.stepAfterProgramsSelected)); }, value: "Atrás" }}
            />
        },
        {
            title: <><h5 className="mb-0 text-muted">Finalizar</h5></>,
            info: <p className="mb-2 text-gray"></p>,
            form: <div>
                <h4 className="text-muted text-center">¿Desea crear la actividad y sus respectivas sesiones?</h4>
                <div className="mt-5 d-flex justify-content-center">
                    <button className="btn btn-success mr-4" onClick={() => this.goBack()}>Atrás</button>
                    <button className="btn btn-success" onClick={this.submitAll}>Sí, crear</button>
                </div>
            </div>
        }
    ]

    render() {
        return (
            <>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Nuevo</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>
                {this.steps().map((step, idx) =>
                    <div
                        className={`card border-0${this.state.activeStep === idx ? " active mb-5" : this.state.activeStep > idx ? " completed mb-4" : " mb-5 shadow-none bg-transparent"}`}
                        key={idx}
                        id={`step-${idx}`}
                    >
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <span className="step-indicator mr-2">{this.state.activeStep > idx ? <CheckIconFill /> : idx + 1}</span>
                                {step.title}
                            </div>
                            <div className="mt-3">
                                {step.info && <div className="text-muted">{step.info}</div>}
                                <Suspense fallback={<Loader2 open></Loader2>}>
                                    <Collapse isOpen={this.state.activeStep === idx}>
                                        {(this.state.completedSteps > idx || this.state.activeStep === idx) &&
                                            <div className="mt-5 mb-4">{step.form}</div>
                                        }
                                    </Collapse>
                                </Suspense>
                            </div>
                        </div>
                    </div>
                )}

            </>
        );
    }
}

export default New;
