import { Component } from "react";

class Certificados extends Component {
    constructor(props) {
        super(props);
        this.state = { list: props.list }
    }
    handleClick = (item) => {
        this.props.handleClick(item).then(resp => alert(JSON.stringify(resp)));
    }

    render() {
        if (this.state.list?.length === 0) {
            return <div className="mt-5">
                <p className="text-muted tetx-center">No tienes certificados, solicitalos desde la plataforma de Actividades Uninúñez</p>
                <br />
                <p className="text-muted tetx-center">Si acabas de crear tu cuenta aquí, debes regresar a la plataforma de Actividades Uninúñez y continuar con los pasos indicados.</p>
            </div>
        }
        return (<div className="table-responsive">
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope="col">Código</th>
                        <th scope="col" style={{ minWidth: "200px" }}>Certificado</th>
                        <th scope="col" style={{ minWidth: "100px" }}>Periodo</th>
                        <th className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.list.reverse().map((item, i) => {
                            return <tr key={i} >
                                <th scope="row">{item.code.padStart(5, '0')}</th>
                                <td className="cursor-pointer" onClick={() => window.open(item.file, "_blank")}>
                                    <span className="link-primary">{item.descripction?.activityName}</span><br />
                                    <small>{item.descripction?.emiter}</small>
                                </td>
                                <td>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 bi bi-calendar-range text-muted" viewBox="0 0 16 16">
                                            <path d="M9 7a1 1 0 0 1 1-1h5v2h-5a1 1 0 0 1-1-1zM1 9h4a1 1 0 0 1 0 2H1V9z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                        </svg>
                                        {item.descripction?.period}
                                    </span>
                                    <br />
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 bi bi-clock text-muted" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                        </svg>
                                        <small>{item.descripction?.hours || 0} horas</small>
                                    </span>
                                </td>
                                {item.active === "true" ?
                                    <td className="text-success text-center">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                            </svg>
                                        </span><br />
                                        <span >Válido</span>
                                    </td>
                                    :
                                    <td className="text-danger text-center">
                                        <span >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                                            </svg>
                                        </span><br />
                                        <span>Revocado</span>
                                    </td>
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div >
        );
    }
}
export default Certificados;