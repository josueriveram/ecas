import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import { Award, ClockIcon, PiggyBank } from '../../../components/UI/Icons';

const UserStatus = ({ userStatus, goToPage }) => {

    const itemsInfo = [
        { icon: <PiggyBank size={25} />, text: "Puntos acumulados", val: "0", tooltip: "Ver historial de puntos y redimir", page: "/puntos", prop: "puntosacum" },
        { icon: <ClockIcon size={25} />, text: "Horas acumuladas", val: "00:00:00", tooltip: "Ver historial de horas", prop: "totalhoras", page: "/horas" },
        { icon: <Award size={25} />, text: "Estado de bienestar institucional", val: "Sin aprobar", page: "/historial", tooltip: "Ver historial de actividades", prop: "aprobien" }
    ]

    return (
        itemsInfo.map((e, i) => <div className="col mb-2" key={i}>
            <div className="card custom-ng" id={`info${i}`} onClick={() => goToPage(e.page)}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-3 col-sm-2 col-md-3 col-xl-2 d-flex">
                            <div className=" rounded-circle m-auto">{e.icon}</div>
                        </div>
                        <div className="col text-truncate">
                            <small className="card-title ">{e.text}</small>
                            <p className="card-text text-muted"><b>{userStatus?.[e.prop] || e.val}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <UncontrolledTooltip placement="top" target={`info${i}`}>{e.tooltip}</UncontrolledTooltip>
        </div>
        )
    );
};


const mapStateToProps = state => ({
    userStatus: state.user.userStatus
})

export default connect(mapStateToProps)(UserStatus);
