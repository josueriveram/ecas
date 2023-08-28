import React from 'react';
import CardActivity from '../../../components/UI/CardActivity';
import { Stop } from '../../../components/UI/Icons';

function ActivityCard({ action, data, index }) {
    return (
        <CardActivity
            action={() => action(data, index)}
            head={<p className="bg-light text-muted rounded-pill pt-1 pb-1 pr-2 pl-2 text-truncate text-center">
                <b>{data.nomb_acti}</b>
            </p>}
            // body={<p className="text-muted limit-text-3-lines text-center">{data.descripcion}</p>}
            foot={[{ text: "Inscritos", value: data.inscritos }, { text: "Aforo", value: data.cupos }, { text: "Sesiones", value: data.sesiones }]}
            buttonText="Ver detalles"
        >
            <div className="mb-1 d-flex align-items-center col col-sm-12 ">
                <div className="mr-2 text-muted">
                    <Stop size={20} />
                </div>
                <div>
                    <small>
                        <b className="d-block">Fecha de finalización
                        </b> {new Date(data.fin).toLocaleString([], { dateStyle: window.innerWidth < 440 ? "short" : "long", timeStyle: "short" })}
                    </small>
                </div>
            </div>
        </CardActivity>
    );
}

export default ActivityCard;