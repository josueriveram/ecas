import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { mapErrorMessages } from './errorsMessage';
// import { Controller } from 'react-hook-form';
// import Select from 'react-select'

const Input = React.forwardRef((props, ref) => <input {...props} ref={ref} />);

const Textarea = React.forwardRef((props, ref) => <textarea {...props} ref={ref}></textarea>);

const Select = React.forwardRef(({ options, defaultValue, fetchValues, handleChange, ...props }, ref) => {
    let ownProps = { ...props };
    const [data, setData] = useState({ isLoading: false, options, value: "" });

    useEffect(() => {
        if (!!(fetchValues) && !(options?.length)) {
            setData({ ...data, isLoading: true });
            fetchValues?.()?.then(resp => setData({ isLoading: false, options: resp, value: defaultValue }));
        }
        else {
            setData({ ...data, options, value: defaultValue });
        }
    }, [fetchValues, options]);

    const onChange = (e) => {
        setData({ ...data, value: e.target.value });
        ownProps.onChange(e);
        !!(handleChange) && handleChange(e);
    }

    return <select {...ownProps} ref={ref} onChange={onChange} value={data.value}>
        {/* {!(data.value) && <option value="">{data.isLoading ? "Cargando..." : (props.placeholder || "Seleccione...")}</option>} */}
        <option value="">{data.isLoading ? "Cargando..." : (props.placeholder || "Seleccione...")}</option>
        {data.options.map((o, i) => <option value={o.value} key={i}>{o.label}</option>)}
    </select>
});
// const NGSelect = React.forwardRef(({ control, options, ...props }, ref) => {
//     const [data, setData] = useState({ isLoading: false, options, defaultValue: props.defaultValue });
//     let ownProps = { ...props };

//     function handleChange(selectedOption, eventMeta) {
//         console.log("CHANGE", ownProps.name)
//         console.log(eventMeta)
//         let slo = Array.isArray(selectedOption) ? selectedOption.map(o => o.value) : selectedOption.value;
//         !!(ownProps.handleChange) && ownProps.handleChange(slo);
//         return slo;
//     };

//     useEffect(() => {
//         // if (ownProps.name === "dnidocente") {
//             console.log({ options, data, ownProps })
//         // }
//         // if (!!(ownProps.fetchValues) && data.options?.length === 0) {
//         if (!!(ownProps.fetchValues)) {
//             // console.log("IF");
//             setData({ ...data, isLoading: true });
//             ownProps.fetchValues().then(resp => setData({ isLoading: false, options: resp, defaultValue: null }));
//         }
//         // else {
//         //     console.log("ELSE");
//         //     setData({ ...data, options });
//         // }
//     }, [ownProps.fetchValues, options]);

//     return <Controller
//         control={control}
//         name={props.name}
//         render={({
//             field: { onChange, ref, value, ...f },
//             fieldState,
//             formState
//         }) => {
//             return (
//                 <Select {...ownProps}
//                     // defaultValue={value}
//                     isLoading={data.isLoading}
//                     loadingMessage={() => "Cargando"}
//                     noOptionsMessage={() => "Sin opciones"}
//                     // isDisabled
//                     isMulti={!!(props.multiple)}
//                     options={data.options}
//                     minMenuHeight={300}
//                     ref={ref}
//                     onChange={e => onChange(handleChange(e))} />)
//         }
//         }
//     />
// });

const Radio = React.forwardRef(({ id, options, className, inline, ...props }, ref) => options.map((o, i) =>
    <div className={`custom-control custom-radio${!!(inline) ? " custom-control-inline" : ""}`} key={`${id}-${i}`}>
        <input type="radio"
            {...props}
            className={`custom-control-input ${className}`}
            id={`${id}-${i}`}
            ref={ref}
            value={o.value} />
        <label className={`custom-control-label`} htmlFor={`${id}-${i}`}>{o.label}</label>
    </div>
))

