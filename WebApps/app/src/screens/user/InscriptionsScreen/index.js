import React, { Component } from 'react';
import { connect } from "react-redux";
import "./index.css";
import { Play, Stop } from '../../../components/UI/Icons';
import ModalUI from '../../../components/ModalUI';
import Loader from '../../../components/UI/Loader';
import { getActivitiesList, setShowAllActivities } from '../../../store/user/actions/activitiesAction';
import CardActivity from '../../../components/UI/CardActivity';
import Switch from '../../../components/UI/Switch';

class InscriptionsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: null,
            loader: null,
            list: null,
            showAll: props.showAll
        }
    }

    getActivities = () => {
        this.props.getActivitiesList().then(resp => {
            this.setState({ loader: null, list: this.getList(this.state.showAll, resp) })
        }).catch(err => {
            this.setState({
                loader: null,
                modal: {
                    type: "danger",
                    title: "Ops..",
                    onClosed: () => this.setState({ modal: null }),
                    size: "sm",
                    children: <>
                        <p className="text-center">Hubo un error, intente más tarde</p>
                    </>,
                    buttons: [{ color: "success", text: "OK", close: true }]
                }
            })

        })
    }

    getList = (all, list = this.props.list) => {
        return all ? list : list.filter(i => [1, 2].includes(i.id_depart))
    }

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `inscripcion/${item.id}`,
            state: item
        })
    }

    onChangeShowAll = (check) => {
        this.setState({ showAll: check, list: this.getList(!check) }, () => {
            this.props.setShowAllActivities(!check);
        })
    }

    componentDidMount() {
        this.setState({ loader: "Consultando actividades" });
        this.getActivities();
    }

    printActivityCard = () => {
        return this.state.list.map((e, i) =>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4" key={i}>

                <CardActivity
                    action={() => this.goToActivityDetails(e, i)}
                    head={<p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                        <b>{e.nomb_acti}</b>
                    </p>}
                    foot={[{ text: "Cupos", value: e.cupos - e.inscritos }, { text: "Sesiones", value: e.sesiones }, { text: "Puntos", value: e.puntos }]}
                    buttonText={e.cupos - e.inscritos === 0 ? "Sin cupos" :"Inscribirme"}
                    body={<p className="text-muted limit-text-3-lines text-center">{e.descripcion}</p>}
                >
                    <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                        <div className="mr-2 text-success">
                            <Play size={20} />
                        </div>
                        <div>
                            <small>
                                <b className="d-block">Inicia el</b> {new Date(e.inicio).toLocaleString([], { month: window.innerWidth < 440 ? "short" : "long", day: "2-digit", year: "numeric" })}
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

    render() {
        const { list } = this.state;
        return (
            <div className="content-list">
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <ModalUI open={!!(this.state.modal)} {...this.state.modal}></ModalUI>
                <div className="activity-list">

                    <div className="row">
                        <div className='col-12'>
                            <div className='d-flex align-items-center mb-3'>
                                <Switch size={"sm"} className="inactive-bg-light mr-2" checked={!this.state.showAll} onToggle={this.onChangeShowAll} />
                                <div className='text-gray pb-1'>
                                    Solo mostrar actividades de bienestar institucional
                                </div>
                            </div>
                        </div>
                        {!!(list?.length) && this.printActivityCard()}
                    </div>
                    {list?.length === 0 && <div className="text-center pt-5" style={{ color: "gray" }}>
                        <h6 className="mt-5">No hay actividades disponibles en este momento</h6>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.activities.list,
    showAll: state.activities.showAllActivities
})

const mapDispatchToProps = dispatch => ({
    getActivitiesList: () => dispatch(getActivitiesList()),
    setShowAllActivities: (bool) => dispatch(setShowAllActivities(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(InscriptionsScreen);