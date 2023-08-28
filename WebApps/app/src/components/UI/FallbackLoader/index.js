import React from 'react';

const loaderStyle = {
    "height": "100vh",
    "top": "0px",
    "left": "0px",
    "zIndex": 1,
    "backgroundColor": "#2323233d"
};

const FallbackLoader = ({ text, style }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center w-100"
            style={{...loaderStyle, ...style}}>
            <div className="spinner-grow" style={{ "width": "3rem", "height": "3rem" }} role="status">
            </div>
            <div><small>{text}</small></div>
        </div>
    );
};

export default FallbackLoader;