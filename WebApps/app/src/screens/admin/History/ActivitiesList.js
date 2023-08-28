import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import { ChevronRightIcon } from '../../../components/UI/Icons';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { compare2Objects } from '../../../services/constants';
import { ACTIVITIES_LIST } from '../../../services/endPoints';
import { getPeriods, setPaginationsIndex } from '../../../store/admin/actions/activitiesAction';
import List from '../ActivitiesManagement/List';

let maxPagerHList = {};
let queryToSearchH = {};
let instructorDni = null;

class ActivitiesList extends Component {

    constructor(props) {
        super(props);

        this.searchParams = { docente: "", nombre: "", categoria: "" }

        this.state = {
            period: null,
            teacher: null,
            queryParamsToSearch: null,
            openSearchTab: false
        }
    }

    goToBackPage = () => this.props.history.goBack();

    goToDetails = (item) => this.props.history.push({
        pathname: `/historicos/actividad/${item.id}`,
    });

    getActivitiesList = (data) => AXIOS_REQUEST(ACTIVITIES_LIST, "POST", { ...this.state.queryParamsToSearch, ...data })
        .then(resp => resp.msg !== "ERROR" ? resp.data : [])

    searchByParams = () => {
        delete maxPagerHList[`${this.state.period}-${this.state.teacher}`];

        let form = document.getElementById("searchForm");
        let formData = new FormData(form);
        let search = {
            nombre: formData.get("nombre"),
            docente: formData.get("docente"),
            categoria: formData.get("categoria"),
        };

        this.setState({ queryParamsToSearch: null }, () => {
            this.setPagination(0)
            this.setQueryToSearch(search)
        })
    }

    toggleSearchTab = () => {
        this.setState({ openSearchTab: !(this.state.openSearchTab) }, () => {
            if (!(this.state.openSearchTab)) {
                if (!compare2Objects(this.searchParams, this.state.queryParamsToSearch)) {
                    delete maxPagerHList[`${this.state.period}-${this.state.teacher}`];

                    this.setState({
                        queryParamsToSearch: null
                    }, () => {
                        this.setPagination(0);
                        this.setQueryToSearch(this.searchParams)
                    })
                } else {
                    delete queryToSearchH[`${this.state.period}-${this.state.teacher}`];
                }
            }
        })
    }

    setPagination = (p) => {
        let actHistory = {
            ...this.props.paginationsIndex.actHistory,
            [`${this.state.period}-${this.state.teacher}`]: p
        }
        this.props.setPaginationsIndex({ ...this.props.paginationsIndex, actHistory })
    }

    setQueryToSearch = (query) => {
        queryToSearchH[`${this.state.period}-${this.state.teacher}`] = query;

        this.setState({
            queryParamsToSearch: query
        })
    }

    componentDidMount() {
        if (/^\d{4}-0[1-2]$/.test(this.props.match.params?.period)) {
            let d = { period: this.props.match.params.period };
            if (!!(this.props.match.params.idinstructor)) {
                if (instructorDni !== this.props.match.params.idinstructor) {
                    this.props.setPaginationsIndex({ ...this.props.paginationsIndex, actHistory: 0 })
                }
                d.teacher = this.props.match.params.idinstructor
                instructorDni = d.teacher;
            };

            d.queryParamsToSearch = queryToSearchH[`${d.period}-${d.teacher || null}`] || this.searchParams;
            d.openSearchTab = !!(queryToSearchH[`${d.period}-${d.teacher || null}`])

            this.setState({
                ...d
            })

        } else {
            this.goToBackPage()
        }
    }

    render() {
        return (
            <div className="mb-5">
                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Actividades del periodo {this.state.period}</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>

                <div className="mb-5">
                    <button className="btn btn-outline-info rounded" onClick={() => this.toggleSearchTab()}>
                        {this.state.openSearchTab ? "Cerrar búsqueda" : "Buscar actividad"}
                    </button>
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
                                            <input defaultValue={this.state.queryParamsToSearch?.nombre} type="search" className="form-control" id="nombre" name="nombre" placeholder="Nombre de la actividad"
                                            />
                                        </div>
                                        {!(this.state.teacher) && <div className="form-group col-12 col-md">
                                            <label htmlFor="docente">Docente</label>
                                            <input defaultValue={this.state.queryParamsToSearch?.docente} type="search" className="form-control" id="docente" name="docente" placeholder="Nombre del docente encargado" />
                                        </div>}
                                        <div className="form-group col-12 col-md">
                                            <label htmlFor="categoria">Categoría</label>
                                            <input defaultValue={this.state.queryParamsToSearch?.categoria} type="search" className="form-control" id="categoria" name="categoria" placeholder="Categoría de la actividad" />
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
                        {!!(this.state.teacher) && <p className="text-muted text-center">
                            <b className="pt-2 pb-2 pr-3 pl-3 bg-light rounded-pill text-gray">Instructor: {this.state.teacher}</b>
                        </p>}
                        <br />
                        {!!(this.state.queryParamsToSearch) &&
                            !!(this.state.period) && <List
                                paginationsIndex={this.props.paginationsIndex.actHistory?.[`${this.state.period}-${this.state.teacher}`]}
                                setPaginationsIndex={this.setPagination}
                                teacher={this.state.teacher}
                                maxPager={maxPagerHList[`${this.state.period}-${this.state.teacher}`]}
                                period={this.state.period}
                                getListFunction={this.getActivitiesList}
                                onClickRowFunction={this.goToDetails}
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
})

const mapDispatchToProps = dispatch => ({
    getPeriods: () => dispatch(getPeriods()),
    setPaginationsIndex: (obj) => (dispatch(setPaginationsIndex(obj))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesList);