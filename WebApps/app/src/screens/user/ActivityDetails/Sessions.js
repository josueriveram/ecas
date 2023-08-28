import React from 'react';
import { UncontrolledCollapse } from 'reactstrap';
import { ChevronRightIcon } from '../../../components/UI/Icons';
import { interventorsToList } from '../../../store/user/actions/activitiesAction';

function Sessions({ list, statusCallback }) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let classes = "mb-1 mb-sm-2 mb-lg-0 col-12 col-sm-4 col-lg-auto"
    let defaultOpen = list.length === 1;
    return list.map((item, i) => {
        let expositores = interventorsToList(item.expositores)
        return <div className="list-group-item list-group-item-action d-flex align-items-center" key={`session${i}`}>
            {!!(item.estado) && !!(statusCallback) && statusCallback(item.nombestado)}
            <div>
                <div className="row"  >
                    {!!(item.descripcion) && <div className=" col-12 mb-3">
                        <small style={{borderLeft: "3px solid #ff9400"}}><b className='text-warning pl-2'>Sesión {i+1}: </b><b>{item.descripcion}</b></small>
                    </div>}
                    <div className={`${classes}`}>
                        <small className="d-sm-block"><b>Fecha: </b></small>
                        <span>{new Date(item.fecha).toLocaleString([], dateOptions)}</span>
                    </div>
                    <div className={`${classes}`}>
                        <small className="d-sm-block"><b>Hora: </b></small>
                        <span>{item.hora_ini} - {item.hora_fin}</span>
                    </div>
                    <div className={`${classes}`}>
                        <small className="d-sm-block"><b>Tipo de sesión: </b></small>
                        <span>{item.tipo_sesion}</span>
                    </div>
                    {item.lugar_sesion && <div className={`${classes} col-sm-6`}>
                        <small className="d-sm-block"><b>Lugar: </b></small>
                        <span>{item.lugar_sesion}</span>
                    </div>}
                    {item.enlace_url && <div className={`${classes} col-sm-6`}>
                        <small className="d-sm-block"><b>Enlace: </b></small>
                        <span><a target="_blank" href={item.enlace_url}>{item.enlace_url}</a></span>
                    </div>}
                </div>
                <UncontrolledCollapse toggler={`#toggler${i}`} className="details-sesion" defaultOpen={defaultOpen}>
                    {item.horas && <div className="item d-block mt-2">
                        <small><b>Tiempo acumulado: </b></small>
                        <b className="text-success">+ {item.horas}</b>
                    </div>
                    }
                    <div className="item d-block mt-2">
                        <small className="d-sm-block mb-1"><b>Encargados: {expositores.length}</b></small>
                        <div className="row expositors">
                            {expositores.map((e, idx) => <div className="col-12" key={`exp${idx}`}>
                                <span><b>{idx + 1}. </b>{e.nombre}</span>
                                <a href={`mailto:${e.correo}`}><small>{e.correo}</small></a>
                            </div>)}
                        </div>
                    </div>
                </UncontrolledCollapse>
                <div className="indicator-collapse" id={"toggler" + i}>
                    <button className="btn btn-light btn-sm stretched-link">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    })
}

export default Sessions;