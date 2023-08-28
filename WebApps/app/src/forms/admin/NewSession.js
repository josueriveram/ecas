import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';
import { getHoursList } from '../../services/hoursService';

let optionsData = {
    sessionsType: [
        { label: "PRESENCIAL", value: "PRESENCIAL" },
        { label: "VIRTUAL", value: "VIRTUAL" },
        { label: "HIBRIDA", value: "HIBRIDA" },
    ]
}

const NewSession = (props) => {
    const { onCancel, showDateField, disabled } = props;
    const { register, handleSubmit, formState: { errors, isSubmitted }, control, setValue } = useForm({ defaultValues: props.defaultData || {} });

    const { fields, append, remove } = useFieldArray({ control, name: "expositores" });

    const [formFields, setFormFields] = useState([]);
    const tempData = { urlvc: "", lugar: "" };

    const onSubmit = (data) => {
        data.expositores = data.expositores.map(e => `${e.name.trim()} <${e.email.trim()}>`).join(", ");
        props.onSubmit({ ...tempData, ...data });
    }

    const expoNameField = {
        tag: "input",
        attrs: {
            placeholder: "Nombre completo",
            type: "text",
        },
        classGroup: "col-5 col-sm-5",
        validations: {
            required: true,
            pattern: /[\w]{3,}/
        }
    };
    const expoEmailField = {
        tag: "input",
        attrs: {
            placeholder: "Correo",
            type: "email",
        },
        classGroup: "col-5 col-sm-5",
        validations: {
            required: true,
            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        }
    };
    const locationField = {
        tag: "input",
        label: "Lugar",
        id: "lugar",
        attrs: {
            placeholder: "Ejemplo Sede 1",
            type: "text",
        },
        classGroup: "col-md-6",
        validations: {
            required: true,
        }
    };
    const urlField = {
        tag: "input",
        label: "Enlace (URL)",
        id: "urlvc",
        attrs: {
            placeholder: "Ejemplo https://meet.google.com/abc-defg-hij",
            type: "text",
        },
        classGroup: "col-md-6",
        validations: {
            required: true,
            pattern: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
        }
    };

    const sessionTypeRestriction = (e, val) => {
        let value = val || e?.target?.value;
        if (value === optionsData.sessionsType[0].value) {
            tempData.urlvc = "";
            loadForm([locationField]);
        } else if (value === optionsData.sessionsType[1].value) {
            tempData.lugar = "";
            loadForm([urlField]);
        } else if (value === optionsData.sessionsType[2].value) {
            loadForm([urlField, locationField]);
        }
    }

    const addExpositor = () => append({ name: "", email: "" })

    const removeExpositor = (idx) => remove(idx)

    useEffect(() => {
        if (!!(props.defaultData)) {
            sessionTypeRestriction(null, props.defaultData["tiposesion"])
        } else {
            loadForm();
        }
    }, []);

    let options_horafin = []

    const pickHour = (val) => {
        options_horafin = getHoursList(false, val).map(o => ({ label: o, value: o }));
        let idx = form.findIndex(f => f.id === "horafin");
        form[idx].attrs.options = options_horafin;
        setFormFields([...form])
        setValue("horafin", "", { shouldValidate: true })
    }

    let form = [];

    const loadForm = (append = []) => {
        form = [
            {
                tag: "select",
                label: "Hora de inicio",
                id: "horaini",
                attrs: {
                    options: getHoursList().map(o => ({ label: o, value: o })),
                    handleChange: (h) => pickHour(h.target.value)
                },
                classGroup: "col-md-3",
                validations: {
                    required: true,
                }
            },
            {
                tag: "select",
                label: "Hora de fin",
                id: "horafin",
                attrs: {
                    options: !!(props.defaultData?.horaini) ? getHoursList(false, props.defaultData.horaini).map(o => ({ label: o, value: o })) : options_horafin
                },
                classGroup: "col-md-3",
                validations: {
                    required: true,
                }
            },
            {
                tag: "select",
                label: "Tipo de sesión",
                id: "tiposesion",
                attrs: {
                    placeholder: "Seleccione...",
                    handleChange: sessionTypeRestriction,
                    options: optionsData.sessionsType
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                }
            },
            {
                tag: "textarea",
                label: "Descripción de la sesión",
                id: "descripcion",
                attrs: {
                    placeholder: "(Opcional)",
                },
                classGroup: "col-12",
                validations: {}
            }
        ];
        form = [...form, ...append];

        if (showDateField) {
            form.unshift({
                tag: "input",
                label: "Fecha",
                id: "fecha",
                classGroup: "col-md-6",
                attrs: {
                    // placeholder: "Máximo 40 carácteres",
                    type: "date",
                },
                validations: {
                    required: true,
                }
            })
        }
        form = form.map(f => {
            props.defaultData?.[f.id] && (f.attrs.defaultValue = props.defaultData[f.id]);
            f.attrs.disabled = !!(disabled);
            return f
        });

        setFormFields(form);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="form-row">
                {formFields.map(field => <FieldMaker
                    {...field}
                    register={!!(disabled) ? () => { } : register}
                    key={field.id}
                    isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                    feedback={isSubmitted ? (errors[field.id]?.message || "¡Muy bien!") : null}
                    control={control}
                />
                )}
                <div className="col-12 mt-3">
                    <hr />
                    <div className="pb-4">
                        {fields?.length > 0 && <p>Invitados para la sesión (Opcional):</p>}
                        {fields?.map((e, i) => {
                            return <div className="row mb-2" key={e.id} >
                                <FieldMaker
                                    {...expoNameField}
                                    attrs={{ ...expoNameField.attrs, defaultValue: e.name, disabled: !!(disabled) }}
                                    // {...e}
                                    id={`expositores.${i}.name`}
                                    register={!!(disabled) ? () => { } : register}
                                    isInvalid={isSubmitted ? !!(errors["expositores"]?.[i]?.name) : null}
                                    feedback={isSubmitted ? (errors["expositores"]?.[i]?.name?.message || null) : null}
                                />
                                <FieldMaker
                                    {...expoEmailField}
                                    attrs={{ ...expoEmailField.attrs, defaultValue: e.email, disabled: !!(disabled) }}
                                    // {...e}
                                    disabled={!!(disabled)}
                                    id={`expositores.${i}.email`}
                                    register={!!(disabled) ? () => { } : register}
                                    isInvalid={isSubmitted ? !!(errors["expositores"]?.[i]?.email) : null}
                                    feedback={isSubmitted ? (errors["expositores"]?.[i]?.email?.message || null) : null}
                                />
                                <div className="col-2">
                                    {!(disabled) && <button className="btn btn-danger" onClick={() => removeExpositor(i)}>x</button>}
                                </div>
                            </div>
                        })}
                    </div>
                    {!(disabled) && <button className="btn btn-light rounded-pill" type="button" onClick={() => addExpositor()}><b>+</b> Añadir expositor</button>}
                </div>

                <div className="col-12 mt-4 text-center">
                    <button className="btn btn-success">{!!(disabled) ? "OK" : "Guardar"}</button>
                </div>
            </form>
        </>
    );
};

export default NewSession;
