import React, { Component } from 'react';
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import ModalUI from '../ModalUI';
import NewSession from '../../forms/admin/NewSession';
import './style.css';
import { CheckIcon, WarningIcon } from '../UI/Icons';
import { UncontrolledTooltip } from 'reactstrap';

const objToDate = ({ year, month, day }) => {
    return new Date(year, month - 1, day).toLocaleString([], { dateStyle: "full" })
}

const compare2ObjDates = (obj1, obj2) => {
    return new Date(obj1.year, obj1.month - 1, obj1.day).getTime() > new Date(obj2.year, obj2.month - 1, obj2.day);
}

const isSunday = ({ year, month, day }) => new Date(year, month - 1, day).getDay() === 0;

class CreateSessions extends Component {
    constructor(props) {
        super();

        this.state = {
            error: null,
            selectedDays: [],
            confirmDataAfterNewSession: true,
            dayEventInfo: {},
            modal: null
        }
    }

    defaultEventData = null;

    sessionModal = (selectedDay) => {
        let dayData = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
        let info = this.state.dayEventInfo[dayData];
        if (!!(info)) {
            info = {
                ...info, expositores: !!(info.expositores) ? info.expositores.split(", ")?.map(e =>
                    JSON.parse(e.replace(/^(.+)\s+<(.+)>$/, function (str, name, email) { return JSON.stringify({ name, email }) }))
                ) : []
            }
        }
        this.setState({
            modal: {
                open: true,
                closeIcon: true,
                type: "info",
                onClosed: () => {
                    this.setState({ modal: null })
                },
                title: "Datos de la sesión",
                children: <>
                    <p className="text-center mb-5 text-muted">
                        <b className="bg-light rounded-pill pt-2 pb-2 pr-3 pl-3">{objToDate(selectedDay)}</b>
                    </p>
                    <NewSession
                        disabled={(!!(this.props.disabled) || !!(info?.notDeletable))}
                        defaultData={info}
                        onSubmit={(data) => {
                            if (!(this.props.disabled)) {
                                if (this.state.dayEventInfo.hasOwnProperty(dayData)) {
                                    this.updateOneSession(dayData, data);
                                } else {
                                    if (!(this.defaultEventData)) {
                                        this.defaultEventData = data;
                                    }
                                    this.addOneSession(selectedDay, data);
                                }
                            } else {
                                this.setState({ modal: null })
                            }
                        }}
                    /></>
            }
        })
    }

    onChangeCalendar = (selectedDays) => {
        if (this.state.selectedDays.length === 0 && !(this.defaultEventData)) {
            if (isSunday(selectedDays[0]) || !!(this.props.disabled)) { return null }
            this.sessionModal(selectedDays[0])
        } else {
            let idx = selectedDays.length;
            try {
                if (isSunday(selectedDays[idx - 1])) { return null }
                idx = this.state.selectedDays.findIndex(
                    ({ day, month, year }, i) => !(day === selectedDays[i].day && month === selectedDays[i].month && year === selectedDays[i].year)
                );
            } catch (error) { }
            if (!!(this.props.disabled)) {
                this.state.selectedDays.length > 0 && idx >= 0 && this.sessionModal(this.state.selectedDays[idx])
            } else {
                idx >= 0 ? this.removeOneSession(idx) : (
                    !!(this.defaultEventData) ?
                        this.addOneSession(selectedDays.pop(), this.defaultEventData)
                        : this.sessionModal(selectedDays.pop()))
            }
        }
    }

    removeOneSession = (idx) => {
        let { selectedDays, dayEventInfo } = this.state;
        let removed = selectedDays.splice(idx, 1)?.[0];
        let day = `${removed.year}-${removed.month}-${removed.day}`;
        !!(this.props.handleActions) && !!(dayEventInfo[day].item) && this.props.handleActions("delete", dayEventInfo[day].item);
        delete dayEventInfo[day];
        this.setState({ selectedDays, dayEventInfo })
    }

    updateOneSession = (day, data) => {
        let { dayEventInfo } = this.state;
        !!(this.props.handleActions) && !!(dayEventInfo[day].item) && this.props.handleActions("update", dayEventInfo[day].item);
        dayEventInfo[day] = data;
        this.setState({ dayEventInfo, modal: null });
    }

    addOneSession = (insertDay, data) => {
        let { selectedDays, dayEventInfo } = this.state;
        let day = `${insertDay.year}-${insertDay.month}-${insertDay.day}`;
        dayEventInfo[day] = data;

        if (selectedDays.length === 0) {
            selectedDays.push(insertDay);
        } else if (selectedDays.length === 1) {
            compare2ObjDates(insertDay, selectedDays[0]) ? selectedDays.push(insertDay) : selectedDays.unshift(insertDay);
        } else {
            if (compare2ObjDates(selectedDays[0], insertDay)) {
                selectedDays.unshift(insertDay);
            } else if (compare2ObjDates(insertDay, selectedDays[selectedDays.length - 1])) {
                selectedDays.push(insertDay);
            } else {
                for (let i = 0; i < selectedDays.length - 1; i++) {
                    const h_min = compare2ObjDates(insertDay, selectedDays[i]);
                    if (h_min) {
                        const l_max = compare2ObjDates(selectedDays[i + 1], insertDay);
                        if (l_max) {
                            selectedDays.splice(i + 1, 0, insertDay);
                            break;
                        }
                    }
                }
            }
        }
        if (this.state.confirmDataAfterNewSession && selectedDays.length > 1) {
            this.sessionModal(insertDay)
            this.setState({ selectedDays, dayEventInfo });
        } else {
            this.setState({ selectedDays, dayEventInfo, modal: null });
        }
        !!(this.props.handleActions) && this.props.handleActions("insert", day);
    }

