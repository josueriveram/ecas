import React from 'react';
import HeaderNG from '../HeaderNG';
import Footer from './../Footer';

const UserLayout = ({ children, showEmptyHead }) => {
    return (<>
        <HeaderNG showEmptyHead={showEmptyHead} />
        <main className="main-content container pt-md-3">
            <div className="user-layout">
                <div className="user-content">
                    {children}
                </div>
            </div>
        </main>
        <Footer />
    </>
    );
};

export default UserLayout;