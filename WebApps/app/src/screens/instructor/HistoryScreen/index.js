import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import ActivityCard from './ActivityCard';
import { Stack } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { getActivitiesHistoryList, getPeriods, setSelectedPeriod } from '../../../store/admin/actions/activitiesAction';
import { exportToSpreadsheet } from '../../../services/xlsxService';

class HistoryScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loader: null,
            list: null
        }

        this.periodsField = createRef();
    }

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

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `historial/${index}`,
            state: {...item, periodoactivo: this.props.periods?.[0]}
        })
    }

    getList = (period) => {
        if (!(this.props.activities[period])) {
            this.setState({ loader: `Consultando actividades${!!(period) ? ` del periodo ${period}` : ""}` })
            this.props.getHistoryList(period).then(resp => {
                this.setState({
                    loader: null, list: resp?.filter(item => item.tieneaprob === true)
                })
            })
        } else {
            this.setState({ list: this.props.activities[period].filter(item => item.tieneaprob === true) })
        }
    }

    handlePeriod = p => this.getList(p);

    printActivityCard = () => {
        return this.state.list
            .map((e, i) =>
                <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={i}>
                    <ActivityCard data={e} index={i} action={this.goToActivityDetails} />
                </div>
            )
    }

    downloadList = () => {
        this.setState({ loader: "Generando archivo" }, () => {
            exportToSpreadsheet(this.state.list, `Actividades ${this.periodsField.current.value}`)
                .then(respSheet => {
                    setTimeout(() => {
                        this.setState({ loader: null });
                    }, 5000)
                })
        });
    }

    render() {
        return (
            <div>
                <h4 className="text-gray mb-5">Historial de actividades</h4>
                <div className=" mb-4">
                    <div className="form-inline">
                        <label className="my-1 mr-sm-2" htmlFor="period_filter">Periodo: </label>
                        <select className="my-1 ml-3 form-control col-6 col-sm-5 col-md-4 col-lg-3 mr-3" defaultValue={this.props.selectedPeriod} onChange={e => this.handlePeriod(e.target.value)} ref={this.periodsField}>
                            {!!(this.props.periods) ?
                                this.props.periods?.map(p => <option key={p} value={p}>{p}</option>)
                                :
                                <option value={this.props.selectedPeriod}>Cargando...</option>
                            }
                        </select>

                        {this.state.list?.length > 0 && !(this.state.loader) && <button className="btn btn-outline-info btn-sm" onClick={() => this.downloadList()}>Descargar lista</button>}

                    </div>
                </div>
                <div className="mt-3">
                    {this.state.list?.length > 0 && !(this.state.loader) ? <>
                        <div className="row activity-list">
                            {this.printActivityCard()}
                        </div>
                    </>
                        :
                        !!(this.state.loader) ?
                            <Loader2 open={true} color="warning">{this.state.loader}</Loader2>
                            :
                            <div className="row mb-4 mt-5 pt-5 justify-content-center">
                                <div className="col-12 mt-5 pt-5 text-gray text-center ">
                                    <p className="mt-5 pt-5"><Stack size={40} /></p>
                                    <h6 className="mb-0">No hay nada para mostrar</h6>
                                    {/* <NavLink to="/inscripcion">!Inscribete en actividades!</NavLink> */}
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    activities: state.activities.historyList,
    periods: state.activities.periods,
    selectedPeriod: state.activities.selectedPeriod
})
const mapDispatchToProps = dispatch => ({
    getHistoryList: (period) => dispatch(getActivitiesHistoryList(period)),
    setSelectedPeriod: (period) => dispatch(setSelectedPeriod(period)),
    getPeriods: () => dispatch(getPeriods())
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);