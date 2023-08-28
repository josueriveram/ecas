import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardActivity from '../../../components/UI/CardActivity';
import { Play, Stack } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { getActivitiesList } from '../../../store/admin/actions/activitiesAction';

class ActiviesScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loader: null
        }
    }

    componentDidMount() {
        this.setState({ loader: "Consultando actividades" })
        if (!(this.state.activities)) {
            this.props.getActivitiesList().then(resp => {
                this.setState({ loader: null })
            })
        }
    }

    goToActivityDetails = (item, index) => {
        this.props.history.push({
            pathname: `actividades/${index}`,
            state: item
        })
    }

    printActivityCard = () => {
        return this.props.activities.map((e, i) =>
            <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={i}>
                <CardActivity
                    action={() => this.goToActivityDetails(e, i)}
                    head={<p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                        <b>{e.nomb_acti}</b>
                    </p>}
                    // body={<p className="text-muted limit-text-3-lines text-center">{e.descripcion}</p>}
                    foot={[{ text: "Inscritos", value: e.inscritos }, { text: "Aforo", value: e.cupos }, { text: "Sesiones", value: e.sesiones }]}
                    buttonText="Detalles y asistencia"
                >
                    <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                        <div className="mr-2 text-muted">
                            <Play size={20} />
                        </div>
                        <div>
                            <small>
                                <b className="d-block">Próxima sesión
                                </b> {!!(e.proximasesion) ?
                                    new Date(e.proximasesion).toLocaleString([], { dateStyle: window.innerWidth < 440 ? "short" : "long", timeStyle: "short" })
                                    : "En curso ahora"
                                }
                            </small>
                        </div>
                    </div>
                </CardActivity>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h4 className="text-gray mb-5">Actividades en curso</h4>
                <div>
                    {this.props.activities?.length > 0 ?
                        <div className="row activity-list">
                            {this.printActivityCard()}
                        </div>
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
    activities: state.activities.activitiesList
})
const mapDispatchToProps = dispatch => ({
    getActivitiesList: () => dispatch(getActivitiesList())
})

export default connect(mapStateToProps, mapDispatchToProps)(ActiviesScreen);