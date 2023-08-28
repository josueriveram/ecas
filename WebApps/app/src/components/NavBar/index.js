import React from 'react';
import { connect } from 'react-redux';
import { Navbar } from 'reactstrap';
import { setSidebar } from '../../store/admin/actions/userAction';
import { List, XCloseIcon } from '../UI/Icons';
import { Loader2 } from '../UI/Loader';
import './index.css';

function NavBar(props) {

    const config = props.config.header ? JSON.parse(props.config.header) : {}

    return (
        <Navbar dark expand="sm" className="bg-warning custom-nav h-100" style={
            props.config.header ? (
                {
                    "backgroundImage": config["background-image"],
                    "color": config["color"],
                    "backgroundColor": config["background-color"]
                }
            ) : {}
        }>
            <div className="container text-center pt-2 pb-2 font-weight-bold">
                <div className="pl-3 pl-sm-0"><span className="text-center">{props.config.titulo || <Loader2 open />}</span></div>
                <div className="pr-3 pr-sm-0 toggler-sidebar" onClick={() => props.toggleSidebar(!(props.sidebar))}>
                    {props.sidebar ? <XCloseIcon size={30} /> : <List size={30} />}
                </div>
            </div>
        </Navbar>
    );
}
const mapDispatchToProps = dispatch => ({
    toggleSidebar: open => dispatch(setSidebar(open))
})

const mapStateToProps = state => ({
    sidebar: state.user.sidebar,
    config: state.user.config
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);