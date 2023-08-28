import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { CheckIconFill, DotsH, WarningIconFill } from '../../../components/UI/Icons';

function Sessions({ list, statusCallback, action }) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let classes = "mb-1 mb-sm-2 mb-lg-0 col-12 col-sm-4 col-lg-auto";
    return list.map((item, i) => {
        return <div className="list-group-item list-group-item-action d-flex align-items-md-center" key={`session${i}`} onClick={() => action(item)}>
            {!!(item.estado) && !!(statusCallback) && statusCallback(item.nombestado)}
            <div>
                <div className="row">
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
            </div>
            <div className="ml-auto ">
                <button className="btn btn-light btn-sm position-relative stretched-link" id={"toggler" + i} >
                    <DotsH />
                    {item.registasist === "0" && item.shouldMakeAttendance && <>
                        <div className="attendance-indicator text-danger"><WarningIconFill /></div>
                        <UncontrolledTooltip placement="right" target={"toggler" + i}>
                            Debe marcar la asistencia
                        </UncontrolledTooltip></>}
                    {item.registasist === "1" && <>
                        <div className="attendance-indicator text-success"><CheckIconFill /></div>
                    </>}
                </button>
            </div>
        </div>
    })
}

export default Sessions;