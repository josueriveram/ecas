import React from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';

const SearchParticipantIntoActivities = (props) => {
    const { register, handleSubmit, formState: { errors, isSubmitted, isDirty }, control, reset } = useForm({ defaultValues: props.defaultData || {} });

    let form = [
        {
            tag: "input",
            label: "Identificación",
            id: "dni",
            classGroup: "col-sm-6 col-md-3",
            attrs: {
                type: "search",
            },
            validations: {
                minLength: 4,
                maxLength: 20
            }
        },
        {
            tag: "input",
            label: "Nombres",
            id: "nombre",
            attrs: {
                type: "search",
            },
            classGroup: "col-sm-6 col-md-3",
            validations: {
                minLength: 3,
                maxLength: 60
            }
        },
        {
            tag: "input",
            label: "Apellidos",
            id: "apellido",
            attrs: {
                type: "search",
            },
            classGroup: "col-sm-6 col-md-3",
            validations: {
                minLength: 3,
                maxLength: 60
            }
        },
        {
            tag: "input",
            label: "Correo",
            id: "correo",
            attrs: {
                type: "search",
            },
            classGroup: "col-sm-6 col-md-3",
            validations: {
                minLength: 3,
                maxLength: 40
            }
        }
    ];

    const onSubmit = (data) => {
        if (!!(data.dni) || !!(data.nombre) || !!(data.apellido) || !!(data.correo)) {
            props.onSubmit(data);
        } else {
            props.onSubmit(null);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-row">
            {form.map(field => <FieldMaker
                {...field}
                register={register}
                key={field.id}
                isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                feedback={isSubmitted ? (errors[field.id]?.message || "") : null}
                control={control}
            />
            )}
            <div className="col-12 mt-4 d-flex justify-content-between ">
                <button className="btn btn-info" type="reset" onClick={() => reset()} disabled={!(isSubmitted)}>Limpiar</button>
                <button className="btn btn-success" disabled={!(isDirty)}>Consultar</button>
            </div>
        </form>
    );
};

export default SearchParticipantIntoActivities;
