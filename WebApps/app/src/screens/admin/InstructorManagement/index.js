import React, { Component } from 'react';
import { InfoIcon } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { LOAD_MY_DEPARTMENTS, LOAD_TEACHERS } from '../../../services/endPoints';
import { exportToSpreadsheet } from '../../../services/xlsxService';
import NewInstructor from './NewInstructor';

class InstructorSignUp extends Component {

    constructor() {
        super();

        this.state = {
            loader: null,
            modal: null,
            departments: [],
            selectedDep: null,
            list: {}
        }
    }

    loadOwnDepartments = () => {
        AXIOS_REQUEST(LOAD_MY_DEPARTMENTS).then(resp => {
            let departments = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nombdepart, value: o.iddepart })) : [];
            if (departments.length > 0) {
                this.setState({ departments, selectedDep: departments[0]?.value }, this.loadInstructorsList)
            }
            return departments;
        })
    }

    onChangeDepartment = (e) => {
        this.setState({ selectedDep: e.target.value }, this.loadInstructorsList)
    }

    loadInstructorsList = () => {
        if (!(this.state.list[this.state.selectedDep])) {
            this.setState({ loader: "Cargando lista" }, () => {
                AXIOS_REQUEST(LOAD_TEACHERS, "post", { codi_depart: this.state.selectedDep, idtipo: 3, todos: 1 }).then(resp => {
                    this.setState({
                        loader: null,
                        list: { ...this.state.list, [this.state.selectedDep]: resp.msg !== "ERROR" ? resp.data : null }
                    })
                })
            })
        }
    }

    newInsctructorSuccessCallback = (deps) => {
        let list = this.state.list;
        deps.forEach(d => delete list[d])
        this.setState({ list }, this.loadInstructorsList);
    }

    onSelectRowHandler = (i) => {
        this.props.history.push({
            pathname: `/gestion-instructores/${i.dni_admin}`,
            state: { info: i, departments: this.state.departments }
        })
    }

    componentDidMount() {
        this.loadOwnDepartments()
    }

    downloadList = () => {
        this.setState({ loader: "Generando archivo" }, () => {
            exportToSpreadsheet(this.state.list[this.state.selectedDep], `Instructores - ${this.state.departments.find(d => d.value === this.state.selectedDep)?.label}`)
                .then(respSheet => {
                    setTimeout(() => {
                        this.setState({ loader: null });
                    }, 5000)
                })
        });
    }

    render() {
        const { departments, loader, list, selectedDep } = this.state;
        return (
            <div className="mb-5">
                <div>
                    <h4 className="text-gray mb-5">Gestión de instructores</h4>
                </div>
                <Loader open={!!(this.state.loader)}>{this.state.loader}</Loader>
                <div className="mb-5 d-flex justify-content-between flex-wrap">
                    {!!(this.state.departments.length) &&
                        <NewInstructor
                            departmentsList={this.state.departments}
                            onSuccess={this.newInsctructorSuccessCallback}
                            btnText={"Registrar"}
                        />
                    }
                </div>

                <div className="mb-4">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="form-group mb-5">
                                <label>Departamento: </label>
                                <select className="form-control" onChange={(e) => this.onChangeDepartment(e)}>
                                    {departments.length > 0 ?
                                        departments.map(d => <option value={d.value} key={d.value}>{d.label}</option>)
                                        :
                                        <option value="">Cargando...</option>
                                    }
                                </select>
                            </div>
                            {!!(list[selectedDep]) ?
                                (!!(list[selectedDep].length) ? <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th scope="col">Identificación</th>
                                                    <th scope="col" style={{ minWidth: "240px" }}>Nombre</th>
                                                    <th scope="col" style={{ minWidth: "140px" }}>Correo</th>
                                                    <th scope="col">Estado</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list[selectedDep].map((ins, i) =>
                                                    <tr key={i} className="text-secondary cursor-pointer"
                                                        onClick={() => this.onSelectRowHandler(ins)}>
                                                        <td>{ins.dni_admin}</td>
                                                        <td>{ins.nombres}</td>
                                                        <td>{ins.correo}</td>
                                                        <td>{ins.enabled ? <b className="text-success">Activo</b> : <b className="text-danger">Inactivo</b>}</td>
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
                                    <div className="text-center">
                                        {!(this.state.loader) && <button className="btn btn-outline-info mt-5 btn-sm" onClick={() => this.downloadList()}>Descargar lista</button>}
                                    </div>
                                </> : <div className="alert alert-info">No hay instructores en el departamento seleccionado</div>)
                                :
                                <Loader2 open={!!(loader)} color="warning">{loader}</Loader2>
                            }
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default InstructorSignUp;