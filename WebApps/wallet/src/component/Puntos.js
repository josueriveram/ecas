import { Component } from "react";

class Puntos extends Component {
    constructor(props) {
        super(props);
        this.state = { list: [] }
    }

    render() {
        return (<div>
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Puntos</th>
                        <th scope="col">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.list.reverse().map((item, i) => {
                            return <tr key={i}>
                                <th scope="row">{i + 1}</th>
                                <td>
                                    {item[0] === "+" ?
                                        <b className="text-success">{item[0]}{item[2]}</b>
                                        :
                                        <b className="text-danger">{item[2]}</b>
                                    }
                                </td>
                                <td>{item[1]}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>

        );
    }
}
export default Puntos;