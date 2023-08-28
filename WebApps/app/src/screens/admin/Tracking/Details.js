import React, { useEffect, useState } from 'react'
import { ChevronRightIcon } from '../../../components/UI/Icons';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { TRACKING_DETAILS } from '../../../services/endPoints';

const Details = (props) => {

    const [data, setData] = useState(null);
    const [list, setList] = useState(null);
    const [loader, setLoader] = useState(null);

    const goToBackPage = () => props.history.goBack();

    const goToInstructorDetail = () => {
        props.history.push({
            pathname: `/gestion-instructores/${data.dni_docente}`,
            state: {
                info: {
                    correo: data.email_admin,
                    dni_admin: data.dni_docente,
                    enabled: !!(data.enabled),
                    nombres: data.docente,
                }, departments: props.location.state?.departments,
            }
        })
    }

    const goToActivityDetail = (item) => {
        props.history.push({
            pathname: `/gestion-actividades/${item.id}`,
        })
    }

    const fetchActivitiesList = () => {
        setLoader("Cargando datos")

        AXIOS_REQUEST(TRACKING_DETAILS, "post", {
            periodo: data.period,
            id_depart: data.department.value,
            dni_doc: data.dni_docente
        }).then(resp => {
            setList(resp.data);
            setLoader(false)
        })
    }

    useEffect(() => {
        setData({
            ...props.location.state.info,
            ...props.location.state.otherData
        })
    }, []);

    useEffect(() => {
        data && fetchActivitiesList();
    }, [data])

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between mb-5">
                <h4 className="text-gray mb-0">Seguimiento a instructor</h4>
                <button onClick={goToBackPage} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                    <ChevronRightIcon />
                </button>
            </div>
            <Loader open={!!(loader)}>{loader}</Loader>

            {(!(loader) && !!(list)) ?
                <div className="mb-4">
                    <div className="card border-0 mb-4">
                        <div className="card-body">
                            <div className="d-flex flex-wrap justify-content-between">
                                <p>
                                    <small><b>Nombre:</b></small><br />
                                    <span>{data.docente}</span>
                                </p>
                                <p>
                                    <small><b>Identificación:</b></small><br />
                                    <span>{data.dni_docente}</span>
                                </p>
                                <p>
                                    <small><b>Correo:</b></small><br />
                                    <a href={`mailto:${data.email_docente}`}>{data.email_docente}</a>
                                </p>
                            </div>
                            <div>
                                <button onClick={() => goToInstructorDetail()} className="mt-2 btn btn-outline-info btn-sm float-left">
                                    Ver más detalles del instructor
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card border-0 mb-4">
                        <div className="card-body">
                            <div>
                                <h5 className="text-gray mb-3">Actividades del periodo {data.period}</h5>
                            </div>
                            <div className="text-gray mb-4 pb-2">Departamento: {data.department.label}</div>
                            <div className='mb-5 pt-2 pb-2 pl-3 border-left border-info'>
                                <small>Se muestra el nombre, la fecha de inicio y fin de las actividades del periodo y departamento indicado, a demás, se indica si ya la actividad cuenta con la aprobación final por parte del instructor y el número total de sesiones, el número de sesiones ya realizadas hasta la fecha y cuantas de ellas cuentan con registro de asistencia.</small>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Aprobación</th>
                                            <th scope="col">Sesiones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            list.map(item => {
                                                return (
                                                    <tr key={item.id} className="text-secondary cursor-pointer"
                                                        onClick={() => goToActivityDetail(item)}>
                                                        <td><b>{item.id}</b></td>
                                                        <td style={{ minWidth: "200px" }}>{item.nomb_acti}</td>
                                                        <td style={{ minWidth: "190px" }}>
                                                            <div className='small'><b>Inicio:</b> {item.fecha_inicio}</div>
                                                            <br />
                                                            <div className='small'><b>Fin:</b> {item.fecha_fin}</div>
                                                        </td>
                                                        <td>
                                                            {!!(item.tieneaprobaciones) ?
                                                                <b className='text-success'>Realizada</b>
                                                                :
                                                                "No realizada"
                                                            }
                                                        </td>
                                                        <td style={{ minWidth: "150px" }}>
                                                            <div><b className='small font-weight-bold'>Total:</b> {item.sesiones}</div>
                                                            <div><b className='small font-weight-bold'>Realizadas: </b>{item.sesiones_fecha_finalizada}</div>
                                                            <div><b className='small font-weight-bold'>Con asistencia: </b>{item.sesiones_registra_asistencia}</div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='mt-5'>
                                <div className='badge badge-dark'>
                                    Total actividades: <span className='font-weight-bold '> {list.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='alert alert-info'>
                    No hay nada para mostrar
                </div>
            }
        </div>
    )
}

export default Details;