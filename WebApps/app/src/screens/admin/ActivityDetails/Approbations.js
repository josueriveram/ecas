import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircleProgress from '../../../components/UI/CircleProgress/CircleProgress';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import ModalUI from '../../../components/ModalUI';
import { Award, InfoIcon, PersonIcon, WarningIconFill } from '../../../components/UI/Icons';
import { Alert, Nav, NavItem, TabContent, TabPane, NavLink } from 'reactstrap';
import classnames from 'classnames';
import ParticipantsApprovations from '../../../components/ParticipantsList/ParticipantsApprovations';
import { setActivitiesHistoryList } from '../../../store/admin/actions/activitiesAction';
import SessionsAndParticipants from './SessionsAndParticipants';
import './index.css';

const basePage = "/aprobaciones";
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class Approbations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            loadParticipantsApprobation: true,
            modal: null,
            activeTab: "1",
            regist_asist: false,
            loader: null
        }
    }

    goToEndPage = () => {
        document.getElementById("sessions-list").scrollIntoView({ behavior: "smooth" });
    }

    onSuccessCallbackApprobation = (activity) => {
        let activities = this.props.activities[activity.periodo];
        let act = activities.findIndex(a => a.id === activity.id);
        activities[act].tieneaprob = true;
        setActivitiesHistoryList({ period: activity.periodo, list: activities });
        this.props.history.replace(basePage)
    }

    reloadParticipantsApprobation = () => {
        this.setState({ loadParticipantsApprobation: false });
        setTimeout(() => {
            this.setState({
                loadParticipantsApprobation: true,
                regist_asist: this.state.activity.sessionsList.filter(s => s.registasist === "1").length
            });
        }, 200)
    }

    componentDidMount() {
        let { match: { params: { idactividad } }, location: { state }, history, activities, periods } = this.props
        let activity = null;
        if (!!(state)) {
            activity = state;
        } else if (!!(idactividad) && activities?.[periods?.[0]]?.length > 0) {
            activity = activities?.[periods?.[0]]?.[idactividad]
        } else {
            return history.replace(basePage)
        }
        if (activity.tieneaprob === false) {
            this.setState({ activity })
        } else {
            return history.replace(basePage)
        }
    }

    render() {
        const { modal, loader, activeTab, activity, loadParticipantsApprobation, regist_asist } = this.state;

        if (!(activity)) {
            return <Loader2 open={true}></Loader2>
        }
        return (
            <div>
                <Loader open={!!(loader)} color="warning">{loader}</Loader>
                <ModalUI open={modal?.open || false} {...modal} />
                <h4 className="text-gray mb-5">Aprobación de participantes en la actividad</h4>
                <div className="mb-5">
                    <div className="activity-details">
                        <div className="card mb-5 border-0">
                            <div className="card-body d-block">
                                <b>{activity.tipo_aprob}</b><br />
                                <span>{activity.tipo_aprob_desc}</span>
                            </div>
                        </div>
                    </div>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ "active tab": activeTab === '1' })}
                                onClick={() => { this.setState({ activeTab: '1' }); }}
                            >
                                <span className="mb-1 mr-1"><Award /></span> Aprobación
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ "active tab": activeTab === '2' })}
                                onClick={() => { this.setState({ activeTab: '2' }); }}
                            >
                                <span className="mb-1 mr-1"><InfoIcon /></span> Detalles
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" className="pt-5">
                            {regist_asist < activity.sesiones ?
                                <>
                                    <Alert color="warning" onClick={this.goToEndPage} className="cursor-pointer">
                                        <WarningIconFill size={20} /> <span className="ml-1">
                                            Aún hay sesiones en las que no se ha realizado la asistencia, bebe marcar la asistencia de todas las sesiones para poder realizar el proceso de aprobación de participantes
                                        </span>
                                    </Alert>
                                    <button className="btn btn-info mt-4" onClick={() => {
                                        this.setState({ activeTab: '2' });
                                        setTimeout(() => this.goToEndPage(), 500);
                                    }}>Completar asistencias</button>
                                </>
                                :
                                !!(activity.sessionsList) && loadParticipantsApprobation ?
                                    <ParticipantsApprovations
                                        activity={activity}
                                        session={activity.sessionsList[0]}
                                        onSuccess={this.onSuccessCallbackApprobation}
                                    >
                                        <b className="bg-light rounded-pill pt-2 pb-2 pl-4 pr-4 text-gray"><PersonIcon size={17} /> Participantes</b>
                                    </ParticipantsApprovations>
                                    : <Loader2 open={true}>Obteniendo detalles</Loader2>
                            }
                        </TabPane>
                        <TabPane tabId="2" className="pt-5 activity-details">
                            <div className="card">
                                <div className="card-body pr-0 pr-md-3">
                                    <div className="text-muted">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-9 col-xl-9">
                                                <p><b>Nombre: </b><br /> <span className="">{activity.nomb_acti}</span> </p>
                                                <p><b>Descripción: </b> <br /><span>{activity.descripcion}</span></p>
                                                <p><b>Categoría: </b> <br /><span>{activity.categoria}</span> </p>
                                                <p><b>Puntos que ofrece: </b> <br /><span>{activity.puntos} puntos</span> </p>
                                                <div>
                                                    <p className="d-sm-inline-block mr-5"><b>Inició a partir del: <br /></b> {new Date(activity.inicio).toLocaleString([], dateOptions)} </p>
                                                    <p className="d-sm-inline-block"><b>Termina el: </b><br /> {new Date(activity.fin).toLocaleString([], dateOptions)} </p>
                                                </div>
                                                <p><b>Ofertado por: </b> <br />{activity.depart} </p>
                                            </div>
                                            <div className="col text-center mb-3 mt-3 mb-lg-0">
                                                <div className="row text-left text-md-center">
                                                    <div className="col col-md-12 mt-md-2 text-md-center">
                                                        <b className="d-block">Asistencias</b>
                                                        <div className="d-inline-block">
                                                            <CircleProgress
                                                                radius={60}
                                                                stroke={8}
                                                                color={regist_asist < activity.sesiones ? "#ff9400" : null}
                                                                progress={(regist_asist * 100) / activity.sesiones}
                                                                content={<span>{regist_asist} de {activity.sesiones}<br />realizadas</span>}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col col-sm-7 col-md col-lg-12 mt-md-2">
                                                        <div className="row">
                                                            <div className="col-12  mt-md-2">
                                                                <b>Inscritos</b><br />
                                                                <span>{activity.inscritos}</span>
                                                            </div>
                                                            <div className="col-12 mt-4 mt-md-2">
                                                                <b>Aforo</b><br />
                                                                <span>{activity.cupos}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!!(activity.horas_cert) && <p><b>Horas certificadas: </b> <br /><span>{activity.horas_cert}</span></p>}
                                        <p><b>Oferta dirigida para: </b>  </p>
                                        <div className="mb-3 mr-3">
                                            {activity.oferta_rolhum?.split(",").map(e => <a key={e} href="#" style={{ fontSize: "12px", maxWidth: "100%" }} className="mr-2 mb-1 rounded-pill btn btn-primary btn-lg disabled btn-sm text-truncate" tabIndex="-1" role="button" aria-disabled="true">{e}</a>)}<br />
                                            {activity.oferta_programahum?.split(",").map(e => <a key={e} href="#" style={{ fontSize: "12px", maxWidth: "100%" }} className="mr-2 mb-1 rounded-pill btn btn-success btn-lg disabled btn-sm text-truncate" tabIndex="-1" role="button" aria-disabled="true">{e}</a>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <h6 className="mb-4"><b>Sesiones de la actividad: </b> {activity.sesiones} </h6>
                                <h6 className="mb-3"><b>Registrar asistencia: </b><br />Las sesiones que requieren asistencia son las que están marcadas con el simbolo <span className="text-danger"><WarningIconFill size={14} /></span></h6>
                                <div className="mt-3" id="sessions-list">
                                    <SessionsAndParticipants
                                        onSuccess={this.reloadParticipantsApprobation}
                                        onLoadedList={({ completed, sessionsList }) => {
                                            this.setState({ activity: { ...activity, completed, sessionsList }, regist_asist: sessionsList.filter(s => s.registasist === "1").length })
                                        }}
                                        activity={activity}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </div >
        );
    }
}
const mapStateToProps = state => ({
    activities: state.activities.historyList,
    periods: state.activities.periods
})
const mapDispatchToProps = dispatch => ({
    setActivitiesHistoryList: list => dispatch(setActivitiesHistoryList(list))
})
export default connect(mapStateToProps, mapDispatchToProps)(Approbations);
