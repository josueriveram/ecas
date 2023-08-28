import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { login, setUnauthorized } from './../../../store/admin/actions/userAction';
import ModalUI from '../../../components/ModalUI';

// Test create file 
import lazyLoaderComponents from '../../../services/lazyLoaderComponents';
import Card from 'reactstrap/lib/Card';
import './styles.css';
import { PersonBadgeFill } from '../../../components/UI/Icons';
import { LOGO_LOGIN } from '../../../services/constants';

const GoogleLogin = lazy(() => lazyLoaderComponents(() => import('../../../components/GoogleLogin')));

class LoginScreen extends Component {

    constructor(props) {
        super();

        this.state = {
            userEmail: "",
            loader: null,
            modal: null,
            error: null
        }
    }

    startLogin = (gObject, revokeCallback, role) => {
        let data = { correo: this.state.userEmail, onetoken: gObject.credential }
        if (!!(role)) {
            data.role = role;
        }
        // if (!!(localStorage.getItem("aulas/gtaccess"))) { data.token = localStorage.getItem("aulas/gtaccess") }
        this.props.login({ data, persona: gObject.profileObj })
            .then(resp => {
                if (!(resp)) {
                    throw new Error();
                } else if (!!(resp?.length)) {
                    this.setState({
                        modal: {
                            type: "info",
                            title: "",
                            open: true,
                            size: "md",
                            onClosed: () => this.setState({ modal: null }),
                            children: <>
                                <p className="text-gray text-center mb-4">Usted tiene {resp.length} tipos de cuenta administrativa, por favor seleccione con la que desea ingresar</p>
                                {resp.map((c, i) => <div className="zoom-hover-in card border shadow-none mb-5" key={i} onClick={() => {
                                    this.setState({ loader: true, modal: null }, () => this.startLogin(gObject, revokeCallback, c.idTipo))
                                }
                                }>
                                    <div className="card-body">
                                        <i className="text-muted mr-2"><PersonBadgeFill size={24} /> </i><b>{c.rolName}</b>
                                    </div>
                                </div>)
                                }
                            </>,
                            buttons: []
                        }
                    })
                }
            }).catch(err => {
                this.setState({
                    loader: null,
                    modal: {
                        size: "sm",
                        title: "Ops...",
                        // alert: "No puedes iniciar sesión",
                        onClosed: () => this.setState({ modal: null }),
                        children: <p className="text-center">Parece que no tiene permisos para ingresar</p>,
                        type: "danger",
                        buttons: [{ color: "primary", text: "OK", close: true }]
                    }
                })
                this.props.setUnauthorized()
                revokeCallback()
            })
    }

    /**
    * @param {json} gObject Google object response
    */
    loginWithGoogle = (gObject, revokeCallback) => {
        // if (!!(gObject.accessToken)) { localStorage.setItem("aulas/gtaccess", gObject.accessToken) }
        if (!!(gObject.profileObj?.email)) {
            if ((/^.+@(curn(virtual)?)\.edu\.co+$/ig.test(gObject.profileObj.email))) {
                this.setState({
                    loader: true,
                    userEmail: gObject.profileObj.email,
                    error: null
                })
                this.startLogin(gObject, revokeCallback)
            } else {
                this.props.setUnauthorized();
                revokeCallback()
                this.setState({
                    loader: false,
                    userEmail: "",
                    modal: {
                        size: "sm",
                        title: "Espera",
                        onClosed: () => this.setState({ modal: null }),
                        // alert: "No puedes iniciar sesión",
                        children: <p className="text-center">Solo puedes iniciar sesión con cuentas que sean <b>@curn.edu.co </b> y/o <b>@curnvirtual.edu.co</b></p>,
                        type: "warning",
                        buttons: [{ color: "primary", text: "OK", close: true }]
                    }
                })
            }
        } else {
            this.props.setUnauthorized();
            revokeCallback()
            if (!!(gObject.error)) {
                this.setState({
                    loader: false,
                    userEmail: "",
                    modal: {
                        size: "sm",
                        title: "Espera",
                        onClosed: () => this.setState({ modal: null }),
                        // alert: "No puedes iniciar sesión",
                        children: <div className="text-center" dangerouslySetInnerHTML={{ __html: gObject.error }}></div>,
                        type: "warning",
                        buttons: [{ color: "primary", text: "OK", close: true }]
                    }
                })
            }
        }
    }

