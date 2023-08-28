import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ChevronRightIcon } from '../../../components/UI/Icons';
import { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ACTIVITIES_HISTORY_1998_2020 } from '../../../services/endPoints';

let paginationsIndexHO = 0;

class Old2010_2020 extends Component {

    constructor() {
        super();

        this.pagerStep = 50;

        this.state = {
            loader2: null,
            list: [],
            maxPager: this.pagerStep,
            pager: paginationsIndexHO || 0,
            queryParamsToSearch: { dni: "", nombres: "" }
        }
    }

    getList = (pager, params = this.state.queryParamsToSearch) => {
        this.setState({
            loader2: "Consultando actividades",
            pager,
            maxPager: pager > this.state.maxPager ? pager : this.state.maxPager
        }, () => {
            let data = { ...params, indice: pager, bd: "2" };

            AXIOS_REQUEST(ACTIVITIES_HISTORY_1998_2020, "POST", data)
                .then(resp => {
                    this.setState({ list: resp.data, loader2: null });
                })
        })
    }

    searchByParams = () => {
        this.getList(0);
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

    goToBackPage = () => this.props.history.goBack();

    componentDidMount() {
        this.getList(this.state.pager);
    }

    render() {
        return (
            <div className="mb-5">
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Históricos desde 2010-02 hasta 2020-02</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="card border-0">
                    <div className="card-body pt-5">
                        <p className="text-gray">Puede filtrar los datos de acuerdo al nombre e identificación del participante</p>
                        <form name="searchForm" id="searchForm">
                            <div className="form-row align-items-center flex-wrap mb-4">
                                <div className="form-group col-12 col-md">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input value={this.state.queryParamsToSearch.nombres}
                                        onChange={e => this.setState({ queryParamsToSearch: { ...this.state.queryParamsToSearch, nombres: e.target.value } })}
                                        type="search"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Nombre del participante"
                                    />
                                </div>
                                <div className="form-group col-12 col-md">
                                    <label htmlFor="nombre">Identificación</label>
                                    <input value={this.state.queryParamsToSearch.dni}
                                        onChange={e => this.setState({ queryParamsToSearch: { ...this.state.queryParamsToSearch, dni: e.target.value } })}
                                        type="search"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Identificación del participante"
                                    />
                                </div>
                                <div className="form-group col-12 col-md-2 col-xl-1 mb-1 mt-3 text-md-right text-center">
                                    <button type="button" className="btn btn-success" onClick={() => this.searchByParams()}>Buscar</button>
                                </div>
                            </div>
                        </form>

                        <Loader2 open={!!(this.state.loader2)}>{this.state.loader2}</Loader2>
                        {!!(this.state.list.length) && !(this.state.loader2) ?
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" >Actividad</th>
                                            <th scope="col">Participante</th>
                                            <th scope="col">Programa</th>
                                            <th scope="col">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.list.map((item, i) => {
                                            const { actividad, nombres, dni, periodo, programa, grupo, instructor, estado } = item;
                                            return <tr key={i} >
                                                <td>
                                                    {actividad}
                                                    <div className="text-gray"><small><b>Instructor:</b> {instructor}</small></div>
                                                    <div className="text-gray d-inline-block mr-2"><small><b>Periodo:</b> {periodo}</small></div>
                                                    <div className="text-gray d-inline-block"><small><b>Grupo:</b> {grupo}</small></div>
                                                </td>
                                                <td>
                                                    {nombres}
                                                    <div><small className="text-gray"><b>DNI:</b> {dni}</small></div>
                                                </td>
                                                <td><small className="text-gray">{programa}</small></td>
                                                <td>{estado}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            : !(this.state.loader2) && <div className="alert alert-info">No se encontraron resultados</div>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default Old2010_2020;