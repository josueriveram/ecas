import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import { GOOGLE_CLIENT_ID } from './../../services/constants';
import './index.css';

class GoogleLogin extends Component {

    constructor(props) {
        super();

        this.state = {
            type: props.type || [''],
            loading: <>Cargando<Spinner size="sm" className="ml-3" /></>
        }
    }

    componentDidMount() {
        if(GOOGLE_CLIENT_ID){
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true;
            script.onload = this.initializeGsi;
            document.querySelector('body').appendChild(script);
        }
    }

    initializeGsi = (e) => {
        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: this.responseGoogle,
                cancel_on_tap_outside: true,
            });

            this.showOneTapPrompt()
            this.showGLoginBtn()
        } catch (error) {
            console.log({ error })
        }
    }

    showOneTapPrompt = () => {
        // //Show One tap
        window.google.accounts.id.prompt(notification => {
            // console.log(notification)
            // if (notification.isNotDisplayed()) {
            //     console.log(notification.getNotDisplayedReason())
            // } else if (notification.isSkippedMoment()) {
            //     console.log(notification.getSkippedReason())
            // } else if (notification.isDismissedMoment()) {
            //     console.log(notification.getDismissedReason())
            // }
        });
    }

    showGLoginBtn = () => {
        //Show button login
        window.google.accounts.id.renderButton(document.getElementById("NG_GLOGIN_BTN"), {
            type: "standard", //OR icon
            theme: this.props.color || 'filled_black', //or Outline/filled_blue
            size: 'large',
            width: window.innerWidth <= 500 ? 300 : null,
            shape: "pill", //Or rectangular
        });
    }

    onSuccess = (data) => {
        this.props.successCallback(data, (userId = data.profileObj.sub) => window.google.accounts.id.revoke(userId, done => { }));
    }

    onFailure = (data) => {
        // console.log(data)
    }

    responseGoogle = (data) => {
        if (!!(data?.credential)) {
            //Get information from credential token
            fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${data.credential}`)
                .then((resp) => {
                    if (!!(resp)) {
                        return resp.json();
                    }
                    else {
                        throw new Error('Hubo un error, intenta nuevamente');
                    }
                })
                .then((response) => {
                    this.onSuccess({ ...data, profileObj: response })
                })
                .catch((error) => {
                    this.onFailure(error.message || error)
                    this.showOneTapPrompt()
                });
        } else {
            this.onFailure('Hubo un error, intenta nuevamente')
            this.showOneTapPrompt()
        }
    }

    render() {
        if(!GOOGLE_CLIENT_ID) return null
        return <div id="NG_GLOGIN_BTN" ><Spinner /> </div>
    }
}

GoogleLogin.propTypes = {
    color: PropTypes.string, 
    successCallback: PropTypes.func,
    disabled: PropTypes.bool,
};


export default GoogleLogin;
