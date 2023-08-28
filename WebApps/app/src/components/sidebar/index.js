import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import Avatar from '../UI/Avatar';
import { Power } from '../UI/Icons';
import { logout, setSidebar } from '../../store/admin/actions/userAction';
import './index.css';
import { connect } from 'react-redux';
import ModalUI from '../ModalUI';

class Sidebar extends Component {

    constructor(props) {
        super();
        this.state = {
            modal: null,
            // isOpen: props.isOpen ?? true,
            menuOptions: props.menuOptions ?? []
        }

        this.closeSession = this.closeSession.bind(this);
    }

    closeSidebar = () => {
        if (window.innerWidth <= 1024) {
            this.props.toggleSidebar(false)
        }
    }

    selectMenuOption = (item) => {

    }

    closeSession = () => {
        this.setState({
            modal: {
                size: "sm",
                title: "",
                children: <h4 className="text-center text-muted">¿Desea cerrar la sesión?</h4>,
                onClosed: (callback) => {
                    !!(callback) ? callback() : this.setState({ modal: null })
                },
                type: "question",
                buttons: [
                    { text: "NO", color: "danger", close: true },
                    {
                        text: "SI", click: () => this.props.logout, color: "primary"
                    }
                ]
            }
        })
    }

    // handleResize = (event) => {
    //     console.log(event);
    // }

    // componentDidMount() {
    //     window.addEventListener('resize', this.handleResize);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.handleResize);
    // }

    render() {
        const config = this.props.config.sidebar ? JSON.parse(this.props.config.sidebar) : {};
        const styleItem = {
            borderLeft: config["item-border-left"] || "5px solid #ff9400",
            color: config["item-color"] || "#000",
            backgroundColor: config["item-background-color"] || "#eee"
        }
        const style = {
            color: config["color"],
            backgroundColor: config["background-color"]
        }
        return (
            <>
                {!!(this.state.modal) && <ModalUI open={!!(this.state.modal)} {...this.state.modal}></ModalUI>}
                <div className={`sidebar-ng ${this.props.className ?? ""} ${this.props.sidebar ? " show" : ""}`} style={style}>
                    <div className="brand">
                        <b>{this.props.user.rolName}</b>
                    </div>
                    <br />
                    <Avatar name={this.props.user.correo} picture={this.props.user.foto} />
                    <div className="menu">
                        {
                            this.state.menuOptions.map((i, k) =>
                                <NavLink activeClassName="active" className="menu-item" key={k} to={i.uri}
                                    style={styleItem}
                                    onClick={this.closeSidebar}>
                                    {i.icon}<span>{i.text}</span>
                                </NavLink>
                            )
                        }
                        {/* <hr/> */}
                        <span className="menu-item" onClick={this.closeSession}>
                            <Power size={17} /><span>Cerrar sesión</span>
                        </span>
                    </div>
                </div>
                <div onClick={this.closeSidebar}></div>
            </>
        );
    }
}

Sidebar.propTypes = {
    // isOpen: PropTypes.bool,
    className: PropTypes.string,
    menuOptions: PropTypes.array,
};

const mapDispatchToProps = dispatch => ({
    toggleSidebar: open => dispatch(setSidebar(open)),
    logout: () => dispatch(logout())
})

const mapStateToProps = state => ({
    sidebar: state.user.sidebar,
    user: state.user.userInfo,
    config: state.user.config
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);