import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArchiveIcon, HomeIcon, JournalCheckIcon } from "./../UI/Icons";
import './index.css';
function Menu({ likeListMd, customActiveClass }) {
    const navLinksClass = `border-0 card text-center pt-4 pb-4${likeListMd ? " d-md-block d-lg-flex" : ""}`;
    const wrapperLinkClass = `col ${likeListMd ? "col-md-12" : ""} col-lg-4 pb-2 pt-1 pr-1 pl-1 pr-sm-2 pl-sm-2`;
    return (
        <div className="menu-list-options text-warning col">
            <div className="row">
                <div className={wrapperLinkClass}>
                    <NavLink to="/inicio" className={navLinksClass} activeClassName={`active ${customActiveClass || ""}`}>
                        <span className="m-2">
                            <HomeIcon size={30} />
                        </span>
                        <span>Inicio</span>
                    </NavLink>
                </div>
                <div className={wrapperLinkClass}>
                    <NavLink to="/inscripcion" className={navLinksClass} activeClassName={`active ${customActiveClass || ""}`}>
                        <span className="m-2">
                            <JournalCheckIcon size={30} />
                        </span>
                        <span>Inscripción</span>
                    </NavLink>
                </div>
                <div className={wrapperLinkClass}>
                    <NavLink to="/historial" className={navLinksClass} activeClassName={`active ${customActiveClass || ""}`}>
                        <span className="m-2">
                            <ArchiveIcon size={30} />
                        </span>
                        <span>Histórico</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Menu;