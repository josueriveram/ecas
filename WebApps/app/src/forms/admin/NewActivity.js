import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FieldMaker from '../../components/FormMaker/FieldMaker';
import { WarningIcon } from '../../components/UI/Icons';
import { Loader2 } from '../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { LOAD_CATEGORIES, LOAD_BONUS, LOAD_TEACHERS, LOAD_APPROBATION_TYPE, LOAD_ROLES, LOAD_PROGRAMS, LOAD_MY_DEPARTMENTS } from '../../services/endPoints';

let optionsData = {
    departments: [],
    bonus: [],
    categories: [],
    approbationTypes: []
}

let roles = null;
let programs = null;

const NewActivity = (props) => {
    const { onSubmit, onCancel, btnText, defaultData, disabled, onlyRead, allActivityData } = props;
    const { register, handleSubmit, formState: { errors, isSubmitted }, control, setValue } = useForm(
        {
            defaultValues: !!(defaultData) ? {
                ...defaultData,
                horas_cert: defaultData.horas_cert?.split(":")[0]
            } : {}
        });
    const [formFields, setFormFields] = useState([]);
    const [showHoursToCert, setShowHoursToCert] = useState(!!(defaultData?.horas_cert));

    const getCategories = () =>
        !!(onlyRead) ? new Promise((resolve) => resolve([{ label: allActivityData.categoria, value: allActivityData.idcateg }])) :
            AXIOS_REQUEST(LOAD_CATEGORIES).then(resp => {
                let list = resp.msg !== "ERROR" ? resp.data?.map(o => ({ label: o.desc_acti, value: o.tipo_acti })) : []
                optionsData.categories = list;
                return list;
            })
    const getMyDepartments = () =>
        !!(onlyRead) ? new Promise((resolve) => resolve([{ label: allActivityData.depart, value: allActivityData.id_depart }])) :
            AXIOS_REQUEST(LOAD_MY_DEPARTMENTS).then(resp => {
                let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nombdepart, value: o.iddepart })) : []
                optionsData.departments = list;
                return list;
            })
    const getBonus = () =>
        AXIOS_REQUEST(LOAD_BONUS).then(resp => {
            let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.namebonus, value: o.idBonus })) : []
            optionsData.bonus = list;
            return list;
        })
    // const getTeachers = (e) =>
    //     {
    //         console.log(e)
    //         return AXIOS_REQUEST(LOAD_TEACHERS, "POST", { idtipo: "3", todos: onlyRead ? 1 : 0 }).then(resp => {
    //         // AXIOS_REQUEST(LOAD_TEACHERS, "POST", { idtipo: "3" }).then(resp => {
    //         let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nombres, value: o.dni_admin })) : [];
    //         optionsData.teachers = list;
    //         return list;
    //     });
    // }
    const getTeachers = (e) => {
        if (!(onlyRead)) {
            let fieldId = "dnidocente";
            let codi_depart = e?.target?.value;
            setFormFields(prevState => {
                let fidx = prevState.findIndex(f => f.id === fieldId);
                prevState[fidx].attrs.fetchValues = () => AXIOS_REQUEST(LOAD_TEACHERS, "POST", {
                    idtipo: "3",
                    codi_depart
                }).then(resp => {
                    setValue(fieldId, null, { shouldValidate: true })
                    let list = resp.data?.map?.(o => ({ label: o.nombres, value: o.dni_admin }));
                    // optionsData.teachers = list;
                    return list;
                });

                return [...prevState];
            })
        } else {
            return new Promise((resolve) => resolve([{ label: allActivityData.docente, value: allActivityData.dni_docente }]))
            // return AXIOS_REQUEST(LOAD_TEACHERS, "POST", { idtipo: "3" }).then(resp => {
            //     let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nombres, value: o.dni_admin })) : [];
            //     optionsData.teachers = list;
            //     return list;
            // });
        }
    }

    const getApprobationType = () =>
        !!(onlyRead) ? new Promise((resolve) => resolve([{ label: allActivityData.tipo_aprob, value: allActivityData.idtipo_aprob }])) :
            AXIOS_REQUEST(LOAD_APPROBATION_TYPE).then(resp => {
                let list = resp.msg !== "ERROR" ? resp.data?.map?.(o => ({ label: o.nomb_tapro, value: o.id_tapro, certifica: o.certifica })) : []
                optionsData.approbationTypes = list;
                return list;
            })


    useEffect(() => {
        if (formFields.length === 0) {
            loadForm();
        } else {
            if (disabled) {
                setFormFields([]);
                setTimeout(() => {
                    loadForm();
                }, 20)
            } else {
                loadForm();
            }
        }
    }, [disabled]);

    const loadForm = () => {

        let form = [
            {
                tag: "input",
                label: "Nombre",
                id: "nomb_activ",
                classGroup: "col-md-6",
                attrs: {
                    placeholder: "Máximo 60 carácteres",
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
                label: "Cupos",
                id: "cupos",
                attrs: {
                    placeholder: "Mínimo 1 cupo",
                    type: "number",
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                    min: 1,
                    max: 10000,
                }
            },
            {
                tag: "select",
                label: "Departamento",
                id: "iddepart",
                attrs: {
                    placeholder: "Seleccione...",
                    fetchValues: getMyDepartments,
                    handleChange: getTeachers,
                    options: optionsData.departments
                },
                classGroup: "col-md-6",
                validations: {
                    required: true
                }
            },
            // {
            //     tag: "select",
            //     label: "Departamento del instructor",
            //     id: "instructordepart",
            //     attrs: {
            //         placeholder: "Seleccione para buscar instructores...",
            //         handleChange: getTeachers,
            //         fetchValues: getDepartments,
            //         options: optionsData.departments
            //     },
            //     classGroup: "col-md-6",
            //     validations: {
            //         required: true
            //     }
            // },
            {
                tag: "select",
                label: "Instructor encargado",
                id: "dnidocente",
                attrs: {
                    fetchValues: !!(allActivityData.dni_docente) && getTeachers,
                    placeholder: "Seleccione...",
                    options: []
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                }
            },
            {
                tag: "select",
                label: "Bono por participación",
                id: "idbonus",
                attrs: {
                    placeholder: "Seleccione...",
                    fetchValues: getBonus,
                    options: optionsData.bonus
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                }
            },
            {
                tag: "select",
                label: "Categoría",
                id: "categoria",
                attrs: {
                    placeholder: "Seleccione...",
                    fetchValues: getCategories,
                    options: optionsData.categories
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                }
            },
            {
                tag: "select",
                label: "Tipo de aprobación",
                id: "tipoaprobacion",
                attrs: {
                    placeholder: "Seleccione...",
                    fetchValues: () => getApprobationType().then(resp => {
                        if (!!(defaultData)) {
                            setShowHoursToCert(resp.find(i => i.value === defaultData.tipoaprobacion)?.certifica);
                        }
                        return resp;
                    }),
                    options: optionsData.approbationTypes,
                    handleChange: ({ target }) => {
                        setShowHoursToCert(optionsData.approbationTypes.find(i => i.value.toString() === target.value)?.certifica);
                    },
                },
                classGroup: "col-md-6",
                validations: {
                    required: true,
                }
            },
            {
                tag: "textarea",
                label: "Descripción",
                id: "descripcion",
                attrs: {
                    placeholder: "Mínimo 10 carácteres",
                },
                classGroup: "col-md-6",
                validations: {
                    minLength: 10,
                    required: true,
                }
            },
        ];
        form = form.map(f => {
            f.attrs.disabled = !!(disabled);
            !!(defaultData?.[f.id]) && (f.attrs.defaultValue = defaultData[f.id]);
            return f;
        });
        setFormFields(form);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-row" key="NewActivity">
            {formFields.map(field => <FieldMaker
                {...field}
                register={register}
                key={field.id}
                isInvalid={isSubmitted ? !!(errors[field.id]) : null}
                feedback={isSubmitted ? (errors[field.id]?.message || "¡Muy bien!") : null}
                control={control}
            />
            )}
            {showHoursToCert &&
                <FieldMaker
                    {...{
                        tag: "input",
                        label: "Número de horas a certificar: El sistema calculará automaticamente el número total de horas a certificar de acuerdo a las sesiones si no ingresa un valor",
                        id: "horas_cert",
                        attrs: {
                            type: "number",
                            placeholder: "Ejemplo: 20 (Opcional)",
                            // defaultValue: defaultData?.horas_cert,
                            disabled
                        },
                        validations: {},
                        classGroup: "col-12 mt-3",
                    }}
                    register={register}
                    key={"horas_cert"}
                    isInvalid={isSubmitted ? !!(errors["horas_cert"]) : null}
                    feedback={isSubmitted ? (errors["horas_cert"]?.message || "¡Muy bien!") : null}
                    control={control}
                />
            }
            {!(disabled) && <div className="col-12 mt-4 justify-content-between">
                <button className="btn btn-success">{btnText || "Siguiente"}</button>
            </div>}
        </form>
    );
};

