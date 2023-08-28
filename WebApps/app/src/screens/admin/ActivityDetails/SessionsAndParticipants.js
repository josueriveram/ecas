import React, { Component } from 'react';
import ModalUI from '../../../components/ModalUI';
import ParticipantsList from '../../../components/ParticipantsList';
import { FilterLeft, PersonGroup, PersonIcon } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { INS_ACTIVIDADES_DETALLES } from '../../../services/endPoints';
import { interventorsToList } from '../../../store/user/actions/activitiesAction';
import Sessions from './Sessions';

const dateOptions = { dateStyle: "full" };

class SessionsAndParticipants extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            modal: null
        }
    }

    openSessionDetails = session => {
        const { activity } = this.state;
        let makeAttendance = (session.shouldMakeAttendance);
        let buttons = [{ color: "secondary", text: "Cerrar", close: true }];
        let expositores = interventorsToList(session.expositores);
        if (makeAttendance && !(activity.tieneaprob)) {
            buttons.push(
                { color: "success", text: session.registasist === "0" ? "Guardar asistencia" : "Actualizar asistencia", "id": "saveAttendanceBtn", close: false }
            )
        }

        this.setState({
            modal: {
                buttons,
                size: "xl",
                open: true,
                type: "info",
                closeIcon: true,
                title: "Detalles de la sesión",
                backdrop: !(makeAttendance),
                alert: <>
                    {new Date(session.fecha).toLocaleString([], dateOptions)}<br />
                    <span>De {session.hora_ini} a {session.hora_fin}</span>
                </>,
                onClosed: (cb) => {
                    this.setState({ modal: null })
                },
                children: <>
                    {!!(session.descripcion) && <div className="mb-5">
                        <p><b className="bg-light rounded-pill pt-2 pb-2 pl-4 pr-4 text-gray"><FilterLeft size={17} /> Descripción</b></p>
                        <div className="d-block mt-1">{session.descripcion}</div>
                    </div>}
                    <div className="mb-5">
                        <p><b className="bg-light rounded-pill pt-2 pb-2 pl-4 pr-4 text-gray"><PersonGroup size={17} /> Expositores</b></p>
                        <div className="d-block mt-1">
                            <div className="row expositors">
                                {expositores.map((e, idx) => <div className="col-12 col-lg-6" key={`exp${idx}`}>
                                    <span><b>{idx + 1}. </b>{e.nombre}</span>
                                    <a href={`mailto:${e.correo}`}><small>{e.correo}</small></a>
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mt-1">
                            <ParticipantsList
                                activity={activity}
                                session={session}
                                markAttendance={makeAttendance}
                                onLoadedList={this.setParticipantsListInSession}
                                onSuccess={(list_part, sessionID) => {
                                    this.setParticipantsListInSession(list_part, sessionID, { registasist: "1" })
                                    !!(this.props.onSuccess) && this.props.onSuccess();
                                }}
                                actionButtonId={(makeAttendance && !(activity.tieneaprob)) ? "saveAttendanceBtn" : undefined}
                            >
                                <b className="bg-light rounded-pill pt-2 pb-2 pl-4 pr-4 text-gray"><PersonIcon size={17} /> Participantes</b>
                            </ParticipantsList>
                        </div>
                    </div>
                </>
            }
        })
    }

    setParticipantsListInSession = (l, session, extra = {}) => {
        let sl = this.state.activity.sessionsList;
        let s = sl.findIndex(i => i.item === session);
        sl[s] = { ...sl[s], participants: l, ...extra }
        this.setState({ activity: { ...this.state.activity, sessionsList: sl } })
    }

    getSessionsList = id => {
        return AXIOS_REQUEST(`${INS_ACTIVIDADES_DETALLES}${id}`).then(resp => {
            let today = new Date().getTime();
            let completed = resp.data.reduce((prev, current) => {
                let past = new Date(current.fecha.replace(/^(.+)T(.+)/, `$1T${current.hora_ini}`)).getTime() < today;
                current.shouldMakeAttendance = past;
                return past ? ++prev : prev
            }, 0);
            this.props.onLoadedList(
                {
                    completed,
                    sessionsList: resp.data
                }
            )
            this.setState({
                activity: { ...this.props.activity, sessionsList: resp.data }
            })
        })
    }

    componentDidMount() {
        if (!!(this.props.activity.sessionsList)) {
            this.setState({
                activity: this.props.activity
            })
        } else {
            this.getSessionsList(this.props.activity.id);
        }
    }

    render() {
        const { activity, modal } = this.state;
        return (
            <>
                <ModalUI open={modal?.open || false} {...modal} />
                {!(activity) ?
                    <Loader2 open>Consultando sesiones</Loader2>
                    :
                    <div className="list-group">
                        <Sessions list={activity.sessionsList} statusCallback={() => { }} action={this.openSessionDetails} />
                    </div>
                }
            </>
        );
    }
}

export default SessionsAndParticipants;