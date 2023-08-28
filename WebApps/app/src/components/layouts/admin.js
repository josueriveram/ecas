import React from 'react';
import NavBar from '../NavBar';
import Sidebar from '../sidebar';
import Footer from './../Footer';

import './admin.css';

const AdminLayout = (props) => {

    return (
        <div className="admin-layout">
            <div className="admin-sidebar">
                <Sidebar menuOptions={props.sidebarMenu} />
            </div>
            <div className="admin-content">
                <div >
                    <div className="admin-header">
                        <NavBar />
                    </div>
                    <div className="admin-body container pt-5">
                        {props.children}
                    </div>
                </div>
                <div className="admin-footer">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
// import React from 'react';
// import NavBar from '../NavBar';
// import Sidebar from '../sidebar';
// import Footer from './../Footer';

// import './admin.css';

// const AdminLayout = (props) => {

//     return (
//         <>
//             <div className="admin-layout">
//                 <div className="admin-sidebar">
//                     <Sidebar menuOptions={props.sidebarMenu} />
//                 </div>
//                 <div className="admin-content">
//                     <div className="admin-header">
//                         <NavBar />
//                     </div>
//                     <div className="admin-body container pt-5">
//                         {props.children}
//                     </div>
//                     <div className="admin-footer">
//                         <Footer />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminLayout;