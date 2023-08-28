import React, { Component } from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import Avatar from '../../../components/UI/Avatar';
import { BellFill, CalendarCheckFill, CollectionPlay, PuzzleFill } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { INS_ESTADO } from '../../../services/endPoints';
import { setUserStatus } from '../../../store/admin/actions/userAction';
import { AXIOS_REQUEST } from './../../../services/axiosService'

import "./style.css";

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.userStatus
        }
    }

    listItems = [
        {
            label: <> <small>Actividades</small>
                <h5>En curso</h5>
            </>,
            property: "actencurso",
            page: "/actividades",
            icon: <CollectionPlay size={40} />
        },
        {
            label: <> <small>Pendientes de</small>
                <h5>Aprobación</h5>
            </>,
            property: "actpendaprob",
            page: "/aprobaciones",
            icon: <BellFill size={40} />
        },
        {
            label: <> <small>Actividades</small>
                <h5>Finalizadas</h5>
            </>,
            property: "actperiodoact",
            page: "/historial",
            icon: <PuzzleFill size={40} />
        },
        {
            label: <> <small>periodo</small>
                <h5>Activo</h5>
            </>,
            property: "periodoactivo",
            icon: <CalendarCheckFill size={40} />
        },
    ];

    goToPage = page => {
        this.props.history.push(page)
    }

    componentDidMount() {
        AXIOS_REQUEST(INS_ESTADO).then(resp => {
            let { actpendaprob, actperiodoact, actencurso, evalpromedio, departamento } = resp.data
            evalpromedio = evalpromedio || "0.0";
            actperiodoact = `${Number(actperiodoact || "0") - (Number(actpendaprob || "0") + Number(actencurso || "0"))}`;
            !(departamento) && (departamento = "Sin departamento asociado")
            let data = {
                ...resp.data,
                actpendaprob,
                actencurso,
                departamento,
                evalpromedio,
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
                <div>
                    <h4 className="text-gray mb-5">Inicio</h4>
                </div>

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
                                            {data.departamento ?
                                                <ul className="pl-3 mb-0">
                                                    {data.departamento?.split(",").map((d, oi) => <li className="mb-1 small" key={oi}>{d}</li>)}
                                                </ul>
                                                : <Loader2 open></Loader2>}
                                        </div>
                                    </div>
                                    <div className="col d-flex flex-column flex-sm-row flex-md-column flex-lg-row align-items-sm-center justify-content-between justify-content-md-center mt-4 mt-md-0 border-left">
                                        <div className="mr-4 d-flex flex-row flex-lg-column align-items-center align-items-lg-start mb-md-3 mb-lg-0">
                                            <div className="mr-4 mr-md-3 mr-lg-0">
                                                <span>Calificación</span>
                                                <p className="mb-1">promedio</p>
                                            </div>
                                            <div>
                                                {data["evalpromedio"] ?
                                                    <h2 className="mb-0">{parseFloat(data["evalpromedio"]).toFixed(1)}</h2>
                                                    : <Loader2 open color="warning"></Loader2>}
                                            </div>
                                        </div>
                                        {data["evalpromedio"] && <div className="text-sm-center">
                                            <StarRatings
                                                starDimension={"35px"}
                                                rating={parseFloat(data["evalpromedio"])}
                                                starRatedColor="#ffbf2e"
                                                numberOfStars={5}
                                                starSpacing="0px"
                                            />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row home mb-5">
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
                                            {!!(data[item.property])?
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