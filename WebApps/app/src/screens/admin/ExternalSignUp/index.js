import React, { Component, createRef, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import FieldMaker from '../../../components/FormMaker/FieldMaker';
import ModalUI from '../../../components/ModalUI';
import { ChevronRightIcon } from '../../../components/UI/Icons';
import Loader from '../../../components/UI/Loader';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ADD_EXTERNAL_PARTICIPANTS } from '../../../services/endPoints';
import { exportToSpreadsheet } from '../../../services/xlsxService';

class ExternalSignUp extends Component {

    constructor() {
        super();
        this.state = {
            modal: null,
            file: null,
            fileData: null,
            loader: null
        }

        this.fileInput = createRef()
    }

    fileRef = createRef();

    goToBackPage = () => this.props.history.goBack()

    /**
     * DATA FOR NEW USERS
     * {
     * codigo_actividad: Opcional, (Para enrolar en una actividad especifica)
     * codnum_part,   --------> custom like "external" 
     * dni_part,    
     * nomb_part, 
     * apel_part, 
     * email_part, 
     * role_part,     ---------> external role
     * codprog_part   ---------> NULL
     * }
     * 
     */

    handleChangeFile = (f) => {
        f = f[0];
        if (!(f)) {
            return this.setState({ file: null })
        }

        let extensionFile = f.name.substring(f.name.lastIndexOf('.') + 1);

        let file_reader = new FileReader()
        if (["txt", "csv"].includes(extensionFile)) {
            file_reader.onloadend = (e) => {
                let r = file_reader.result;
                this.readCsv(r)
            };
            file_reader.readAsText(f);
        } else {
            this.setState({
                loader: null,
                modal: {
                    open: true,
                    type: "warning",
                    title: "Espere",
                    alert: "Debe seleccionar un archivo con extención CSV",
                    children: <><p className="text-gray">Si el archivo es de tipo Excel, guardelo o exportelo de tipo CSV</p></>,
                    size: "md",
                    onClosed: (submit) => {
                        this.setState({ modal: null })
                    },
                    buttons: [{ color: "success", text: "Ok", close: true }]
                }
            })
            f = null;
        }
        // } else if(["xls", "xlsx"].includes(extensionFile)){
        //     file_reader.onloadend = (e) => {
        //         let r = file_reader.result;
        //         r = new Uint8Array(r)
        //     };
        //     file_reader.readAsArrayBuffer(f)
        // }
        this.setState({ file: f })
    }

    readCsv = (allText) => {
        let separator = ";";
        let record_num = 5;  // or however many elements there are in each row
        let allTextLines = allText.split(/\r\n|\n/);
        let entries = allTextLines.shift().split(separator);
        let headings = entries.splice(0, record_num);
        allTextLines = allTextLines.filter(l => /(\w+;)+/g.test(l));
        this.setState({
            fileData: allTextLines.map(line => line.split(separator).reduce((p, c, j) => { p[headings[j]] = c; return p; }, {}))
        })
    }

    quitFile = () => {
        this.fileRef.current.value = null;
        this.setState({
            file: null,
            fileData: null
        })
    }

    downloadTemplate = () => {
        exportToSpreadsheet([
            { dni: "123456789", nombres: "Ejemplo", apellidos: "Ejemplo", correo: "ejemplo@gmail.com", actividad: "" }
        ], `Plantilla excel para registro de externos`)
            .then(respSheet => { })
    }

    submitAll = data => {
        if (!!(data.participants?.length)) {
            this.setState({ loader: "Registrando" }, () => {
                AXIOS_REQUEST(ADD_EXTERNAL_PARTICIPANTS, "post", data.participants).then(resp => {
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "success",
                            title: "¡Muy bien!",
                            alert: "Se ha realizado el registro de los participantes",
                            size: "md",
                            onClosed: (submit) => {
                                this.setState({ modal: null }, () => { this.quitFile() })
                            },
                            buttons: [{ color: "success", text: "Ok", close: true }]
                        }
                    })
                }).catch(err => {
                    this.setState({
                        loader: null,
                        modal: {
                            open: true,
                            type: "danger",
                            title: "Ops...",
                            alert: "No se pudo realizar el registro de los participantes",
                            size: "md",
                            onClosed: (submit) => {
                                this.setState({ modal: null })
                            },
                            buttons: [{ color: "success", text: "Ok", close: true }]
                        }
                    })
                })
            })
        }
    }

    render() {
        return (
            <>
                <ModalUI open={this.state.modal?.open || false} {...this.state.modal} />
                <Loader open={!!(this.state.loader)} color="warning">{this.state.loader}</Loader>

                <div className="d-flex justify-content-between mb-5">
                    <h4 className="text-gray mb-0">Participantes externos</h4>
                    <button onClick={() => this.goToBackPage()} className="btn btn-light rounded-pill border" style={{ transform: "rotate(180deg)" }}>
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="mb-4">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="text-muted">
                                <p>Seleccione un archivo CSV con la información de los participantes a registrar, debe contener el <b>Número de identificación, Nombres, Apellidos y Correo</b> de cada participante.</p>
                                <p>- Tenga en cuenta que el correo puede ser solo Gmail o una cuenta institucional.</p>
                                <p>- En caso de registrar participantes a una actividad (es opcional), deberá especificar el código de la actividad en la cual va a registrarlos.</p>
                            </div>
                            <div className="custom-file mt-4 mb-2">
                                <input type="file" ref={this.fileRef} className="custom-file-input" id="csvfile" lang="es" accept=".csv" onChange={e => this.handleChangeFile(e.target.files)} />
                                <label className="custom-file-label" htmlFor="csvfile">{this.state.file?.name || "Seleccionar archivo CSV"}</label>
                            </div>
                            <div>
                                {!!(this.state.fileData) ?
                                    <button className="btn btn-sm btn-danger" onClick={() => this.quitFile()}>Quitar archivo</button>
                                    : <button className="btn btn-sm btn-link" onClick={() => this.downloadTemplate()}><small>Descargar plantilla excel</small></button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <FileDataToForm data={this.state.fileData || []} onSubmit={this.submitAll} />
                </div>

            </>
        );
    }
}

