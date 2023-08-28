import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalUI from '../../../components/ModalUI';
import { InfoIcon } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { SEARCH_PARTICIPANTS } from '../../../services/endPoints';
import { setQueryParamsToSearch } from '../../../store/admin/actions/activitiesAction';
import SearchParticipantIntoActivities from '../../../forms/admin/SearchParticipantIntoActivities';
import NewParticipant from './NewParticipant';
import { exportToSpreadsheet } from '../../../services/xlsxService';

class ParticipantManagement extends Component {

    constructor() {
        super();

        this.state = {
            modal: null,
            list: null,
            participantsSearch: null,
            loader2: null,
            loader: null
        }
    }

    downloadList = () => {
        this.setState({ loader: "Generando archivo" }, () => {
            exportToSpreadsheet(this.state.list, `Lista de ${this.state.list.length} participantes`)
                .then(respSheet => {
                    setTimeout(() => {
                        this.setState({ loader: null });
                    }, 5000)
                })
        });
    }

    submitAll = (data) => {
        if (!!(data)) {
            this.getParticipantsList(data, true)
        } else {
            this.setState({
                modal: {
                    open: true,
                    onClosed: () => this.setState({ modal: null }),
                    type: "warning",
                    title: "Espere",
                    alert: "Debe indicar al menos un parametro de búsqueda",
                    buttons: [{ text: "Ok", color: "success", close: true }]
                }
            })
        }
    }

    getParticipantsList = (data, saveQuery) => {
        this.setState({
            loader2: "Buscando participantes"
        }, () => {
            AXIOS_REQUEST(SEARCH_PARTICIPANTS, "POST", data)
                .then(resp => {
                    let st = {
                        loader2: null,
                        list: resp.data
                    }
                    if (saveQuery === true) { st.participantsSearch = data }
                    this.setState({ ...st })
                })
        })
    }

    selectParticipant = (participant) => {
        this.props.setQueryParamsToSearch({
            ...this.props.queryParamsToSearch,
            participantsSearch: this.state.participantsSearch
        });

        this.props.history.push({ pathname: `/gestion-participante/${participant.dni_part}`, state: participant })
    }

    componentDidMount = () => {
        if (!!(this.props.queryParamsToSearch.participantsSearch)) {
            this.getParticipantsList(this.props.queryParamsToSearch.participantsSearch, true)
        }
    }

    // componentWillUnmount = () => {
    //     if (!(this.state.participantsSearch)) {
    //         this.props.setQueryParamsToSearch({
    //             ...this.props.queryParamsToSearch,
    //             participantsSearch: null
    //         });
    //     }
    // }

    render() {
        return (
            <div className="mb-5">
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>
                <div>
                    <h4 className="text-gray mb-5">Gestión de participante</h4>
                    <NewParticipant onSuccess={() => { }} />
                </div>
                <div className="mb-4 mt-5">
                    <div className="card border-0">
                        <div className="card-body p-md-5">
                            <p>Puede utilizar todos los parametros de búsqueda o alguno de ellos, pero es necesario que ingrese por lo menos un parametro.
                                Los resultados de la busqueda estan relacionados a partir del primer periodo del <b>2021</b>.</p>
                            <br />
                            <SearchParticipantIntoActivities defaultData={this.props.queryParamsToSearch.participantsSearch} onSubmit={this.submitAll} />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    {!!(this.state.loader2) ?
                        <Loader2 open={true}>Buscando participantes</Loader2>
                        :
                        !!(this.state.list?.length) ? <><div className="card border-0">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Identificación</th>
                                                <th scope="col" style={{ minWidth: "240px" }}>Nombre</th>
                                                <th scope="col" style={{ minWidth: "170px" }}>Programa</th>
                                                <th scope="col">Rol</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.list.map((p, i) =>
                                                <tr className="text-muted cursor-pointer" key={i} onClick={() => this.selectParticipant(p)}>
                                                    <td>{p.dni_part}</td>
                                                    <td>
                                                        {p.nomb_part.trim()} {p.apel_part.trim()}<br />
                                                        <small><a href={`mailto:${p.email_part}`}>{p.email_part}</a></small>
                                                    </td>
                                                    <td><small>{p.programa}</small></td>
                                                    <td>{p.rol_part}</td>
                                                    <td className="pl-1 pr-2 pb-2 pt-2">
                                                        <div>
                                                            <span className="text-info btn btn-sm btn-light rounded-pill"><InfoIcon /></span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                            {!!(this.state.list?.length) && !(this.state.loader2) && <div className="text-center">
                                {!(this.state.loader) && <button className="btn btn-outline-info mt-5 btn-sm" onClick={() => this.downloadList()}>Descargar lista</button>}
                            </div>}
                        </> :
                            this.state.list?.length === 0 && <div className="alert alert-info">No se ha encontrado participantes bajo criterios de búsqueda</div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    queryParamsToSearch: state.activities.queryParamsToSearch
})

const mapDispatchToProps = dispatch => ({
    setQueryParamsToSearch: (obj) => (dispatch(setQueryParamsToSearch(obj))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantManagement);