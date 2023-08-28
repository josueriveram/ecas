import React from 'react';
import { ChevronRightIcon } from '../Icons';
import "./styles.css";

const CardActivity = ({ action, head, children, body, foot, buttonText, className }) => {
    return (
        <div className={`ng-cardstyle card border-0 ${className}`} onClick={action}>
            <div className="card-body">
                <div>
                    <div>{head}</div>
                    <div className="mt-3">{body}</div>
                    <div className="mt-3 mb-3 text-muted row">
                        {children}
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    {foot.map((f, k) =>
                        <div key={k}>
                            <span>{f.text}</span>
                            <span>{f.value}</span>
                        </div>
                    )}
                </div>
                <div className="button-action ">
                    <button className="btn btn-warning rounded-pill text-white stretched-link">
                        {buttonText} <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardActivity;