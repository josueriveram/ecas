import React from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../../components/FormMaker/FieldMaker';

const OtherUsers = (props) => {
    const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm({ defaultValues: props.defaultData || {} });

    const identificationField = {
        tag: "input",
        label: "Número de identificación",
        id: "idnumber",
        attrs: {
        },
        classInput: "p-4 rounded-pill",
        validations: {
            required: true,
        }
    };

    const dateField = {
        tag: "input",
        label: "Fecha de nacimiento",
        id: "bornDate",
        attrs: {
            type: "date",
        },
        classInput: "p-4 rounded-pill",
        validations: {
            required: true,
        }
    }

    const onSubmit = (data) => {
        props.toggleLoader();
        props.submit(data);
    }

    const onCancel = () => {
        props.cancel()
    }

    return (
        <div className='pl-3 pr-3'>

            <div className='text-center pb-4'>
                <p>Si eres un egresado o estudiante inactivo de la CURN y no tienes permisos para acceder, por favor completa el siguiente formulario</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-row">
                <FieldMaker
                    {...identificationField}
                    attrs={{ ...identificationField.attrs, disabled: props.disabled }}
                    register={!!(props.disabled) ? () => { } : register}
                    isInvalid={isSubmitted ? !!(errors["idnumber"]) : null}
                    feedback={isSubmitted ? (errors["idnumber"]?.message || null) : null}
                />
                <FieldMaker
                    {...dateField}
                    attrs={{ ...dateField.attrs, disabled: props.disabled }}
                    register={!!(props.disabled) ? () => { } : register}
                    isInvalid={isSubmitted ? !!(errors["bornDate"]) : null}
                    feedback={isSubmitted ? (errors["bornDate"]?.message || null) : null}
                />
                <div className='d-flex justify-content-between mt-4 m-3 w-100'>
                    <button type="button" disabled={props.disabled} className="btn btn-outline-dark rounded-pill" onClick={() => onCancel()}>Volver</button>
                    <button type="submit" disabled={props.disabled} className="btn btn-dark rounded-pill">Acceder</button>
                </div>
            </form>
        </div>
    );
};

export default OtherUsers;