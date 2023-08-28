import React, { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { INS_EVA_COMENTARIOS } from '../../services/endPoints';
import { Loader2 } from '../UI/Loader';
import "./style.css";

function ActivityComments(props) {

    const [list, setList] = useState(null);

    useEffect(() => {
        getComments();
    }, [])

    const getComments = () => {
        AXIOS_REQUEST(INS_EVA_COMENTARIOS + props.activity.id).then(resp => {
            setList(resp.data || [])
        })
    }

    if (list === null) {
        return <Loader2 open>Obteniendo lista de comentarios</Loader2>
    }

    return (
        <>
            <p><b>Total comentarios: </b>{list.length}</p>
            <p><b>Calificación promedio:  </b>{!!(list.length) ? (list.reduce((p, c) => p + c.califica, 0) / list.length).toFixed(1) : 0}</p>
            {list.map((item, i) => {
                return <div className="activity-comment-item mb-3" key={i}>
                    <div className="card p-sm-3 border-0">
                        <blockquote className="blockquote mb-0 card-body">
                            <div className="row">
                                <div className="col-12 col-md-7 col-lg-8 col-xl-9 text-muted">
                                    <p>{item.comentario}</p>
                                </div>
                                <div className="col">
                                    <StarRatings
                                        rating={item.califica || 0}
                                        starRatedColor="#ff9400"
                                        starDimension="40px"
                                        starSpacing="0"
                                        numberOfStars={5}
                                    />
                                </div>
                            </div>
                            <footer className="blockquote-footer mt-3 mt-md-0">
                                <small className="text-muted">
                                    Realizado el <cite title="Source Title">{new Date(item.marc_temp).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</cite>
                                </small>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            })}
        </>
    );
}

export default ActivityComments;