import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';

const SearchParticipantIntoActivities = (props) => {
    const { onSubmit, onCancel } = props;
    const { register, handleSubmit, formState: { errors, isSubmitted }, control } = useForm({ defaultValues: {} });

    let form = [
        {
            tag: "input",
            label: "Identificación",
            id: "identification",
            classGroup: "col-md-6",
            attrs: {
                type: "text",
                defaultValue: "",
                placeholder: "",
            },
            validations: {
                required: true,
                minLength: 6,
                maxLength: 20
            }
        },
        {
            tag: "input",
            label: "Nombres",
            id: "names",
            attrs: {
                type: "text",
            },
            classGroup: "col-md-6",
            validations: {
                required: true,
                minLength: 3,
                maxLength: 60
            }
        },
        {
            tag: "input",
            label: "Apellidos",
            id: "last_name",
            attrs: {
                type: "text",
            },
            classGroup: "col-md-6",
            validations: {
                required: true,
                minLength: 3,
                maxLength: 60
            }
        },
        {
            tag: "select",
            label: "Test Select",
            id: "testSelect",
            attrs: {
                placeholder: "Seleccione...",
                multiple: true,
                options: [
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'strawberry', label: 'Strawberry' },
                    { value: 'vanilla', label: 'Vanilla' }]
            },
            classGroup: "col-md-6",
            validations: {
                required: true,
                minLength: 3,
                maxLength: 60
            }
        },
        {
            tag: "checkbox",
            label: "Periodo",
            id: "period",
            classGroup: "col-md-6",
            inline: true,
            attrs: {},
            options: ["2021-02", "2021-01", "2020-02"],
            validations: {
                required: true,
                min: 1,
                max: 2
            }
        },
        {
            tag: "radio",
            label: "Periodo",
            id: "radio",
            classGroup: "col-md-6",
            inline: true,
            attrs: {
            },
            options: ["2021-02", "2021-01"],
            validations: {
                required: true,
                minLength: 7,
                maxLength: 7
            }
        },
        {
            tag: "checkbox",
            label: <span>Acepto <a href="/#">términos</a> y condiciones</span>,
            id: "terms",
            classGroup: "col-md-12",
            attrs: {
            },
            validations: {
                required: true,
            }
        }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-row">
            {form.map(field => <FieldMaker
                {...field}
                register={register}
                key={field.id}
                isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                feedback={isSubmitted ? (errors[field.id]?.message || "¡Muy bien!") : null}
                control={control}
            />
            )}
            <div className="col-12 mt-4 text-center">
                <button className="btn btn-success">Consultar</button>
            </div>
        </form>
    );
};

export default SearchParticipantIntoActivities;
