import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from './../../store/user/actions/userAction';
import ModalUI from '../ModalUI';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar } from 'reactstrap';

import './styles.css';
import { PersonIcon, Power } from '../UI/Icons';
import Menu from '../Menu';
import { Loader2 } from '../UI/Loader';

const HeaderNG = ({ showEmptyHead = false, height = "60px", ...props }) => {

    const [modal, setModal] = useState(false);
    const [fullHeader, setFullHeader] = useState(false);

    const nombreUsuario = `${props.user.nombre} ${props.user.apellido}`;
    // const emailUsuario = `${props.user.correo?.split("@")[0] || ""}`;
    const emailUsuario = props.user.correo;
    // const iniciales = `${props.user.nombre[0]}${props.user.apellido[0]}`;
    const foto = props.user.foto;

    const startLogout = () => setModal(!modal)

    useEffect(() => {
        if (window.self !== window.top) {
            //Into iframe
            function handleResize(e) {
                console.log("resize");
                // let contentH = window.innerHeight;
                // let screenAvalaibleH = window.screen.availHeight;
                // let screenH = window.screen.height;
                // let windowH = window.outerHeight;

                // let gap = screenAvalaibleH - windowH;

                // // setHeight({ contentH, windowH, screenAvalaibleH, screenH, gap })
                // // console.log(height)
                // // console.log(document.body.offsetHeight)
                // // console.log(window.self !== window.top)
                // // console.log(window.top)
                // // if (contentH + gap === availHeight) {
                // //     //Iframe ocupate total height screen
                // // }
                // fullHeader === true && setFullHeader(false)
            }

            setFullHeader(false);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize)
            }
        } else {
            setFullHeader(true);
        }
    }, []);

    if (fullHeader === false && !showEmptyHead) {
        return <>
            <Navbar dark expand="sm" className="bg-warning mb-5" style={
                {
                    height,
                    ...props.config.header ? (
                        {
                            "backgroundImage": JSON.parse(props.config.header)["background-image"],
                            "backgroundColor": JSON.parse(props.config.header)["background-color"]
                        }
                    ) : {}
                }
            }>
                <div className="container text-center pt-2 pb-2 font-weight-bold"
                    style={
                        props.config.header ? ({ color: JSON.parse(props.config.header)["color"] }) : {}
                    }
                >
                    <span className="w-100 text-center">{props.config?.titulo || "..."}</span>
                </div>
            </Navbar>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="row">
                            <Menu customActiveClass="warning" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    return (
        <div className="header-ng">
            <div className="bg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" preserveAspectRatio="none">
                    <foreignObject className="logoBack" x="0" y="0" width="1200px" height="350px">
                        <div className="logoGradient" style={
                            props.config.header ? (
                                {
                                    "backgroundImage": JSON.parse(props.config.header)["background-image"],
                                    "backgroundColor": JSON.parse(props.config.header)["background-color"]
                                }
                            ) : {}
                        }
                            xmlns="http://www.w3.org/1999/xhtml"></div>
                    </foreignObject>
                    <g className="logoBlend">
                        <rect x="0" y="0" width="1200px" height="350px" />
                        <path d="M0 0 L1200 0 L1200 60 L200 300 C 200 300 140 320 100 270 L 0 150 Z" />
                    </g>
                </svg>
            </div>

            {!!(modal) &&
                <ModalUI
                    open={true}
                    type={"question"}
                    size={"sm"}
                    onClosed={(callback) => {
                        if (!!(callback)) {
                            callback();
                        } else {
                            setModal(false);
                        }
                    }}
                    buttons={[
                        { text: "NO", color: "danger", close: true },
                        {
                            text: "SI", click: () => props.logout, color: "primary"
                        }
                    ]}
                >
                    <h4 className="text-center text-muted">¿Desea cerrar la sesión?</h4>
                </ModalUI>
            }

            <div className="content pt-4">
                <div>
                    <div className="container" style={
                        props.config.header ? ({ color: JSON.parse(props.config.header)["color"] }) : {}
                    }>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between" >
                                <div className="d-inline-block" style={{ height: "60px" }}>
                                    {!(props.config.logo) ?
                                        <div className="h-100 d-flex align-items-center"><Loader2 open></Loader2></div>
                                        :
                                        <img src={props.config.logo} className="mr-3 h-100" alt="l_o_g_o" style={{ marginLeft: "-13px" }} />
                                    }
                                </div>
                                <div className="d-inline-block ml-auto">
                                    {/* <p className="mt-1">
                                        <small className="d-block">Puntos</small>
                                        <b>12300</b>
                                    </p> */}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h1 className="mb-4">
                                    <b className=" pt-2 d-block">{props.config?.titulo || "..."}</b>
                                </h1>
                                {!showEmptyHead && <>
                                    <UncontrolledDropdown className="username-avatar pt-2">
                                        <DropdownToggle tag="div">
                                            <span className="shadow-sm btn btn-light text-muted p-1 border rounded-pill p-0 text-truncate max-width-100">
                                                <img className="rounded-circle" height="35px" src={foto} alt="user profile" />
                                                <b className="pt-3 pb-3 pr-3 pl-2" style={{ fontSize: "13.5px" }}>{nombreUsuario}</b>
                                            </span>
                                        </DropdownToggle>
                                        <DropdownMenu className="light-shadow border">
                                            <DropdownItem className="text-muted text-center font-weight-bold" header>
                                                {emailUsuario}
                                                <hr style={{ marginBottom: "0" }} />
                                            </DropdownItem>
                                            <DropdownItem href="" onClick={startLogout}>
                                                <Power size={19} /> Cerrar Sesión
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <p className="mt-3 ml-1 text-truncate max-width-100">
                                        <PersonIcon size={19} /> {emailUsuario}
                                    </p>
                                    <p className="mt-3  ml-1">
                                        <button className="btn btn-link p-0" style={{ color: "inherit" }} onClick={() => startLogout()}>
                                            <Power size={19} /> Cerrar Sesión
                                        </button>
                                    </p>
                                </>}
                            </div>
                            {!showEmptyHead && <div className="col-12 col-md-5 ml-auto pt-4 mt-5 pt-md-0 my-md-auto">
                                <Menu likeListMd />
                            </div>}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const mapStateToProps = state => ({
    user: state.user.userInfo,
    config: state.user.config,
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNG);