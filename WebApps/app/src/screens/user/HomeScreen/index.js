import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import CardActivity from '../../../components/UI/CardActivity';
import { Play, Stop } from '../../../components/UI/Icons';
import Loader from '../../../components/UI/Loader';
import { getSubscribedActivities, setSubscribedActivities } from '../../../store/user/actions/activitiesAction';
import './styles.css';
import UserStatus from './UserStatus';

class HomeScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            loader: null
        }
    }

    goToPage = (page) => !!(page) && this.props.history.push(page);

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `inicio/${index}`,
            state: item
        })
    }

    printActivityCard = () => {
        return this.props.list.map((e, i) =>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4" key={i}>
                <CardActivity
                    action={() => this.goToActivityDetails(e, i)}
                    head={
                        <p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                            <b>{e.nomb_acti}</b>
                        </p>}
                    foot={[{ text: "Sesiones", value: e.sesiones }, { text: "Inscritos", value: e.inscritos }, { text: "Puntos", value: e.puntos }]}
                    buttonText="Ver detalles"
                >
                    <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                        <div className="mr-2 text-success">
                            <Play size={20} />
                        </div>
                        <div>
                            <small>
                                <b className="d-block">{new Date().getTime() < new Date(e.inicio).getTime() ? "Inicia " : "Inició "}el
                                </b> {new Date(e.inicio).toLocaleString([], { month: window.innerWidth < 440 ? "short" : "long", day: "2-digit", year: "numeric" })}
                            </small>
                        </div>
                    </div>
                    <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                        <div className="mr-2 text-danger">
                            <Stop size={20} />
                        </div>
                        <div>
                            <small className="d-block">
                                <b className="d-block">Termina el</b> {new Date(e.fin).toLocaleString([], { month: window.innerWidth < 440 ? "short" : "long", day: "2-digit", year: "numeric" })}
                            </small>
                        </div>
                    </div>
                </CardActivity>
            </div>
        )
    }

    componentDidMount() {
        if (!(this.props.list?.length)) {
            this.setState({ loader: "Consultando mis actividades" })
            this.props.getSubscribedActivities().then(resp => {
                this.setState({ loader: null })
            }).catch(err => {
                this.setState({ loader: null })
            })
        }
    }

    render() {
        return (
            <>
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div className="row mb-5">
                    <UserStatus goToPage={this.goToPage} />
                </div>

                <div className="row mb-4 pb-2 justify-content-center mt-xl-4">
                    <div className="col-12">
                        <p className="border-bottom" style={{ lineHeight: "0px", color: "#bfbfbf" }}>
                            <span className="bg-white pr-3"><b>Inscripciones activas</b></span>
                        </p>
                    </div>
                </div>
                {
                    this.props.list.length > 0 ?
                        <div className="row activity-list">
                            {this.printActivityCard()}
                        </div>
                        :
                        <div className="row mb-4 pb-2 justify-content-center">
                            <div className="col-12 text-center">
                                <h6 className="mb-0 p-3">No estás inscrito en ningúna actividad</h6>
                                <NavLink to="/inscripcion">¡Busca una e inscribete!</NavLink>
                            </div>
                        </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    list: state.activities.subscribed
})

const mapDispatchToProps = dispatch => ({
    getSubscribedActivities: () => dispatch(getSubscribedActivities()),
    // unsubscribeMe: (data) => dispatch(unsubscribe(data)),
    setList: (data) => dispatch(setSubscribedActivities(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);