import React from 'react';
import PropTypes from 'prop-types'

import './styles.css';
import { Fade } from 'reactstrap';

const Loader = ({ children, color, open }) => {
    return (
        <Fade in={open}>
            <div className={`loader ${!(open) ? "d-none" : ""}`}>
                <div className="card shadow text-center pl-5 pr-5">
                    <div className="card-body mr-3 ml-3">
                        <div className={`spinner-border text-${color}`} role="status"></div>
                        <div>
                            <small>{children}</small>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    );
};


Loader.prototype = {
    children: PropTypes.any, //Content below loader
    color: PropTypes.string, // Loader color
}
export default Loader;

export const Loader2 = ({ children, color, open }) => 
    <Fade>
        <div className={`loader2 ${!(open) ? "d-none" : ""}`}>
            <div className="text-center">
                <div className="mr-3 ml-3">
                    <div className={`spinner-border text-${color}`} role="status"></div>
                    <div>
                        <small>{children}</small>
                    </div>
                </div>
            </div>
        </div>
    </Fade>
