import React from 'react';
import { connect } from 'react-redux';
import { Loader2 } from '../UI/Loader';


const Footer = (props) => {

    const config = props.config?.footer ? JSON.parse(props.config?.footer) : {};

    const syle = {
        background: config["background"] || "rgba( 255, 255, 255, 0.25 )",
        backgroundImage: config["background-image"] || "",
        color: config["color"] || "#000",
        boxShadow: "none",
        backdropFilter: "blur( 4px )",
        "WebkitBackdropFilter": "blur( 4px )",
    }
    return (
        <footer className="pt-3 pb-3 text-center border-top" style={syle}>
            <small>{config["text"] || <Loader2 open>Cargando...</Loader2>}</small>
        </footer>
    );
};

const mapStateToProps = state => ({
    config: state.user.config
})

export default connect(mapStateToProps)(Footer);