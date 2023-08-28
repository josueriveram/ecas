import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader2 } from '../../../components/UI/Loader';
import { getPeriods } from '../../../store/admin/actions/activitiesAction';
import "./style.css"

class History extends Component {

    componentDidMount() {
        if (!(this.props.periods?.length)) {
            this.props.getPeriods();
        }
    }

    goToList = (period) => {
        this.props.history.push("/historicos/" + period)
    }

    render() {
        return (
            <div className="mb-5">
                <div>
                    <h4 className="text-gray mb-5">Históricos</h4>
                </div>
                {!!(this.props.periods?.length) ?
                    <div className="row history-row">
                        {this.props.periods.map(p =>
                            <div className="col-6 col-md-4 col-lg-4" key={p}>
                                <div className="card border-0 mb-3" onClick={() => this.goToList(p)}>
                                    <div className="card-body pt-4 pb-4 d-flex justify-content-center">
                                        <div>
                                            <small>Periodo</small>
                                            <span>{p}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <Loader2 open={true}>Cargando periodos</Loader2>
                }
                <br />
                <hr />
                <div>
                    <h4 className="text-gray mb-5 mt-5">Bases de datos antiguas</h4>
                </div>
                <div className="row history-row">
                    <div className="col-6">
                        <div className="card border-0 mb-3" onClick={() => this.goToList("1998-2010")}>
                            <div className="card-body pt-4 pb-4 d-flex flex-md-row flex-column justify-content-center align-items-center">
                                <div className="mr-md-5">
                                    <small>Desde</small>
                                    <span>1998-01</span>
                                </div>
                                <div className="">
                                    <small>hasta el</small>
                                    <span>2010-01</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card border-0 mb-3" onClick={() => this.goToList("2010-2020")}>
                        <div className="card-body pt-4 pb-4 d-md-flex justify-content-center">
                                <div className="mr-md-5">
                                    <small>Desde</small>
                                    <span>2010-02</span>
                                </div>
                                <div className="">
                                    <small>hasta el</small>
                                    <span>2020-02</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    periods: state.activities.periods
})

const mapDispatchToProps = dispatch => ({
    getPeriods: () => dispatch(getPeriods())
})

export default connect(mapStateToProps, mapDispatchToProps)(History);