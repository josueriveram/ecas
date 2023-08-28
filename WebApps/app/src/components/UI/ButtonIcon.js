import React, { useState } from 'react';
import { ChevronRightIcon } from './Icons';

const ButtonIcon = ({ onClick, id }) => {
    const [icon, setIcon] = useState(true);
    const class1 = "rotate-90-down ";
    const class2 = "rotate-90-up ";
    return (
        <>
            <div className="d-flex justify-content-center align-items-center h-100 ">
                <button onClick={() => {
                    setIcon(!icon);
                    onClick && onClick()
                }
                } id={id} className={`icon-btn btn btn-sm btn-outline-warning rounded-circle ${icon ? class1 : class2}`}><ChevronRightIcon /></button>
            </div>
        </>
    );
};

export default ButtonIcon;