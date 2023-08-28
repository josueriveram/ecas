import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { InfoIcon } from '../../../components/UI/Icons';
import Loader, { Loader2 } from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { LOAD_MY_DEPARTMENTS, TRACKING_MASTER } from '../../../services/endPoints';
import { getPeriods } from '../../../store/admin/actions/activitiesAction';
import { Progress } from 'reactstrap';

let trackingTempValues = {
    departmentsList: []
};

export const calculatePercent = (completed, total, decimals = 1) => {
    return ((completed * 100) / total).toFixed(decimals);
}

const Tracking = ({ getPeriods, periods, ...props }) => {

    const [loader, setLoader] = useState(true);
    const [department, setDepartment] = useState(trackingTempValues.department);
    const [departmentsList, setDepartmentsList] = useState(trackingTempValues.departmentsList);
    const [period, setPeriod] = useState(trackingTempValues.period);
    const [list, setList] = useState(null);

    const onChangeDepartment = (e) => {
        trackingTempValues.department = e.target.value
        setDepartment(e.target.value);
    }
    const onChangePeriod = (e) => {
        trackingTempValues.period = e.target.value
        setPeriod(e.target.value);
    }

    const loadInstructorsList = () => {
        setLoader(true)
        AXIOS_REQUEST(TRACKING_MASTER, "post", {
            periodo: period,
            id_depart: department
        }).then(resp => {
            setList(resp.data);
            setLoader(false)
        })
    }

    const onSelectRowHandler = (item) => {
        props.history.push({
            pathname: `/seguimiento/detalles/${item.dni_docente}`,
            state: { info: item, departments: departmentsList, otherData: { period, department: departmentsList.find(d => d.value == department) } }
        })
    }

    const loadOwnDepartments = () => {
        AXIOS_REQUEST(LOAD_MY_DEPARTMENTS).then(resp => {
            let departments = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nombdepart, value: o.iddepart })) : [];
            if (departments.length > 0) {
                setDepartmentsList(departments)
                setDepartment(departments[0]?.value)
                trackingTempValues.department = departments[0]?.value;
            }
            trackingTempValues.departmentsList = departments;
            return departments;
        })
    }

    const loadPeriods = () => {
        if (!(periods?.length)) {
            getPeriods().then(r => {
                setPeriod(r?.[0])
                trackingTempValues.period = r?.[0];
            });
        }
    }

    useEffect(() => {
        !(trackingTempValues?.departmentsList.length) && loadOwnDepartments()
        loadPeriods();
    }, []);

    useEffect(() => {
        if (period && department) {
            loadInstructorsList();
        }
    }, [period, department]);

    const getColorByPercent = (percent) => {
        if (percent >= 100) {
            return "success";
        } else if (percent >= 80) {
            return "info";
        } else if (percent >= 50) {
            return "primary";
        } else {
            return "warning";
        }
    }

    return (
        <div className="mb-5">
            <div>
                <h4 className="text-gray mb-5">Seguimiento de instructores</h4>
            </div>
            <Loader open={!!(loader)}>Cargando...</Loader>

            <div className="mb-4">
                <div className="card border-0">
                    <div className="card-body">
                        <div className='row'>
                            <div className="form-group mb-5 col">
                                <label>Departamento: </label>
                                <select className="form-control" onChange={onChangeDepartment} value={department}>
                                    {departmentsList.length > 0 ?
                                        departmentsList.map(d => <option value={d.value} key={d.value}>{d.label}</option>)
                                        :
                                        <option value="">Cargando...</option>
                                    }
                                </select>
                            </div>
                            <div className="form-group mb-5 col">
                                <label>Periodo: </label>
                                <select className="form-control" onChange={onChangePeriod} value={period}>
                                    {periods?.length > 0 ?
                                        periods.map(p => <option value={p} key={p}>{p}</option>)
                                        :
                                        <option value="">Cargando...</option>
                                    }
                                </select>
                            </div>
                        </div>
                        
                        {!!(list?.length) ?
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Instructor</th>
                                            <th scope="col">Actividades</th>
                                            <th scope="col">Sesiones</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            list.map(item => {
                                                let activitiesPercent = calculatePercent(item.actividades_completadas, item.total_actividades);
                                                let sessionsPercent = calculatePercent(item.sesiones_completadas, item.total_sesiones);

                                                return (
                                                    <tr key={item.dni_docente} className="text-secondary cursor-pointer"
                                                        onClick={() => onSelectRowHandler(item)}>
                                                        <td style={{ minWidth: "170px" }}>
                                                            <div>{item.docente}</div>
                                                            <b className='small font-weight-bold'>ID: {item.dni_docente}</b>
                                                        </td>
                                                        <td style={{ minWidth: "170px" }}>
                                                            <div className="font-weight-bold small">
                                                                Completado: {item.actividades_completadas} de {item.total_actividades}
                                                            </div>
                                                            <Progress
                                                                className="my-2"
                                                                value={activitiesPercent}
                                                                color={getColorByPercent(activitiesPercent)}
                                                            >
                                                                {`${activitiesPercent}%`}
                                                            </Progress>
                                                        </td>
                                                        <td style={{ minWidth: "170px" }}>
                                                            <div className="font-weight-bold small">
                                                                Completado: {item.sesiones_completadas} de {item.total_sesiones}
                                                            </div>
                                                            <Progress
                                                                className="my-2"
                                                                value={sessionsPercent}
                                                                color={getColorByPercent(sessionsPercent)}
                                                            >
                                                                {`${sessionsPercent}%`}
                                                            </Progress>
                                                        </td>
                                                        <td className="pl-1 pr-2 pb-2 pt-2" style={{ verticalAlign: "middle" }}>
                                                            <div className='text-right' >
                                                                <span className="text-info btn btn-sm btn-light rounded-pill"><InfoIcon /></span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className='alert alert-info'>
                                No hay nada para mostrar
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = state => ({
    periods: state.activities.periods,
})

const mapDispatchToProps = dispatch => ({
    getPeriods: () => dispatch(getPeriods()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Tracking);
