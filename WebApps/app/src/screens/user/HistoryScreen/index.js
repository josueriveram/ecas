import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import CardActivity from '../../../components/UI/CardActivity';
import { Play, Stop } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { getHistoryList, getPeriods, setSelectedPeriod } from '../../../store/user/actions/activitiesAction';

class HistoryScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            loader: null,
            list: null
        }

        this.periodsField = createRef();
    }

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `historial/${index}`,
            state: item
        })
    }

    printActivityCard = () => {
        return this.state.list.map((e, i) =>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4" key={i}>
                <CardActivity
                    action={() => this.goToActivityDetails(e, i)}
                    head={<p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                        <b>{e.nomb_acti}</b>
                    </p>}
                    body={<p className="text-muted limit-text-3-lines text-center">{e.descripcion}</p>}
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
    }

    getList = (period) => {
        if (!(this.props.list[period])) {
            this.setState({ loader: `Consultando actividades${!!(period) ? ` del periodo ${period}` : ""}` })
            this.props.getHistory(period).then(resp => {
                this.setState({ loader: null, list: resp })
            }).catch(e => this.setState({ loader: null }))
        } else {
            this.setState({ list: this.props.list[period] })
        }
    }

    handlePeriod = p => this.getList(p);

    componentDidMount() {
        if (!(this.props.periods)) {
            this.props.getPeriods().then(resp => {
                this.getList(resp[0]);
            })
        } else {
            this.getList(this.props.selectedPeriod)
        }
    }

    componentWillUnmount() {
        this.props.setSelectedPeriod(this.periodsField.current.value)
    }

    render() {
        return (
            <>
                {/* <div className="row mb-4 pb-2 justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7 col-xl-6">
                        <div className="bg-light rounded-pill text-center text-muted">
                            <h6 className="mb-0 p-3"><b>Historial de actividades inscritas</b></h6>
                        </div>
                    </div>
                </div> */}
                <div className="row mb-4 pb-2 justify-content-center mt-xl-4">
                    <div className="col-12">
                        <p className="border-bottom" style={{ lineHeight: "0px", color: "#bfbfbf" }}>
                            <span className="bg-white pr-3"><b>Historial de actividades</b></span>
                        </p>
                    </div>
                </div>
                <div className="mt-3 mb-4">
                    <div className="form-inline">
                        <label className="my-1 mr-sm-2" htmlFor="period_filter">Periodo: </label>
                        <select className="my-1 ml-3 form-control col-6 col-sm-5 col-md-4 col-lg-3" defaultValue={this.props.selectedPeriod} onChange={e => this.handlePeriod(e.target.value)} ref={this.periodsField}>
                            {!!(this.props.periods) ?
                                this.props.periods?.map(p => <option key={p} value={p}>{p}</option>)
                                :
                                <option value={this.props.selectedPeriod}>Cargando...</option>
                            }
                        </select>
                    </div>
                </div>
                {this.state.list?.length > 0 && !(this.state.loader) ?
                    <div className="row activity-list">
                        {this.printActivityCard()}
                    </div>
                    :
                    !!(this.state.loader) ?
                        <Loader2 open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader2>
                        :
                        <div className="row mb-4 pb-2 justify-content-center">
                            <div className="col-12 text-center">
                                <h6 className="mb-0 p-3 mt-5 text-gray">No hay nada para mostrar relacionado al periodo seleccionado</h6>
                            </div>
                        </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    list: state.activities.history,
    periods: state.activities.periods,
    selectedPeriod: state.activities.selectedPeriod
})

const mapDispatchToProps = dispatch => ({
    getHistory: (period) => dispatch(getHistoryList(period)),
    setSelectedPeriod: (period) => dispatch(setSelectedPeriod(period)),
    getPeriods: () => dispatch(getPeriods())
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);