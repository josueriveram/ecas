import React from 'react'
import FieldMaker from '../../components/FormMaker/FieldMaker';
import { useForm } from 'react-hook-form'

export const UpdateName = (props) => {
    const { onSubmit, btnText, defaultData } = props;

    const { register, handleSubmit, formState: { errors, isSubmitted }, control } = useForm(
        {
            defaultValues: defaultData || {}
        });

    const _form = [
        {
            tag: "input",
            label: "Nombres",
            id: "nombres",
            classGroup: "col-md-6",
            attrs: {
                type: "text",
            },
            validations: {
                required: true,
                minLength: 5,
                maxLength: 60
            }
        },
        {
            tag: "input",
            label: "Apellidos",
            id: "apellidos",
            classGroup: "col-md-6",
            attrs: {
                type: "text",
            },
            validations: {
                required: true,
                minLength: 5,
                maxLength: 80
            }
        }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-row" key="NewActivity">
            {_form.map(field => <FieldMaker
                {...field}
                register={register}
                key={field.id}
                isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                feedback={isSubmitted ? (errors[field.id]?.message || "¡Muy bien!") : null}
                control={control}
            />
            )}
            <button type='submit' hidden id="submitnewnamebtn"></button>
        </form>
    )
}
