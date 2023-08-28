import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { compare2Objects } from '../../../services/constants';
import { ACTIVITIES_LIST } from '../../../services/endPoints';
import { getPeriods, setPaginationsIndex, setQueryParamsToSearch } from '../../../store/admin/actions/activitiesAction';
import List from './List';

let maxPagerList = 0;

class AntivitiesManagement extends Component {

    constructor(props) {
        super(props);

        this.searchParams = props.queryParamsToSearch.actManagement || {
            docente: "",
            nombre: "",
            categoria: ""
        }

        this.state = {
            queryParamsToSearch: this.searchParams,
            openSearchTab: !!(props.queryParamsToSearch.actManagement)
        }
    }

    componentDidMount() {
        if (!(this.props.periods?.length)) {
            this.props.getPeriods();
        }
    }

    getList = (data) => AXIOS_REQUEST(ACTIVITIES_LIST, "POST", { ...this.searchParams, ...data })
        .then(resp => resp.msg !== "ERROR" ? resp.data : [])

    goToUpdate = (item) => {
        this.props.history.push({
            pathname: `/gestion-actividades/${item.id}`,
        })
    }

    toggleSearchTab = () => {
        this.setState({ openSearchTab: !(this.state.openSearchTab) }, () => {
            if (!(this.state.openSearchTab)) {
                this.searchParams = { docente: "", nombre: "", categoria: "" }
                if (!compare2Objects(this.searchParams, this.state.queryParamsToSearch)) {
                    this.setState({
                        queryParamsToSearch: null
                    }, () => {
                        this.setPagination(0);
                        this.setState({
                            queryParamsToSearch: this.searchParams
                        })
                    })
                }
            }
        })
    }

    searchByParams = () => {
        let form = document.getElementById("searchForm");
        let formData = new FormData(form);
        this.searchParams = {
            nombre: formData.get("nombre"),
            docente: formData.get("docente"),
            categoria: formData.get("categoria"),
        };
        if (!compare2Objects(this.searchParams, this.state.queryParamsToSearch)) {
            this.setState({ queryParamsToSearch: null }, () => {
                this.setPagination(0);
                this.setState({
                    queryParamsToSearch: this.searchParams
                })
            })
        }
    }

    setPagination = (p) => {
        if (p > maxPagerList) {
            maxPagerList = p;
        }

        this.props.setPaginationsIndex({ ...this.props.paginationsIndex, actManagement: p })
    }

    componentWillUnmount() {
        if (compare2Objects({ docente: "", nombre: "", categoria: "" }, this.searchParams)) {
            this.props.setQueryParamsToSearch({ ...this.props.queryParamsToSearch, actManagement: null })
        } else {
            this.props.setQueryParamsToSearch(
                { ...this.props.queryParamsToSearch, actManagement: this.searchParams }
            )
        }
    }

    render() {
        return (
            <div className="mb-5">
                <div>
                    <h4 className="text-gray mb-5">Gestión de actividades</h4>
                </div>
                <div className="mb-5 d-flex justify-content-between flex-wrap">
                    <Link className="btn btn-outline-info mb-3" to={"/gestion-actividades/nuevo"}>+ Registrar nueva actividad</Link>
                    <div>
                        <button className="btn btn-outline-info rounded" onClick={() => this.toggleSearchTab()}>
                            {this.state.openSearchTab ? "Cerrar búsqueda" : "Buscar actividad"}
                        </button>
                    </div>
                </div>

                <Collapse isOpen={this.state.openSearchTab}>
                    <div className="card border-0 mb-4">
                        <div className="card-body">
                            <p className="text-gray">Todos los parametros para la búsqueda son opcionales</p>
                            {this.state.openSearchTab &&
                                <form name="searchForm" id="searchForm">
                                    <div className="form-row align-items-center flex-wrap">
                                        <div className="form-group col-12 col-md">
                                            <label htmlFor="nombre">Actividad</label>
                                            <input defaultValue={this.searchParams.nombre} type="search" className="form-control" id="nombre" name="nombre" placeholder="Nombre de la actividad"
                                            />
                                        </div>
                                        <div className="form-group col-12 col-md">
                                            <label htmlFor="docente">Docente</label>
                                            <input defaultValue={this.searchParams.docente} type="search" className="form-control" id="docente" name="docente" placeholder="Nombre del docente encargado" />
                                        </div>
                                        <div className="form-group col-12 col-md">
                                            <label htmlFor="categoria">Categoría</label>
                                            <input defaultValue={this.searchParams.categoria} type="search" className="form-control" id="categoria" name="categoria" placeholder="Categoría de la actividad" />
                                        </div>
                                        <div className="form-group col-12 col-md-2 col-xl-1 mb-1 mt-3 text-md-right text-center">
                                            <button type="button" className="btn btn-success" onClick={() => this.searchByParams()}>Buscar</button>
                                        </div>
                                    </div>
                                </form>}
                        </div>
                    </div>
                </Collapse>

                <div className="card border-0">
                    <div className="card-body">
                        <p className="text-muted text-center">
                            <b>Listado de actividades del periodo actual</b>
                        </p>
                        <br />
                        {!(this.props.periods?.length) ?
                            <Loader2 open>Cargando actividades</Loader2>
                            : !!(this.state.queryParamsToSearch) &&
                            <List
                                paginationsIndex={this.props.paginationsIndex.actManagement}
                                setPaginationsIndex={this.setPagination}
                                maxPager={maxPagerList}
                                period={this.props.periods[0]}
                                getListFunction={this.getList}
                                onClickRowFunction={this.goToUpdate}
                                queryParamsToSearch={this.state.queryParamsToSearch}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    periods: state.activities.periods,
    paginationsIndex: state.activities.paginationsIndex,
    queryParamsToSearch: state.activities.queryParamsToSearch
})

const mapDispatchToProps = dispatch => ({
    getPeriods: () => dispatch(getPeriods()),
    setPaginationsIndex: (obj) => (dispatch(setPaginationsIndex(obj))),
    setQueryParamsToSearch: (obj) => (dispatch(setQueryParamsToSearch(obj))),
})

export default connect(mapStateToProps, mapDispatchToProps)(AntivitiesManagement);