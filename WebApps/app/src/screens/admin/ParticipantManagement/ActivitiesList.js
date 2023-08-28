import React, { Component } from 'react';
import ModalUI from '../../../components/ModalUI';
import CardActivity from '../../../components/UI/CardActivity';
import { ChevronRightIcon, Play, Stop } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { PARTICIPANT_CURRENT_ACTIVITIES, PARTICIPANT_HISTORY, PARTICIPANT_HISTORY_DETAILS } from '../../../services/endPoints';
import ActivityHistory from '../../user/ActivityDetails/ActivityHistory';

class ActivitiesList extends Component {

    constructor() {
        super();

        this.state = {
            dni: null,
            activeTab: null,
            period: null,
            list: null,
            historyList: null,
            modal: null,
        }
    }

    goToBackPage = () => {
        this.props.history.goBack();
    }

    getActivitiesList = () => AXIOS_REQUEST(PARTICIPANT_CURRENT_ACTIVITIES + this.state.dni, "GET", null, false, null, { periodo: this.state.period })
        .then(resp => {
            let list = resp.msg !== "ERROR" ? resp.data : [];
            this.setState({
                list
            })
        });

    getActivitiesHistory = () => AXIOS_REQUEST(PARTICIPANT_HISTORY + this.state.dni, "GET", null, false, null, { periodo: this.state.period })
        .then(resp => {
            let historyList = resp.msg !== "ERROR" ? resp.data : [];
            this.setState({
                historyList
            })
        });

    printActivityCard = (list) => list?.map((e, i) =>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4" key={i}>
            <CardActivity
                action={() => this.goToActivityDetails(e, i)}
                head={<p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                    <b>{e.nomb_acti}</b>
                </p>}
                // body={<p className="text-muted limit-text-3-lines text-center">{e.descripcion}</p>}
                body={<p className="text-gray limit-text-2-lines text-center"><small>{e.depart}</small></p>}
                foot={[{ text: "Horas acumuladas", value: e.horasacumuladas || "00:00:00" }, { text: "Estado", value: !!(e.aprobacion) ? (JSON.parse(e.aprobacion).aprobado === 1 ? "Aprobado" : "No aprobado") : "Pendiente" }]}
                buttonText="Ver detalles"
            >
                <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                    <div className="mr-2 text-muted">
                        <Play size={20} />
                    </div>
                    <div>
                        <small>
                            <b className="d-block">Inició el
                            </b> {new Date(e.inicio).toLocaleString([], { month: window.innerWidth < 440 ? "short" : "long", day: "2-digit", year: "numeric" })}
                        </small>
                    </div>
                </div>
                <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                    <div className="mr-2 text-muted">
                        <Stop size={20} />
                    </div>
                    <div>
                        <small className="d-block">
                            <b className="d-block">Terminó el</b> {new Date(e.fin).toLocaleString([], { month: window.innerWidth < 440 ? "short" : "long", day: "2-digit", year: "numeric" })}
                        </small>
                    </div>
                </div>
            </CardActivity>
        </div>
    )

    goToActivityDetails = item => {
        this.setState({
            modal: {
                open: true,
                title: "",
                size: "xl",
                closeIcon: true,
                children: <div className="mb-5">
                    <ActivityHistory
                        url={`${PARTICIPANT_HISTORY_DETAILS}${this.state.dni}/`}
                        hideStarsRating
                        match={{ params: {} }}
                        location={
                            { state: item }
                        }
                    />

                </div>,
                onClosed: () => this.setState({ modal: null }),
                buttons: [{ color: "success", text: "Cerrar", close: true }]
            }
        })
    }

    selectTab = (tab) => {
        if (tab === "0") {
            !(this.state.historyList) && this.getActivitiesHistory()
        } else if (tab === "1") {
            !(this.state.list) && this.getActivitiesList()
        }
        this.setState({
            activeTab: tab
        })
    }

    componentDidMount() {
        const { dni, period } = this.props.match.params;
        if (/^\d{4}-0[1-2]$/.test(period) && !!(dni)) {
            this.setState({ dni, period }, () => this.selectTab("0"))
        } else {
            this.goToBackPage()
        }
    }

    render() {
        return (
            <>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Actividades del periodo {this.state.period}</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="mb-5">
                    <span className="text-gray rounded-pill pl-4 pr-4 pt-2 pb-2 bg-white shadow-sm">Participante <b>{this.state.dni}</b></span>
                </div>

                <div className="mb-5">
                    <nav className="nav nav-tabs flex-row">
                        <span className={`flex-fill text-center nav-link cursor-pointer ${this.state.activeTab === "0" ? "active bg-warning text-white font-weight-bold rounded-lg border-0" : "text-gray"}`}
                            onClick={() => this.selectTab("0")}>Actividades finalizadas</span>
                        <span className={`flex-fill text-center nav-link cursor-pointer ${this.state.activeTab === "1" ? "active bg-warning text-white font-weight-bold rounded-lg border-0" : "text-gray"}`}
                            onClick={() => this.selectTab("1")}>Actividades en curso</span>
                    </nav>
                </div>

                {this.state.activeTab === "1" && <>
                    {this.state.list === null ?
                        <Loader2 open>Consultando actividades en curso</Loader2>
                        :
                        this.state.list.length === 0 ?
                            <div className="alert alert-info">Sin actividades</div>
                            :
                            <div className="row activity-list">
                                {this.printActivityCard(this.state.list)}
                            </div>
                    }
                </>
                }
                {this.state.activeTab === "0" && <>
                    {this.state.historyList === null ?
                        <Loader2 open>Consultando actividades finalizadas</Loader2>
                        :
                        this.state.historyList.length === 0 ?
                            <div className="alert alert-info">Sin actividades</div>
                            :
                            <div className="row activity-list">
                                {this.printActivityCard(this.state.historyList)}
                            </div>
                    }
                </>
                }
            </>
        );
    }
}

export default ActivitiesList;