import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { login, setUnauthorized } from './../../../store/user/actions/userAction';
import ModalUI from '../../../components/ModalUI';

// Test create file 
import lazyLoaderComponents from '../../../services/lazyLoaderComponents';
import Card from 'reactstrap/lib/Card';
import './styles.css';
import OtherUsers from './OtherUsers';
import { LOGO_LOGIN } from '../../../services/constants';

const GoogleLogin = lazy(() => lazyLoaderComponents(() => import('../../../components/GoogleLogin')));

class LoginScreen extends Component {

    constructor(props) {
        super();

        this.state = {
            userEmail: "",
            loginType: 0,
            loader: null,
            modal: null,
            error: null
        }
    }

    startLogin = (gObject, revokeCallback) => {
        let data = { correo: this.state.userEmail, onetoken: gObject.credential }
        // if (!!(localStorage.getItem("aulas/gtaccess"))) { data.token = localStorage.getItem("aulas/gtaccess") }
        this.props.login({ data, persona: gObject.profileObj })
            .then(resp => {
                if (!(resp)) {
                    throw new Error();
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
            this.setState({
                loader: true,
                userEmail: gObject.profileObj.email,
                error: null
            })
            this.startLogin(gObject, revokeCallback)
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
                        // alert: "No puedes iniciar sesión",
                        onClosed: () => this.setState({ modal: null }),
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
            <div className="bg-light-gray login-screen h-100">
                <div className="bg-login"></div>
                {!!(this.state.modal) &&
                    <ModalUI {...this.state.modal} open={!!(this.state.modal)} onClosed={() => this.setState({ modal: null })} ></ModalUI>
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
                                                <h6 className="text-center cursor-pointer m-0">{this.props.config?.titulo || "..."}</h6>
                                            </div>
                                        </div>
                                        {this.state.loginType === 0 ?
                                            <>
                                                <div className="d-flex justify-content-center flex-wrap mb-5" id="ng-g-access">
                                                    <Suspense fallback={<div className="text-info"><br /><br />
                                                        <div className=" spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                                                    </div>}>
                                                        <GoogleLogin
                                                            successCallback={this.loginWithGoogle}
                                                            disabled={!!(this.state.loader)} />
                                                    </Suspense>
                                                </div>
                                                {/* <div className='text-center'>
                                                    <p><button className='btn btn-small btn-outline-dark rounded-pill pt-1 pb-1' onClick={() => this.setState({ loginType: 1 })}><small>¿No tienes cuenta?</small></button></p>
                                                </div> */}
                                            </>
                                            :
                                            <OtherUsers
                                                cancel={() => { this.setState({ loginType: 0 }) }}
                                                submit={() => { }}
                                                toggleLoader={(loader = !this.state.loader) => { this.setState({ loader: this.setState({ loader }) }) }}
                                                disabled={this.state.loader}
                                            />
                                        }
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