import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircleProgress from '../../../components/UI/CircleProgress/CircleProgress';
import Loader from '../../../components/UI/Loader';
import ModalUI from '../../../components/ModalUI';
import { WarningIconFill } from '../../../components/UI/Icons';
import SessionsAndParticipants from './SessionsAndParticipants';
import './index.css';
import ActivityAsistance from '../../../components/QR/ActivityAsistance';

const basePage = "/actividades";
const dateOptions = { dateStyle: "full" };

class MyActitivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            modal: null,
            loader: null
        }
    }

    componentDidMount() {
        let { match: { params: { idactividad } }, location: { state }, history, activities, config } = this.props
        let activity = null;
        if (!!(state)) {
            activity = state;
        } else if (!!(idactividad) && activities?.length > 0) {
            activity = activities[idactividad]
        } else {
            return history.replace(basePage)
        }
        this.setState({ activity })
    }

    render() {
        const { modal, loader, activity } = this.state;

        if (!(activity)) {
            return null
        }
        return (
            <div>
                <Loader open={!!(loader)} color="warning">{loader}</Loader>
                <ModalUI open={modal?.open || false} {...modal} />
                <h4 className="text-gray d-flex justify-content-between align-items-center">
                    Detalles de actividad
                    {activity.sesiones === 1 && <ActivityAsistance
                        url={this.props.config?.url_base}
                        activityId={activity.id}
                        activityName={activity.nomb_acti}
                        title={this.props.config?.titulo}
                    />}
                </h4>

                <div className="activity-details mb-5 mt-3">
                    <div className="card border-0">
                        <div className="card-body pr-0 pr-md-3">
                            <div className="text-muted">
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-9 col-xl-9">
                                        <p><b>Nombre: </b><br /> <span className="">{activity.nomb_acti}</span> </p>
                                        <p><b>Descripción: </b> <br /><span>{activity.descripcion}</span></p>
                                        <p><b>Categoría: </b> <br /><span>{activity.categoria}</span> </p>
                                        <p><b>Puntos que ofrece: </b> <br /><span>{activity.puntos} puntos</span> </p>
                                        <div>
                                            <p className="d-sm-inline-block mr-5"><b>Inicia a partir del: <br /></b> {new Date(activity.inicio).toLocaleString([], dateOptions)} </p>
                                            <p className="d-sm-inline-block"><b>Termina el: </b><br /> {new Date(activity.fin).toLocaleString([], dateOptions)} </p>
                                        </div>
                                        <p><b>Ofertado por: </b> <br />{activity.depart} </p>
                                    </div>
                                    <div className="col text-center mb-3 mt-3 mb-lg-0">
                                        <div className="row text-left text-md-center">
                                            <div className="col col-md-12 mt-md-2 text-md-center">
                                                <b className="d-block">Progreso</b>
                                                <div className="d-inline-block">
                                                    <CircleProgress
                                                        radius={60}
                                                        stroke={8}
                                                        progress={(activity.completed * 100) / activity.sesiones}
                                                        content={<span>{activity.completed} de {activity.sesiones}<br />sesiones</span>}
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
                                                        <b>Cupos</b><br />
                                                        <span>{activity.cupos - activity.inscritos}</span>
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
                        <div className="mt-3">
                            <SessionsAndParticipants
                                onLoadedList={({ completed, sessionsList }) => {
                                    this.setState({ activity: { ...this.state.activity, completed, sessionsList } })
                                }}
                                activity={this.state.activity}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    activities: state.activities.activitiesList,
    config: state.user.config
})
export default connect(mapStateToProps)(MyActitivity);