    removeAllSessions = () => {
        this.defaultEventData = null;
        let { dayEventInfo, selectedDays } = this.state;
        selectedDays = selectedDays.filter(sd => {
            sd = `${sd.year}-${sd.month}-${sd.day}`;
            if (!!(dayEventInfo[sd].notDeletable)) {
                return true;
            }
            !!(this.props.handleActions) && !!(dayEventInfo[sd].item) && this.props.handleActions("delete", dayEventInfo[sd].item);
            delete dayEventInfo[sd];
            return false;
        });
        this.setState({ selectedDays, dayEventInfo })
    }

    handleSubmit = (submit) => {
        if (submit) {
            if (this.state.selectedDays.length === 0) {
                this.setState({ error: "Debe registrar al menos 1 sesión" })
                return false;
            }
        }
        return this.state.selectedDays.map(({ day, month, year }) => {
            let fecha = `${year}-${month}-${day}`;
            return { fecha, ...this.state.dayEventInfo[fecha] };
        })
    }

    componentDidMount() {
        if (this.props.sessions.length) {
            let selectedDays = [];
            let dayEventInfo = {}

            selectedDays = this.props.sessions.map(({ fecha, ...eventInfo }) => {
                let date = fecha.split("-").map(d => Number(d));
                dayEventInfo[`${date[0]}-${date[1]}-${date[2]}`] = eventInfo;
                return { day: date[2], month: date[1], year: date[0] }
            })
            this.setState({ selectedDays, dayEventInfo })
        }
    }

    render() {
        const { selectedDays, error, modal, dayEventInfo, confirmDataAfterNewSession } = this.state;
        const { cancelBtn, submitBtn, disabled } = this.props;

        return (
            <div>
                <ModalUI open={false} {...modal} />
                <div className="mb-5">
                    {!(disabled)
                        &&
                        <div className="custom-control custom-switch z-index-0" >
                            <input type="checkbox" className="custom-control-input" id="confd" checked={confirmDataAfterNewSession}
                                onChange={(e) => {
                                    this.setState({ confirmDataAfterNewSession: e.target.checked })
                                }} />
                            <label className="text-gray custom-control-label" htmlFor="confd" >Confirmar datos cuando se agrega una sesión</label>
                        </div>
                    }
                </div>
                {!(disabled) && <div className="d-flex align-items-center justify-content-sm-around  flex-column flex-sm-row">
                    <div className="mb-3">
                        <Calendar
                            value={selectedDays}
                            onChange={this.onChangeCalendar}
                            shouldHighlightWeekends
                            minimumDate={utils().getToday()}
                            // maximumDate={}
                            // locale={myCustomLocale}
                            selectorStartingYear={0}
                            calendarClassName="shadow-none border mx-auto z-index-0"
                            calendarSelectedDayClassName="shadow rounded-pill"
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-sm-column">
                        <div className="text-center">
                            Sesiones
                            <h4 >{selectedDays.length}</h4>
                            {error && selectedDays.length === 0 && <div className="text-danger mt-4">
                                <small><WarningIcon size={13} /></small><small className="ml-2">{error}</small>
                            </div>}
                        </div>
                        {!(disabled) && selectedDays.length > 0 && <div className="mt-0 mt-sm-4 ml-5 ml-sm-0">
                            <button className="btn btn-danger rounded-pill btn-sm" onClick={this.removeAllSessions}>Remover todas</button>
                        </div>}
                    </div>
                </div>}
                <div className="row mt-4 sessions-list">
                    {selectedDays.map((d, i) => {
                        let day = dayEventInfo[`${d.year}-${d.month}-${d.day}`];
                        return <div className="col-12 col-sm-6 col-lg-4  h-100 p-2" key={i}>
                            <div className="card bg-light text-muted mb-1 h-100 postion-relative" >
                                {(!!(disabled) || !!(day?.notDeletable)) ?
                                    <div className={`session-indicator`}>{i + 1}</div>
                                    :
                                    <div className={`session-indicator delete`} onClick={() => this.removeOneSession(i)}>{i + 1}</div>
                                }
                                {day.registasist !== "0" &&
                                    <>
                                        <UncontrolledTooltip placement="top" target={`tieneaprob-${day.idact}-${day.item}`}>Tiene registro de asistencia</UncontrolledTooltip>
                                        <div id={`tieneaprob-${day.idact}-${day.item}`} className={`session-indicator have-asistance bg-success`}><span><CheckIcon size={24} /></span></div>
                                    </>
                                }
                                <div className="card-body" onClick={() => this.sessionModal(d)}>
                                    <h6 className="text-truncate border-bottom pb-2 text-center"><small><b>{objToDate(d)}</b></small></h6>
                                    <div className="d-flex justify-content-between  flex-wrap text-gray">
                                        <div className="pr-2">
                                            <small><b>Hora inicio:</b></small>
                                            <span className="d-block">{day.horaini}</span>
                                        </div>
                                        <div className="pr-2">
                                            <small><b>Hora fin:</b></small>
                                            <span className="d-block">{day.horafin}</span>
                                        </div>
                                        <div>
                                            <small><b>Tipo de sesión:</b></small>
                                            <span className="d-block">{day.tiposesion}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                {!(disabled) && <div className="d-flex w-100 justify-content-between mt-4">
                    {!!(cancelBtn) && <input className="btn btn-success"  {...cancelBtn} type="button" onClick={() => { cancelBtn.onClick(this.handleSubmit(false)) }} />}
                    <button className="btn btn-success" onClick={() => {
                        let d = this.handleSubmit(true);
                        !!(d) && submitBtn.onClick(d)
                    }}>{submitBtn.text || "Siguiente"}</button>
                </div>}
            </div>
        );
    }
}

export default CreateSessions;