const Checkbox = React.forwardRef(({ label, className, inline, ...props }, ref) =>
    <div className={`custom-control custom-checkbox${inline ? " custom-control-inline" : ""}`}>
        <input type="checkbox" className={`${className} custom-control-input`} {...props} ref={ref} />
        <label className="custom-control-label" htmlFor={`${props.id}`}>{label}</label>
    </div>
)

const CheckboxGroup = ({ id, options, inline, register, validations, ...props }) => {
    if (validations.hasOwnProperty("required") && !validations.hasOwnProperty("min") && !validations.hasOwnProperty("max")) {
        validations.min = options.length;
    }
    let valErr = mapErrorMessages(validations);
    validations.validate = val => {
        if (valErr.hasOwnProperty("required") || val.length > 0) {
            if (valErr.min?.value && val.length < valErr.min.value) {
                return `Seleccione al menos ${valErr.min.value} elementos`
            } else if (valErr.max?.value && val.length > valErr.max.value) {
                return `Seleccione máximo ${valErr.max.value} elementos`
            }
        }
        return true;
    }
    return options.map((o, i) => <Checkbox {...props} label={o.label} {...register(`${id}.${i}`, valErr)} inline={inline} value={o.value} id={`${id}-${i}`} key={i} />)
}

const FieldMaker = field => {
    let _class = field.classInput || "";
    if (field.isInvalid === true) {
        _class += " is-invalid";
    } else if (field.isInvalid === false) {
        _class += " is-valid";
    }

    let props = {
        className: `form-control ${_class}`,
        id: field.id,
        ...field?.attrs
    }

    if (!!(field.options?.length)) {
        props.options = typeof field.options[0] === "object" ? field.options : field.options.map(o => ({ value: o, label: o }));
    }

    let feedback = field.isInvalid ? <div id={`${field.id}Feedback`} className="invalid-feedback">{field.feedback}</div>
        : (field.feedback && <div id={`${field.id}Feedback`} className="valid-feedback">{field.feedback}</div>);

    let label = field.label && <label htmlFor={field.id} className={`${!!(field.inline) ? "d-block " : ""}${field.classLabel || ""}`}>{field.label}</label>;

    let register = () => field.register(field.id, mapErrorMessages(field.validations))

    let f = null;
    switch (field.tag) {
        case "select":
            props.className = `NGselect ${props.className}`;
            f = <Select {...props} {...register()} />;
            // f = <NGSelect {...props} {...register()} control={field.control} />;
            break;
        case "textarea":
            f = <Textarea {...props} {...register()} />;
            break;
        case "radio":
            if (field.validations?.disabled && !!(field.validations?.value)) { props.defaultChecked = field.validations.value; }
            f = <Radio {...props} inline={!!(field.inline)} {...register()} />;
            break;
        case "checkbox":
            if (field.validations?.disabled && !!(field.validations?.value)) { props.defaultChecked = field.validations.value; }
            if (field.options?.length > 0) {
                f = <CheckboxGroup {...props} inline={!!(field.inline)} register={register} label={field.label} validations={field.validations} />;
            } else {
                label = <label></label>;
                f = <Checkbox {...props} {...register()} label={field.label} />;
            }
            break;
        default:
            f = <Input {...props} {...register()} />;
            break;
    }

    return <div className={`form-group col-12 ${field.classGroup}`}>
        {label}
        {f}
        {!(field.validations.disabled) && feedback}
    </div>
}

FieldMaker.prototype = {
    Controller: PropTypes.array,
    isInvalid: PropTypes.any,
    id: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    attrs: PropTypes.object, // Attributes object for some input, like defaultValues, placeholders, disabled, style, type, rows, cols, etc.
    options: PropTypes.array, //For select can be [{value, label}] or ["value", "value", "value"]
    classInput: PropTypes.string, // Classes for the input element
    classGroup: PropTypes.string, // Classes for the group input - label elements
    validations: PropTypes.object, //JSON with validations
}

export default FieldMaker;
