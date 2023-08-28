import React, { useState } from 'react';
import "./style.css";

function Switch(props) {

    const [checked, setChecked] = useState(!!(props.checked))

    const onToggle = (e) => {
        setChecked(e.target.checked)
        !!(props.onToggle) && props.onToggle(e.target.checked, setChecked);
    }

    return (<div className={`switch-wrapper ${props.className || ""}`}>
        <span>{props.children}</span>
        <label className={`toggle-switch ${props.size || "lg"}`}>
            <input type="checkbox" checked={checked} onChange={onToggle} disabled={!!(props.disabled)} />
            <span className="switch">{checked ? props.onLabel : props.offLabel}</span>
        </label>
    </div>);
}

export default Switch;