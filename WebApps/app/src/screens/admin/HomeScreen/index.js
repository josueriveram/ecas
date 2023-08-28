import React, { Component } from 'react';
import { AXIOS_REQUEST } from './../../../services/axiosService';
import { ADMIN_ESTADO } from '../../../services/endPoints';
import { setUserStatus } from '../../../store/admin/actions/userAction';
import "./style.css";
import { BellFill, CalendarCheckFill, CollectionPlay, PuzzleFill } from '../../../components/UI/Icons';
import Avatar from '../../../components/UI/Avatar';
import { Loader2 } from '../../../components/UI/Loader';
import { connect } from 'react-redux';

// import SearchParticipantIntoActivities from '../../../forms/admin/SearchParticipantIntoActivities';
class HomeScreen extends Component {

    constructor(props) {
        super();
        this.state = {
            loader: null,
            modal: null,
            form: null,
            data: props.userStatus
        }
    }

    listItems = [
        {
            label: <> <small>Actividades</small>
                <h5>En curso</h5>
            </>,
            property: "actencurso",
            page: "/gestion-actividades",
            icon: <PuzzleFill size={40} />
        },
        {
            label: <> <small>Pendientes de</small>
                <h5>Aprobación</h5>
            </>,
            property: "actpendaprob",
            page: "/gestion-actividades",
            icon: <BellFill size={40} />
        },
        {
            label: <> <small>Actividades</small>
                <h5>Finalizadas</h5>
            </>,
            property: "actperiodoact",
            page: "/historicos",
            icon: <CalendarCheckFill size={40} />
        },
        {
            label: <> <small>periodo</small>
                <h5>Activo</h5>
            </>,
            property: "periodoactivo",
            page: "/historicos",
            icon: <CollectionPlay size={40} />
        },
    ];

    goToPage = (page) => !!(page) && this.props.history.push(page);

    componentDidMount() {
        AXIOS_REQUEST(ADMIN_ESTADO).then(resp => {
            let { actpendaprob, actperiodoact, actencurso, departamento } = resp.data
            actperiodoact = `${Number(actperiodoact || "0") - (Number(actpendaprob || "0") + Number(actencurso || "0"))}`;
            !(departamento) && (departamento = "Sin departamento asociado")
            let data = {
                ...resp.data,
                actpendaprob,
                actencurso,
                departamento,
                actperiodoact
            };
            this.setState({ data, loader2: null });
            this.props.setUserStatus(data);
        })
    }

    render() {
        const { data } = this.state;
        const { user } = this.props;
        return (
            <>
                {/* <div>
                    <h4 className="text-gray mb-5">Inicio</h4>
                </div> */}

                <div className="row">
                    <div className="col-12 mb-5">
                        <div className="card border-0 p-3 text-muted profile-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-12 col-sm-2 align-items-center">
                                        <Avatar picture={user.foto} hideName name={user.nombre} lastName={user.apellido} />
                                    </div>
                                    <div className="col-12 col-sm-10 col-md-5 align-items-center mt-3 mt-md-0">
                                        <div>
                                            <p className="mb-1"><b>{user.nombre} {user.apellido}</b></p>
                                            <p className="mb-1"><small>Identificación: {user.dni}</small></p>
                                        </div>
                                    </div>
                                    <div className="col d-flex flex-column flex-sm-row flex-md-column flex-lg-row align-items-sm-center justify-content-between justify-content-md-center mt-4 mt-md-0 border-left">
                                        <div className="mr-4 d-flex flex-row flex-lg-column align-items-center align-items-lg-start mb-md-3 mb-lg-0">
                                            <div className="mr-4 mr-md-3 mr-lg-0">
                                                <p className="mb-1">Departamentos</p>
                                            </div>
                                            <div>
                                                {data.departamento ?
                                                    <ul className="pl-3 mb-0">
                                                        {data.departamento?.split(",").map((d, oi) => <li className="mb-1 small" key={oi}>{d}</li>)}
                                                    </ul>
                                                    : <Loader2 open></Loader2>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row home mb-4">
                    {this.listItems.map(item =>
                        <div className="col-12 col-md-6 mb-4" key={item.property}>
                            <div className="card border-0 p-3 text-muted cursor-pointer" onClick={() => this.goToPage(item.page)}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-4 icon">
                                                {item.icon}
                                            </div>
                                            <div className="label">
                                                {item.label}
                                            </div>
                                        </div>
                                        <div className="d-flex text-end value">
                                            {!!(data[item.property]) ?
                                                <h2 className="mb-0 text-truncate">{data[item.property]}</h2>
                                                :
                                                <Loader2 open></Loader2>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.userInfo,
    userStatus: state.user.userStatus
})
const mapDispatchToProps = dispatch => ({
    setUserStatus: data => dispatch(setUserStatus(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);