    render() {
        return (
            <>
                <div className="bg-light-gray login-screen h-100">
                        <div className="scattered-previews"
                            dangerouslySetInnerHTML={{
                                __html: `
                            <div class="glass" style="width: 110px; height: 142px; top: 24px; left: 1154px; transform: rotate(0.791623turn); opacity: 0.19525;"></div>
                            <div class="glass" style="width: 192px; height: 181px; top: 626px; left: 17px; transform: rotate(0.417158turn); opacity: 0.17;"></div>
                            <div class="glass" style="width: 186px; height: 174px; top: 579px; left: 446px; transform: rotate(0.160388turn); opacity: 0.3;"></div>
                            <div class="glass" style="width: 98px; height: 124px; top: 790px; left: 666px; transform: rotate(0.57776turn); opacity: 0.1519;"></div>
                            <div class="glass" style="width: 56px; height: 82px; top: 485px; left: 902px; transform: rotate(0.767956turn); opacity: 0.0574;"></div>
                            <div class="glass" style="width: 179px; height: 55px; top: 932px; left: 87px; transform: rotate(0.581793turn); opacity: 0.123063;"></div>
                            <div class="glass" style="width: 73px; height: 137px; top: 506px; left: 1459px; transform: rotate(0.403828turn); opacity: 0.125012;"></div>
                            <div class="glass" style="width: 82px; height: 178px; top: 869px; left: 1090px; transform: rotate(0.627651turn); opacity: 0.18245;"></div>
                            <div class="glass" style="width: 168px; height: 79px; top: 859px; left: 871px; transform: rotate(0.340883turn); opacity: 0.1659;"></div>
                            <div class="glass" style="width: 122px; height: 191px; top: 43px; left: 1737px; transform: rotate(0.563504turn); opacity: 0.291275;"></div>
                            <div class="glass" style="width: 118px; height: 181px; top: 179px; left: 108px; transform: rotate(0.674385turn); opacity: 0.266975;"></div>
                            <div class="glass" style="width: 75px; height: 76px; top: 800px; left: 559px; transform: rotate(0.305383turn); opacity: 0.07125;"></div>
                            <div class="glass" style="width: 113px; height: 179px; top: 553px; left: 1518px; transform: rotate(0.232923turn); opacity: 0.252837;"></div>
                            <div class="glass" style="width: 109px; height: 177px; top: 301px; left: 1451px; transform: rotate(0.819878turn); opacity: 0.241163;"></div>
                            <div class="glass" style="width: 80px; height: 136px; top: 311px; left: 449px; transform: rotate(0.865124turn); opacity: 0.136;"></div>
                            <div class="glass" style="width: 99px; height: 100px; top: 360px; left: 1726px; transform: rotate(0.0571414turn); opacity: 0.12375;"></div>
                            <div class="glass" style="width: 136px; height: 83px; top: 417px; left: 1207px; transform: rotate(0.474225turn); opacity: 0.1411;"></div>
                            <div class="glass" style="width: 79px; height: 159px; top: 491px; left: 121px; transform: rotate(0.823436turn); opacity: 0.157012;"></div>
                            <div class="glass" style="width: 72px; height: 97px; top: 881px; left: 938px; transform: rotate(0.0411364turn); opacity: 0.0873;"></div>
                            <div class="glass" style="width: 131px; height: 147px; top: 369px; left: 676px; transform: rotate(0.0191542turn); opacity: 0.240712;"></div>
                            `
                            }}
                        >
                        </div>
                    {!!(this.state.modal) &&
                        <ModalUI {...this.state.modal} open={!!(this.state.modal)} ></ModalUI>
                    }
                    <div className="login-wrapper">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 p-0 d-flex justify-content-center">
                            <Card style={{ borderRadius: "15px" }}
                                id="principal-card-login"
                                className="border-0 p-4 form-login-container no-shadow-sm mt-4 mb-5 ">
                                <div className="row">
                                    <div className="col p-sm-0 d-flex align-items-center flex-column justify-content-center">
                                        <div className="col-12 p-rl-sm-0" style={{ height: "fit-content" }}>
                                            <div className="col-12 text-center mt-4 mb-4">
                                                <img alt="l_o_g_o" src={LOGO_LOGIN} height="80px" />
                                                <div className="mb-5 mt-3">
                                                    <h4 className="text-center cursor-pointer">Acceder</h4>
                                                    <h6 className="text-center cursor-pointer mb-4">{this.props.config?.titulo || "..."}</h6>
                                                    <h6 className="text-center cursor-pointer m-0 pt-3"><b>Administración</b></h6>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center flex-wrap mb-5" id="ng-g-access">
                                                <Suspense fallback={<div className="text-info"><br /><br />
                                                    <div className=" spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                                                </div>}>
                                                    <GoogleLogin
                                                        color="filled_black"
                                                        successCallback={this.loginWithGoogle}
                                                        disabled={!!(this.state.loader)} />
                                                </Suspense>
                                            </div>
                                        </div>
                                        {this.state.loader && <>
                                            <div className="container-loader">
                                                <div className="bar-loader"></div>
                                            </div>
                                        </>}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => (
    {
        config: state.user.config
    }
)

const mapDispatchToProps = dispatch => (
    {
        login: data => dispatch(login(data)),
        setUnauthorized: () => dispatch(setUnauthorized(false))
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
