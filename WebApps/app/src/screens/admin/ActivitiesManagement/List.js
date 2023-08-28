import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink, UncontrolledTooltip } from 'reactstrap';
import { BellFill, InfoIcon } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { exportToSpreadsheet } from '../../../services/xlsxService';

class List extends Component {

    constructor(props) {
        super(props);

        this.pagerStep = props.pagerStep || 20;

        this.state = {
            loader2: null,
            loader: null,
            list: [],
            allList: props.list || [],
            maxPager: this.pagerStep,
            pager: props.paginationsIndex || 0,
        }
    }

    downloadList = () => {
        this.setState({ loader: "Generando archivo" }, () => {
            exportToSpreadsheet(this.state.list, `Actividades ${this.props.period} (De ${this.state.pager + 1} a ${this.state.list.length})${!!(this.props.teacher) ? ` - instructor ${this.props.teacher}` : ""}`)
                .then(respSheet => {
                    setTimeout(()=>{
                        this.setState({ loader: null });
                    }, 5000)
                })
        });
    }

    getList = (pager) => {
        this.setState({
            loader2: "Consultando actividades",
            pager,
            maxPager: pager > this.state.maxPager ? pager : this.state.maxPager
        }, () => {
            let data = { indice: pager, periodo: this.props.period };
            if (!!(this.props.teacher)) {
                data.dnidoc = this.props.teacher;
                data.docente = "";
            }

            this.props.getListFunction(data)
                .then(resp => {
                    this.setState({ allList: [...this.state.allList, ...resp], list: resp, loader2: null });
                })
        })
    }

    nextPage = () => {
        let pager = this.state.pager + this.pagerStep;
        this.state.list?.length === this.pagerStep && this.getList(pager)
    }

    prevPage = () => {
        this.state.pager > 0 && this.getList(this.state.pager - this.pagerStep)
    }

    goToFirstPage = () => {
        this.getList(0);
    }

    goToLastPage = () => {
        if (this.state.maxPager > this.pagerStep && this.state.maxPager > this.state.pager) {
            this.getList(this.state.maxPager)
        }
    }

    componentDidMount() {
        if (!!(this.props.queryParamsToSearch)) {
            this.setState({ allList: [] }, () => {
                this.getList(this.state.pager);
            });
        } else {
            this.getList(this.state.pager);
        }
        if (!!(this.props.maxPager)) {
            this.setState({ maxPager: this.props.maxPager })
        }
    }

    componentWillUnmount() {
        this.props.setPaginationsIndex(this.state.pager);
    }

    render() {
        return (
            <div>
                <Loader2 open={!!(this.state.loader2)}>{this.state.loader2}</Loader2>
                <Loader open={!!(this.state.loader)}>{this.state.loader}</Loader>
                {!!(this.state.list.length) && !(this.state.loader2) ? <>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    {/* <th scope="col">Actividad</th> */}
                                    <th scope="col" >Actividad</th>
                                    <th scope="col">Instructor</th>
                                    <th scope="col" style={{ minWidth: "140px" }}>Duración</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.list.map((item, i) => {
                                    const { depart, id, docente, nomb_acti, fecha_inicio, fecha_fin, inscritos, cupos, tieneaprobaciones } = item;
                                    return <tr key={i} onClick={() => this.props.onClickRowFunction(item)} className="cursor-pointer">
                                        <th scope="row">{id}</th>
                                        <td>
                                            {nomb_acti}
                                            <div className="text-gray">
                                                <small className="mr-2 d-inline-block">Inscritos: <b>{inscritos}</b></small>
                                                <small>Cupos: <b>{cupos}</b></small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {/* <span className="text-truncate">{docente}</span> */}
                                                <span >{docente}</span>
                                                <small className="text-gray d-md-block d-none">{depart}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <small className="d-inline-block"><b>Inicio:</b> {new Date(fecha_inicio).toLocaleString([], { dateStyle: "medium" })}</small>
                                            </div>
                                            <div>
                                                <small className="d-inline-block"><b>Fin:</b> {new Date(fecha_fin).toLocaleString([], { dateStyle: "medium" })}</small>
                                            </div>
                                        </td>
                                        <td className="pl-1 pr-2" id={`tieneaprob-${id}`}>{
                                            inscritos != "0" && tieneaprobaciones === false && new Date(fecha_fin).getTime() < new Date().getTime() ? <>
                                                <UncontrolledTooltip placement="top" target={`tieneaprob-${id}`}>Pendiente de aprobación</UncontrolledTooltip>
                                                <span className="text-white btn btn-warning rounded-pill pt-1 pb-1 pl-2 pr-2"><BellFill /></span>
                                            </> :
                                                <span className="text-info btn btn-light rounded-pill"><InfoIcon /></span>
                                        }
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
                    : !(this.state.loader2) && <div className="alert alert-info">No se encontraron actividades</div>
                }
                {!(this.state.loader2) &&
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
                                {this.state.pager + 1} - {this.state.pager + (this.state.list?.length || 0)}
                            </span>
                        </div>
                        <div>
                            <Pagination>
                                <PaginationItem disabled={!(this.state.list.length === this.pagerStep)} onClick={() => this.nextPage()}>
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

                {!!(this.state.list?.length) && !(this.state.loader2) && <div className="text-center">
                    {!(this.state.loader) && <button className="btn btn-outline-info mt-5 btn-sm" onClick={() => this.downloadList()}>Descargar lista</button>}
                </div>}
            </div>
        );
    }
}

export default List;