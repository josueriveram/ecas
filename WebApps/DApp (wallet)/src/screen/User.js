import { Component, lazy } from 'react';
import Certificados from './../component/Certificados';
import Puntos from './../component/Puntos';
import CertificatesContract from './../certificate';
import PointsContract from './../cpoint';
import { CertificateService } from "./../services/certificateServices";
import { PointService } from "./../services/pointService";
import LoaderIcon from '../component/LoaderIcon';
import metainfo_png from "./../img/metainfo.png";
import ethereum_logo from "./../img/ethereum-logo.svg";

class UserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            showLogginButton: true,
            account: null,
            net: null,
            netId: null,
            certs: null,
            totalCerts: 0,
            totalPoints: 0,
            transact: null,
            contractCert: null,
            contractPoint: null
        }
    }

    connectToMetamask = () => {
        this.setState({ showLogginButton: false })
        return window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(resp => resp[0])
            .catch(err => {
                if (err.code === 4001) {
                    this.setState({ showLogginButton: false })
                } else {
                    console.error({ err });
                }
                return null;
            })
    }

    async loadContracts(provider = window.ethereum) {
        this.certificates = await CertificatesContract(provider);
        this.certificateService = new CertificateService(this.certificates);

        this.points = await PointsContract(provider);
        this.pointService = new PointService(this.points);
    }

    loadEvents() {
        //Metodo de Metamask para detectar cambio de cuenta.
        window.ethereum.on('accountsChanged', (accounts) => {
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
            this.setState({
                showLogginButton: !(accounts.length),
                account: accounts[0]
            }, async () => { this.load() });
        });

        window.ethereum.on('chainChanged', (chainId) => {
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
            window.location.reload();
        });

        window.ethereum.on('disconnect', (info) => {
            window.location.reload();
        });

        // window.ethereum.on('connect', (chainId) => {
        //     console.log("CONNECT")
        //     console.log({ chainId });
        // });
        window.ethereum.on('message', (e) => {
            console.log({ e })
        });
    }

    async loadDataIntoState() {
        let account = (await this.connectToMetamask());
        if (!!(account)) {
            let net = await window.ethereum.request({ method: 'net_version' });
            let netId = await window.ethereum.request({ method: 'eth_chainId' });
            await this.loadEvents();
            await this.loadContracts();

            this.setState({
                account,
                net,
                netId,
                contractCert: this.certificates?.address,
                contractPoint: this.points?.address
            }, () => {
                this.load();
            });
        } else {
            this.setState({ showLogginButton: true })
        }
    }

    getCerts() {
        this.setState({ certs: null })
        this.certificateService.getCertificates(this.state.account).then(certificados => {
            let cmap = [];
            if (certificados.length === 0) {
                this.setState({ certs: certificados })
            } else {
                certificados.forEach(code => {
                    this.getCertificate(code).then(resp => {
                        cmap.push({ ...resp, descripction: JSON.parse(resp.descripction), code });
                        if (cmap.length === certificados.length) {
                            this.setState({ certs: cmap })
                        }
                    })
                });
            }
        });
    }

    getCertificate = (id) => this.certificateService.getCertificate(id);
    getOperation = (id) => this.pointService.getOperation(id);

    async getTotalCerts() {
        let tcerts = await this.certificateService.getTotalCertificates(this.state.account);
        this.setState({
            totalCerts: tcerts
        });
    }

    async getTotalPoints() {
        let tpoints = await this.pointService.getLoyaltyPointTotal(this.state.account);
        this.setState({
            totalPoints: tpoints
        });
    }

    async getOperations() {
        this.setState({ transact: null })
        let operations = await this.pointService.getOperations2(this.state.account);
        this.setState({
            transact: operations
        });
    }

    async load() {
        if (this.certificates != null || this.points != null) {
            this.getCerts();
            this.getTotalCerts();
            this.getOperations();
            this.getTotalPoints();
        }
    }

    handleTabsClick(activeTab) {
        this.setState({ activeTab })
    }

    componentDidMount() {
        this.loadDataIntoState();
    }

    render() {

        const { activeTab, account, showLogginButton, contractCert, contractPoint, net, netId, totalCerts, totalPoints, certs, transact } = this.state;
        if (showLogginButton) {
            return <div className="text-center text-muted pt-5">
                <big>Por favor debe conectar una cuenta en Metamask</big><br /><br />
                {<button className="btn btn-warning" onClick={() => this.loadDataIntoState()}>Conectar</button>}
            </div>
        }
        return (
            <div className="mt-5">
                {!!(net) ?
                    (netId != "0x5" ? <>
                        <div role="alert" className=" alert alert-warning mt-5 d-flex align-items-center justify-content-center">
                            <div className="me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className=" text-warning bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                </svg>
                            </div>
                            <div>
                                Debes conectarte a la red <b>Goerli Test Network</b> de Etherium
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <img className="shadow mt-4 rounded" src={metainfo_png} />
                        </div>
                    </>
                        :
                        <div >
                            <div className="d-flex justify-content-center mb-4">
                                <ul className="nav nav-pills mb-3" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button onClick={() => this.handleTabsClick(0)}
                                            className={`nav-link ${activeTab === 0 ? "active" : ""}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === 0}>Certificados</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button onClick={() => this.handleTabsClick(1)}
                                            className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === 1}>Puntos</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content" id="pills-tabContent">
                                <div className="card p-md-5">
                                    <div className="card-body">
                                        <div className="d-flex mb-4">
                                            <div className="me-2 text-center mt-1">
                                                <img src="https://docs.metamask.io/metamask-fox.svg" height="45px" />
                                            </div>
                                            <div className="text-truncate">
                                                <div>
                                                    <p className="mb-0">
                                                        <small>
                                                            <b>Cuenta:</b> <a target="_blank" href={`https://goerli.etherscan.io/address/${account}`}>{account}</a>
                                                        </small>
                                                    </p>
                                                </div>
                                                <div className="me-5">
                                                    <p className="mb-0">
                                                        <small><b>Red:</b> <span>{netId}</span></small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {activeTab === 0 && <div className="tab-pane fade show active" role="tabpanel">
                                            <div className="d-flex mb-4">
                                                <div className="me-2 text-center mt-1 pe-2 ps-2">
                                                    <img src={ethereum_logo} height="45px" />
                                                </div>
                                                <div className="text-truncate">
                                                    <div>
                                                        <p className="mb-0">
                                                            <small>
                                                                <b>Smart contract:</b> <a className="text-break" target="_blank" href={`https://goerli.etherscan.io/address/${contractCert}`}>{contractCert}</a>
                                                            </small>
                                                        </p>
                                                    </div>
                                                    <div className="me-5">
                                                        <p className="mb-0">
                                                            <small><b>Total certificados:</b> <span>{totalCerts}</span></small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-muted">
                                                <p>- Los certificados son emitidos por la Corporación Universitaria Rafael Núñez desde su plataforma Actividades Uninúñez.</p>
                                            </div>
                                            {
                                                !!(certs) ?
                                                    <Certificados list={certs} />
                                                    : <div className="d-flex justify-content-center"><LoaderIcon /></div>
                                            }
                                        </div>}

                                        {activeTab === 1 && <div className="tab-pane fade show active" role="tabpanel">
                                            <div className="d-flex flex-wrap mb-4">
                                                <div className="me-2 text-center mt-1 pe-2 ps-2">
                                                    <img src={ethereum_logo} height="45px" />
                                                </div>
                                                <div className="">
                                                    <div>
                                                        <p className="mb-0">
                                                            <small>
                                                                <b>Smart contract:</b> <a className="text-break" target="_blank" href={`https://goerli.etherscan.io/address/${contractPoint}`}>{contractPoint}</a>
                                                            </small>
                                                        </p>
                                                    </div>
                                                    <div className="me-5">
                                                        <p className="mb-0">
                                                            <small><b>Total Puntos:</b> <span>{totalPoints}</span></small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-muted">
                                                <p>- Las transacciones de puntos de lealtad son emitidas por la Corporación Universitaria Rafael Núñez desde su plataforma Actividades Uninúñez.</p>
                                            </div>
                                            {
                                                !!(transact) ?
                                                    <Puntos list={transact} />
                                                    : <div className="d-flex justify-content-center"><LoaderIcon /></div>
                                            }
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                    <div className="d-flex justify-content-center"><LoaderIcon /></div>
                }
            </div >
        );
    }
}

export default UserScreen;
