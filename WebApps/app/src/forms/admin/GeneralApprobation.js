import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { LOAD_APPROBATION_TYPE } from '../../services/endPoints';

let appTypes = [];

function GeneralApprobation(props) {

    const { onSubmit, onCancel } = props;
    const { register, handleSubmit, formState: { errors, isSubmitted, isDirty }, control } = useForm({ defaultValues: {} });

    const [approbationTypes, setApprobationTypes] = useState(appTypes)

    useEffect(() => {
        if (approbationTypes.length === 0) {
            AXIOS_REQUEST(LOAD_APPROBATION_TYPE).then(resp => {
                let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nomb_tapro, value: o.id_tapro })) : [];
                setApprobationTypes(list);
                appTypes = list;
                return list;
            })
        }
    }, [])

    let form = [
        {
            tag: "select",
            label: "Tipo de aprobación",
            id: "id_tapro",
            attrs: {
                placeholder: approbationTypes.length === 0 ? "Cargando..." : "Seleccione...",
                options: approbationTypes
            },
            classGroup: "",
            validations: {
                required: true
            }
        },
        {
            tag: "textarea",
            label: "Observación",
            id: "obser_aproba",
            attrs: {
                rows: 3,
                placeholder: "Opcional",
            },
            classGroup: "",
            validations: {
                minLength: 5,
                maxLength: 200,
            }
        },
    ]

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
            <div className="col-12 mt-4 d-flex justify-content-between">
                <button className="btn btn-info" onClick={() => onCancel()}>Cancelar</button>
                <button className="btn btn-success">Continuar</button>
            </div>
        </form>
    );
}

export default GeneralApprobation;