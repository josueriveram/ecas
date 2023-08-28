import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';

function NewInstructor(props) {
    const { departmentsList, departmentsList_onlyread, onSubmit, btnText, defaultData, disabled } = props;
    const { register, handleSubmit, formState: { errors, isSubmitted, isDirty }, control } = useForm({ defaultValues: defaultData || {} });

    let field = {
        tag: "checkbox",
        label: !(defaultData) ? "¿A qué departamentos estará asociado?" : "",
        id: "codi_depart",
        classGroup: "col-md-12 ",
        inline: false,
        attrs: {
            disabled
        },
        options: departmentsList,
        validations: {
            required: !(departmentsList_onlyread?.length),
            min: !!(departmentsList_onlyread) ? 0 : 1,
        }
    }

    let onlyReadField = {
        tag: "checkbox",
        label: "",
        id: "codi_depart_onlyread",
        classGroup: "col-md-12 ",
        inline: false,
        attrs: {
            disabled: true
        },
        options: departmentsList_onlyread,
        validations: {}
    }

    useEffect(() => { }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-row" key="NewActivity">
            {!!(departmentsList_onlyread?.length) && <FieldMaker
                {...onlyReadField}
                register={register}
                key={onlyReadField.id}
                control={control}
            />
            }
            {<FieldMaker
                {...field}
                register={register}
                key={field.id}
                isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                feedback={isSubmitted ? (errors[field.id]?.message || (!(departmentsList_onlyread) && "¡Muy bien!")) : null}
                control={control}
            />}

            {!(disabled) && <div className="mt-4 text-center w-100 mb-2">
                <button className="btn btn-success" disabled={!(isDirty)}>{btnText || "Siguiente"}</button>
            </div>}
        </form>
    );
}

export default NewInstructor;