export default NewActivity;

export const ProgramsChooser = ({ cancelBtn, submitBtn, minSelect, selected, disabled }) => {

    const [data, setData] = useState({ selected, programs });

    useEffect(() => {
        !(programs) && AXIOS_REQUEST(LOAD_PROGRAMS).then(resp => {
            let ctg = [];
            let quilla = [];
            if (resp.msg !== "ERROR") {
                ctg = resp.data?.filter(p => p.ciudad === "CARTAGENA" && p.activo);
                quilla = resp.data?.filter(p => p.ciudad === "BARRANQUILLA" && p.activo);
            }
            programs = { ctg, quilla };
            setData({ ...data, programs: { ctg, quilla } })
        })
    }, []);

    const handleChange = (e) => {
        let d = data.selected;
        let idx = data.selected.indexOf(`${e.target.value}`);
        idx >= 0 ? d.splice(idx, 1) : d.push(e.target.value);
        setData({ ...data, selected: d })
    }

    const selectAll = (city) => {
        setData({ ...data, selected: [...new Set([...data.selected, ...data.programs[city].map(p => `${p.codi_prog}`)])] })
    }
    const quitAll = (city) => {
        let cp = data.programs[city].map(p => `${p.codi_prog}`);
        setData({ ...data, selected: data.selected.filter(p => !cp.includes(p)) })
    }

    const handleSubmit = (submit) => {
        if (submit) {
            if (data.selected.length < (minSelect || "1")) {
                setData({ ...data, error: "Debe elegir al menos " + (minSelect || "1") });
                return false;
            }
        }
        return data.selected;
    }

    const printProgList = (city) => <>
        {!(disabled) && <div>
            <button className="mb-4 rounded-pill btn btn-sm btn-outline-primary" onClick={() => selectAll(city)}>Seleccionar todos</button>
            <button className="mb-4 ml-3 rounded-pill btn btn-sm btn-outline-danger" onClick={() => quitAll(city)}>Quitar todos</button>
        </div>}
        <div className="form-row">
            {data.programs[city].map((p, i) =>
                <div key={i} className="form-group col-12 col-md-6">
                    <div className="custom-control custom-checkbox text-muted" style={{ "zIndex": 0 }}>
                        <input type="checkbox"
                            disabled={disabled}
                            className="custom-control-input"
                            id={`prog-${p.codi_prog}`}
                            checked={data.selected.includes(`${p.codi_prog}`)}
                            value={p.codi_prog}
                            onChange={handleChange} />
                        <label className="custom-control-label" htmlFor={`prog-${p.codi_prog}`}>
                            {`${p.nomb_prog}`}
                            {/* <small className="d-block text-gray">- {p.ciudad}</small> */}
                        </label>
                    </div>
                </div>)}
        </div>
    </>

    return (
        <div>
            {!!(data.programs) ?
                <>
                    <div className="mb-4 text-gray rounded-pill pl-3 pt-2 pb-2 bg-light">Programas en Cartagena</div>
                    {printProgList("ctg")}
                    <div className="mb-4 mt-5 text-gray rounded-pill pl-3 pt-2 pb-2 bg-light">Programas en Barranquilla</div>
                    {printProgList("quilla")}
                </> : <Loader2 open>Cargando programas</Loader2>
            }
            <div className="mt-5 mb-5">
                <span className="bg-light rounded-pill pl-4 pr-4 pt-2 pb-2">Programas seleccionados: <b>{data.selected.length}</b></span>
                {data.error && data.selected.length < (minSelect || 1) && <div className="text-danger mt-4">
                    <small><WarningIcon size={13} /></small><small className="ml-2">{data.error}</small>
                </div>}
            </div>

            {!(disabled) && <div className="d-flex w-100 justify-content-between mt-4">
                {!!(cancelBtn) && <input className="btn btn-success"  {...cancelBtn} type="button" onClick={() => { cancelBtn.onClick(handleSubmit(false)) }} />}
                <button className="btn btn-success" onClick={() => {
                    let d = handleSubmit(true);
                    !!(d) && submitBtn.onClick(d)
                }}>{submitBtn.text || "Siguiente"}</button>
            </div>}
        </div >
    )
}
export const RolesChooser = ({ cancelBtn, submitBtn, minSelect, selected, disabled }) => {

    const [data, setData] = useState({ selected, roles, arrayWithRequiredPrograms: [] })

    useEffect(() => {
        !(roles) ? AXIOS_REQUEST(LOAD_ROLES).then(resp => {
            roles = resp.data;
            setData({
                ...data,
                roles: resp.msg !== "ERROR" ? resp.data : [],
                arrayWithRequiredPrograms: selected.map(i => `${roles.find(e => e.id_rol == i)?.programa}`)
            });
        }) :
            !!(selected) && setData({ ...data, arrayWithRequiredPrograms: selected.map(i => `${roles.find(e => e.id_rol == i)?.programa}`) })
    }, []);

    const handleChange = (e) => {
        let d = data.selected;
        let arp = data.arrayWithRequiredPrograms;
        let idx = data.selected.indexOf(`${e.target.value}`);

        if (idx >= 0) {
            d.splice(idx, 1);
            arp.splice(idx, 1)
        } else {
            d.push(e.target.value);
            let r = data.roles.find(i => i.id_rol == e.target.value);
            arp.push(`${r?.programa}`)
        }

        setData({ ...data, selected: d, arrayWithRequiredPrograms: arp });
    }

    const handleSubmit = (submit) => {
        if (submit) {
            if (data.selected.length < (minSelect || "1")) {
                setData({ ...data, error: "Debe elegir al menos " + (minSelect || "1") });
                return false;
            }
        }
        return data.selected;
    }

    return (
        <div>
            <div className="form-row">
                {!!(data.roles) ? data.roles.map((r, i) => <div key={i} className="form-group col-12 col-md-6">
                    <div className="custom-control custom-checkbox" style={{ "zIndex": 0 }}>
                        <input type="checkbox"
                            disabled={disabled}
                            className="custom-control-input"
                            id={`role-${r.id_rol}`}
                            checked={data.selected.includes(`${r.id_rol}`)}
                            value={r.id_rol}
                            onChange={handleChange} />
                        <label className="custom-control-label" htmlFor={`role-${r.id_rol}`}>
                            {`${r.desc_rol}`}
                            {r.programa === 1 && <small className='pl-1 text-warning'>(Requiere programa)</small>}
                        </label>
                    </div>
                </div>) : <Loader2 open>Cargando roles</Loader2>
                }
            </div>

            <div className="mt-5 mb-5">
                <span className="bg-light rounded-pill pl-4 pr-4 pt-2 pb-2">Roles seleccionados: <b>{data.selected.length}</b></span>
                {data.error && data.selected.length < (minSelect || 1) && <div className="text-danger mt-4">
                    <small><WarningIcon size={13} /></small><small className="ml-2">{data.error}</small>
                </div>}
            </div>

            {!(disabled) && <div className="d-flex w-100 justify-content-between mt-4">
                {!!(cancelBtn) && <input className="btn btn-success"  {...cancelBtn} type="button" onClick={() => { cancelBtn.onClick(handleSubmit(false)) }} />}
                <button className="btn btn-success" onClick={() => {
                    let d = handleSubmit(true);
                    !!(d) && submitBtn.onClick(d, data.arrayWithRequiredPrograms.includes('1'))
                }}>{submitBtn.text || "Siguiente"}</button>
            </div>}
        </div >
    )
}
