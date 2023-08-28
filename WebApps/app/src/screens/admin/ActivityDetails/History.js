import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import ModalUI from '../../../components/ModalUI';
import { ArchiveIcon, Award, InfoIcon, PersonIcon } from '../../../components/UI/Icons';
import { Nav, NavItem, TabContent, TabPane, NavLink } from 'reactstrap';
import classnames from 'classnames';
import ParticipantsApprovations from '../../../components/ParticipantsList/ParticipantsApprovations';
import { setActivitiesHistoryList } from '../../../store/admin/actions/activitiesAction';
import SessionsAndParticipants from './SessionsAndParticipants';
import StarRatings from 'react-star-ratings';
import lazyLoaderComponents from '../../../services/lazyLoaderComponents';
import './index.css';

const ActivityComments = lazy(() => lazyLoaderComponents(() => import('../../../components/ActivityComments')));

const basePage = "/historial";
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            showComments: false,
            modal: null,
            activeTab: "1",
            loader: null
        }
    }

    goToEndPage = () => {
        document.getElementById("sessions-list").scrollIntoView({ behavior: "smooth" });
    }

    onSuccessCallbackApprobation = (activity) => {
        let sessionsList = activity.sessionsList;
        this.setState({
            activity: { ...activity, sessionsList: null }
        }, () => {
            this.setState({ activity: { ...activity, tieneaprob: true, sessionsList } }, () => {
                let activities = this.props.activities[activity.periodo];
                let act = activities.findIndex(a => a.id === activity.id);
                activities[act].tieneaprob = true;
                setActivitiesHistoryList({ period: activity.periodo, list: activities });
            })
        })
    }

    getComments = () => {
        this.setState({ activeTab: '3', showComments: true });
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
        this.setState({ activity })
    }

    render() {
        const { modal, loader, activeTab, activity, showComments } = this.state;

        if (!(activity)) {
            return <Loader2 open={true}></Loader2>
        }
        return (
            <div>
                <Loader open={!!(loader)} color="warning">{loader}</Loader>
                <ModalUI open={modal?.open || false} {...modal} />
                <h4 className="text-gray mb-5">Detalles de actividad</h4>
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
                                className={"pl-2 pr-2 pr-sm-3 pl-sm-3 flex-column flex-sm-row " + classnames({ "active tab": activeTab === '1' })}
                                onClick={() => { this.setState({ activeTab: '1' }); }}
                            >
                                <span className="mb-1 mr-1"><Award /></span> Aprobación
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={"pl-2 pr-2 pr-sm-3 pl-sm-3 flex-column flex-sm-row " + classnames({ "active tab": activeTab === '2' })}
                                onClick={() => { this.setState({ activeTab: '2' }); }}
                            >
                                <span className="mb-1 mr-1"><InfoIcon /></span> Detalles
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={"pl-2 pr-2 pr-sm-3 pl-sm-3 flex-column flex-sm-row " + classnames({ "active tab": activeTab === '3' })}
                                onClick={this.getComments}
                            >
                                <span className="mb-1 mr-1"><ArchiveIcon /></span> <span>Comentarios</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" className="pt-5">
                            {!!(activity.sessionsList) ?
                                <ParticipantsApprovations
                                    onlyRead={activity.periodo !== activity.periodoactivo}
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
                                                        <b className="d-block">Calificación</b>
                                                        <div className="d-inline-block">
                                                            <p>Promedio: <b>{activity.promeval || 0}</b></p>

                                                            <StarRatings
                                                                rating={activity.promeval || 0}
                                                                starRatedColor="#ff9400"
                                                                starDimension="30px"
                                                                starSpacing="0"
                                                                numberOfStars={5}
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
                                <div className="mt-3" id="sessions-list">
                                    <SessionsAndParticipants
                                        onLoadedList={({ completed, sessionsList }) => {
                                            this.setState({ activity: { ...activity, completed, sessionsList } })
                                        }}
                                        activity={activity}
                                    />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tabId="3" className="pt-5" >
                            {showComments &&
                                <Suspense fallback={<Loader2 open></Loader2>}>
                                    <ActivityComments
                                        activity={activity}
                                    />
                                </Suspense>}
                        </TabPane>
                    </TabContent>
                </div>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(History);
