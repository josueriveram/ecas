import React from 'react';
import PropTypes from 'prop-types';

import './CircleProgress.css';

const CircleProgress = (props) => {

    const { radius, stroke, progress, content } = props;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset = circumference - progress / 100 * circumference;
    const color = props.color || "var(--green)";
    return (
        <div className="circleprogress-container">
            <div className="content-text">{content}</div>
            <svg
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    stroke={color}
                    className="circle"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: 0, opacity: "0.2" }}
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    className="circle"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
    );
};

CircleProgress.propTypes = {
    radius: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    stroke: PropTypes.number.isRequired,
    content: PropTypes.any,
    color: PropTypes.string,
};

export default CircleProgress;
