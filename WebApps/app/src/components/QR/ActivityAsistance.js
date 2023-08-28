import React from 'react'
import QR from '.';

const ActivityAsistance = ({
    url, activityId, activityName, title
}) => {
    return <QR
        as="button"
        className="btn btn-light ml-auto"
        name={`QR-actividad-${activityId}`}
        data={`${url}/asistencia/${activityId}`}
    >
        <div>
            <div className='text-center pt-4 pb-4 border-bottom'>
                <b className="w-100 text-center">{title || "..."}</b>
            </div>
            <h1 className='text-center mb-5 pb-3 mt-5 pt-5'><b>{activityName}</b></h1>
            <h4 className='text-center mb-4 mt-5 pt-5'>Escanea y registra tu asistencia</h4>
        </div>
    </QR>
}

export default ActivityAsistance;
