import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getHoursTransactions } from '../../../store/user/actions/userAction';
import { Loader2 } from "./../../../components/UI/Loader"
class HoursHistoryScreen extends Component {

    constructor(props) {
        super(props);

        this.pagerStep = 10;
        this.state = {
            loader: null,
            list: null,
            maxPager: this.pagerStep,
            pager: 0
        }
    }

    printRow = (item, idx) => {
        return <tr key={idx}>
            <td className="text-success"><b>{item.horas}</b></td>
            <td>{item.actividad}</td>
            <td className="text-truncate" style={{ maxWidth: "200px" }}>{item.fechasesion.replace(/^(.+)\s(\d{2}:\d{2}):\d{2}/, "$1, $2")}</td>
            <td className="text-truncate" style={{ maxWidth: "200px" }}>{item.fechatransac.replace(/^(.+)T(\d{2}:\d{2}):\d{2}/, "$1, $2")}</td>
        </tr>;
    }

    getTransactions = (pager) => {
        this.setState({
            loader: "Consultando historial de horas",
            pager,
            maxPager: pager > this.state.maxPager ? pager : this.state.maxPager
        })
        this.props.getHoursTransactions(pager).then(resp => {
            this.setState({ loader: null, list: resp.data || [] })
        })
    }

    nextPage = () => {
        this.props.list.length === 10 && this.getTransactions(this.state.pager + this.pagerStep)
    }

    prevPage = () => {
        this.state.pager > 0 && this.getTransactions(this.state.pager - this.pagerStep)
    }

    goToFirstPage = () => {
        this.getTransactions(0)
    }
    goToLastPage = () => {
        if (this.state.maxPager > this.pagerStep && this.state.maxPager > this.state.pager) {
            this.getTransactions(this.state.maxPager)
        }
    }

    componentDidMount() {
        if (!(this.props.list?.length)) {
            this.getTransactions(this.state.pager);
        } else {
            this.setState({ list: this.props.list })
        }
    }

    render() {
        return (<>
            <div className="row mb-4 pb-2 justify-content-center">
                <div className="col-12 ">
                    <div className="row">
                        <div className="col">
                            <div className="card border-0 shadow-none bg-light text-center text-muted">
                                <h6 className="mb-0 p-3"><b className="d-block mb-1">Mis horas</b>{this.props.userStatus.totalhoras}</h6>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card border-0 shadow-none bg-light text-center text-muted">
                                <h6 className="mb-0 p-3"><b className="d-block mb-1">Mi rango</b>{this.props.userStatus.lealtad || "."}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card border-0 mb-5">
                <div className="card-body ">
                    <div className="mb-4 text-muted ">
                        <b className="rounded-pill bg-light pl-4 pr-4 pb-2 pt-2 mb-3">Historial de horas acumuladas</b>
                        <p className="mt-3 mb-4">| Solo se muestran las horas acumuladas de las actividades que ya han sido finalizadas por completo.</p>
                    </div>
                    {!!(this.state.loader) ? <Loader2 color="warning" open={true}>{this.state.loader}</Loader2> :
                        !(this.props.list?.length) && !(this.state.loader) ?
                            <div className="row mb-4 pb-2 justify-content-center">
                                <div className="col-12 text-center">
                                    <h6 className="mb-0 p-3">No tienes horas acumuladas, debes inscribirte en actividades para sumar horas</h6>
                                    <NavLink to="/inscripcion">¡Mira estas ofertas!</NavLink>
                                </div>
                            </div>
                            : this.props.list?.length > 0 &&
                            <div className="table-responsive-sm">
                                <table className="table table-hover table-borderless">
                                    <thead className="border-bottom">
                                        <tr>
                                            <th scope="col">Horas</th>
                                            <th scope="col" style={{ minWidth: "150px" }}>Actividad</th>
                                            <th scope="col" style={{ minWidth: "200px" }}>Sesión</th>
                                            <th scope="col" style={{ minWidth: "200px" }}>Fecha transacción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.list?.map((i, idx) => this.printRow(i, idx))}
                                    </tbody>
                                </table>
                            </div>
                    }
                    {!(this.state.loader) &&
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Pagination aria-label="Page navigation">
                                    <PaginationItem disabled={this.state.pager === 0}>
                                        <PaginationLink tag="button" first onClick={() => this.goToFirstPage()} />
                                    </PaginationItem>
                                    <PaginationItem disabled={this.state.pager === 0} onClick={() => this.prevPage()}>
                                        <PaginationLink tag="button" previous />
                                    </PaginationItem>
                                </Pagination>
                            </div>
                            <div>
                                <span className="badge badge-pill badge-info mt-3 pr-3 pl-3">
                                    {this.state.pager + 1} - {this.state.pager + (this.props.list?.length || 0)}
                                </span>
                            </div>
                            <div>
                                <Pagination>
                                    <PaginationItem disabled={this.props.list?.length < 10} onClick={() => this.nextPage()}>
                                        <PaginationLink tag="button" next />
                                    </PaginationItem>
                                    <PaginationItem disabled={this.state.maxPager <= this.pagerStep || this.state.maxPager === this.state.pager}
                                        onClick={() => this.goToLastPage()}>
                                        <PaginationLink tag="button" last />
                                    </PaginationItem>
                                </Pagination>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>);
    }
}

const mapStateToProps = state => ({
    userStatus: state.user.userStatus,
    list: state.user.hoursTransactions
})

const mapDispatchToProps = dispatch => ({
    getHoursTransactions: pag => dispatch(getHoursTransactions(pag))
})

export default connect(mapStateToProps, mapDispatchToProps)(HoursHistoryScreen);