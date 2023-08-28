import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import ModalUI from '../../../components/ModalUI';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { AUTO_ASISTANCE } from '../../../services/endPoints';
import { setSubscribedActivities } from '../../../store/user/actions/activitiesAction';

const basePage = "/inicio";

const Asistance = ({
    setList,
    ...props
}) => {

    const [loader, setLoader] = useState(null);
    const [modal, setModal] = useState(null);

    const doAsistance = () => {
        setLoader("Registrando asistencia");
        let { match: { params: { idactividad } }, history } = props

        AXIOS_REQUEST(AUTO_ASISTANCE, "POST", {
            idact: idactividad,
            item: 1,
            dnipart: "",
            estado: 2,
            observacion: "Asistió por QR"
        }).then(resp => {
            setLoader(null);
            if (resp.cod !== "200" || resp.msg === "ERROR") throw new Error();
            setList([]);

            setModal({
                type: "success",
                title: "¡Muy bien!",
                size: "sm",
                alert: "Se ha registrado correctamente su asistencia",
                open: true,
                onClosed: () => {
                    history.replace(basePage);
                },
                buttons: [{ text: "Ok", color: "success", close: true }]
            })

        }).catch(err => {
            setLoader(null);
            setModal({
                type: "danger",
                title: "Ops...",
                size: "sm",
                alert: "No se ha podido registrar su asistencia, por favor verifique que la actividad exista, tenga cupos y no haya terminado hace mas de 2 horas",
                open: true,
                onClosed: () => {
                    history.replace(basePage);
                },
                buttons: [{ text: "Ok", color: "success", close: true }]
            })
        });
    }

    useEffect(() => {
        doAsistance();
    }, []);

    if (loader) return <Loader open={!!(loader)} color="warning">{loader}</Loader>
    return <ModalUI open={modal?.open || false} {...modal} />;

}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
    setList: (list) => dispatch(setSubscribedActivities(list))
})
export default connect(mapStateToProps, mapDispatchToProps)(Asistance);