export default ExternalSignUp;

const FileDataToForm = props => {
    const { data } = props;

    const { register, handleSubmit, formState: { errors, isSubmitted }, control, setValue, clearErrors } = useForm({ defaultValues: { participants: data } || {} });
    const { fields, append, remove } = useFieldArray({ control, name: "participants" });

    let form = [
        {
            tag: "input",
            id: "dni",
            attrs: {
                placeholder: "Identificación",
                type: "text",
            },
            classGroup: "col-auto width-130px",
            validations: {
                required: true,
                pattern: /^[a-zA-Z0-9]{6,20}$/
            }
        }, {
            tag: "input",
            id: "nombres",
            attrs: {
                placeholder: "Nombres",
                type: "text",
            },
            classGroup: "col-auto",
            validations: {
                required: true,
                pattern: /[\w]{3,}/
            }
        }, {
            tag: "input",
            id: "apellidos",
            attrs: {
                placeholder: "Apellidos",
                type: "text",
            },
            classGroup: "col-auto",
            validations: {
                required: true,
                pattern: /[\w]{3,}/
            }
        }, {
            tag: "input",
            id: "correo",
            attrs: {
                placeholder: "Correo",
                type: "email",
            },
            classGroup: "col-auto",
            validations: {
                required: true,
                pattern: /^[\w-\.]+@((curn(virtual)?\.edu\.co)|(gmail(\.[\w-]+)+))$/
            }
        }, {
            tag: "input",
            id: "actividad",
            classGroup: "col-auto width-80px",
            attrs: {
                type: "text",
            },
            validations: {
                pattern: /^[a-zA-Z0-9]{1,10}$/
            }
        }
    ];

    const deleteOne = idx => { remove(idx); }
    const addOne = () => {
        append({
            nombres: "",
            apellidos: "",
            correo: "",
            actividad: "",
            dni: ""
        });
    }

    useEffect(() => {
        clearErrors("participants");
        setValue("participants", data)
    }, [data])

    return (<>
        <div className="card border-0 mb-5">
            <div className="card-body">
                <div className="mb-4"><b className="rounded-pill bg-light pl-3 pb-2 pt-2 pr-3 d-inline-block text-gray">Lista de participantes: {data.length}</b></div>
                <form onSubmit={handleSubmit(props.onSubmit)}>
                    <div className="table-responsive">
                        <table className="table form">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Identificación</th>
                                    <th scope="col">Nombres</th>
                                    <th scope="col">Apellidos</th>
                                    <th scope="col">Correo</th>
                                    <th scope="col">Actividad</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((e, idx) => <tr className="" key={idx}>
                                    {form.map((f) => {
                                        let id = `participants.${idx}.${f.id}`;
                                        return <td key={id}><FieldMaker
                                            {...f}
                                            id={id}
                                            register={register}
                                            isInvalid={isSubmitted ? !!(errors["participants"]?.[idx]?.[f.id]) : null}
                                            feedback={isSubmitted ? (errors["participants"]?.[idx]?.[f.id]?.message || null) : null}
                                        /></td>
                                    }
                                    )}
                                    <td key={idx} className="text-right pl-0"><button type="button" className="btn btn-sm btn-danger mt-1" onClick={() => deleteOne(idx)}>x</button></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <div><button className="btn btn-success" type="button" onClick={() => addOne()}>Añadir</button></div>
                        <div><button className="btn btn-success" type="submit" disabled={fields.length === 0}>Registrar todos</button></div>
                    </div>
                </form>
            </div>
        </div>
    </>)
}