import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CheckIconFill } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { getActivitiesHistoryList } from '../../../store/admin/actions/activitiesAction';
import { getPeriods } from '../../../store/user/actions/activitiesAction';
import ActivityCard from '../HistoryScreen/ActivityCard';

class ApprobationsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: null,
            list: null
        }
    }

    componentDidMount() {
        if (!(this.props.periods)) {
            this.setState({ loader: `Verificando periodo` })
            this.props.getPeriods().then(resp => {
                this.getList(resp[0]);
            })
        } else {
            this.getList(this.props.periods[0])
        }
    }

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `aprobaciones/${index}`,
            state: item
        })
    }

    getList = (period) => {
        if (!(this.props.activities[period])) {
            this.setState({ loader: `Consultando actividades${!!(period) ? ` del periodo ${period}` : ""}` })
            this.props.getHistoryList(period).then(resp => {
                this.setState({
                    loader: null,
                     list: resp?.filter(item => item.tieneaprob === false)
                })
            })
        } else {
            this.setState({ list: this.props.activities[period].filter(item => item.tieneaprob === false) })
        }
    }

    printActivityCard = () => {
        return this.state.list
            .map((e, i) =>
                <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={i}>
                    <ActivityCard data={e} index={i} action={this.goToActivityDetails} />
                </div>
            )
    }

    render() {
        return (
            <div>
                <h4 className="text-gray mb-5">Actividades pendientes de aprobación</h4>
                <div className="mt-3">
                    {this.state.list?.length > 0 && !(this.state.loader) ?
                        <div className="row activity-list">
                            {this.printActivityCard()}
                        </div>
                        :
                        !!(this.state.loader) ?
                            <Loader2 open={true} color="warning">{this.state.loader}</Loader2>
                            :
                            <div className="row mb-4 mt-5 pt-5 justify-content-center">
                                <div className="col-12 mt-5 pt-5 text-gray text-center ">
                                    <p className="mt-5 pt-5"><CheckIconFill size={40} /></p>
                                    <h6 className="mb-0">No hay nada para mostrar</h6>
                                    <h6>Las aprobaciones de actividades están al día</h6>
                                    <Link to="/historial">Revisa en el historial</Link>
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
})
const mapDispatchToProps = dispatch => ({
    getHistoryList: (period) => dispatch(getActivitiesHistoryList(period)),
    getPeriods: () => dispatch(getPeriods())
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprobationsScreen);