import React, { Component, lazy, Suspense } from 'react';
import { connect, Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Route, Switch
} from 'react-router-dom';
import { UncontrolledAlert } from 'reactstrap';
import AdminLayout from '../../components/layouts/admin';
import FallbackLoader from '../../components/UI/FallbackLoader';
import lazyLoaderComponents from "../../services/lazyLoaderComponents";
import adminStore from './../../store/admin';
import { Loader2 } from '../../components/UI/Loader';
import { Grid, JournalAlbum, Kanban, PersonBoundingBox, PersonGroup, PersonPlus, Receipt } from '../../components/UI/Icons';

const links = [
    { text: "Inicio", icon: <Grid size={17} />, uri: "/inicio" },
    { text: "Gestión de participantes", icon: <PersonBoundingBox size={17} />, uri: "/gestion-participante" },
    { text: "Gestión de actividades", icon: <JournalAlbum size={17} />, uri: "/gestion-actividades" },
    { text: "Gestión de instructores", icon: <PersonGroup size={17} />, uri: "/gestion-instructores" },
    { text: "Registro de externos", icon: <PersonPlus size={17} />, uri: "/registro-externos" },
    { text: "Historicos", icon: <Receipt size={17} />, uri: "/historicos" },
    { text: "Seguimiento", icon: <Kanban size={17} />, uri: "/seguimiento" }
];

const routes = [
    { path: "/inicio", Component: lazy(() => lazyLoaderComponents(() => import("./HomeScreen"))), exact: true },
    { path: "/gestion-actividades/nuevo", Component: lazy(() => lazyLoaderComponents(() => import("./ActivitiesManagement/New"))), exact: true },
    { path: "/gestion-actividades/:idactividad", Component: lazy(() => lazyLoaderComponents(() => import("./ActivitiesManagement/UpdateActivity"))), exact: true },
    { path: "/gestion-actividades", Component: lazy(() => lazyLoaderComponents(() => import("./ActivitiesManagement"))), exact: true },
    { path: "/registro-externos", Component: lazy(() => lazyLoaderComponents(() => import("./ExternalSignUp"))), exact: true },
    { path: "/gestion-instructores/historico/:period/:idinstructor", Component: lazy(() => lazyLoaderComponents(() => import("./History/ActivitiesList"))), exact: true },
    { path: "/gestion-instructores/:idinstructor", Component: lazy(() => lazyLoaderComponents(() => import("./InstructorManagement/Details"))), exact: true },
    { path: "/gestion-instructores", Component: lazy(() => lazyLoaderComponents(() => import("./InstructorManagement"))), exact: true },
    { path: "/historicos/actividad/:idactividad", Component: lazy(() => lazyLoaderComponents(() => import("./ActivitiesManagement/UpdateActivity"))), exact: true },
    { path: "/historicos/1998-2010", Component: lazy(() => lazyLoaderComponents(() => import("./History/Old1998_2010"))), exact: true },
    { path: "/historicos/2010-2020", Component: lazy(() => lazyLoaderComponents(() => import("./History/Old2010_2020"))), exact: true },
    { path: "/historicos/:period", Component: lazy(() => lazyLoaderComponents(() => import("./History/ActivitiesList"))), exact: true },
    { path: "/historicos", Component: lazy(() => lazyLoaderComponents(() => import("./History"))), exact: true },
    { path: "/seguimiento", Component: lazy(() => lazyLoaderComponents(() => import("./Tracking"))), exact: true },
    { path: "/seguimiento/detalles/:dni_docente", Component: lazy(() => lazyLoaderComponents(() => import("./Tracking/Details"))), exact: true },
    { path: "/gestion-participante/actividades/:period/:dni", Component: lazy(() => lazyLoaderComponents(() => import("./ParticipantManagement/ActivitiesList"))), exact: true },
    { path: "/gestion-participante/:dni", Component: lazy(() => lazyLoaderComponents(() => import("./ParticipantManagement/Details"))), exact: true },
    { path: "/gestion-participante", Component: lazy(() => lazyLoaderComponents(() => import("./ParticipantManagement"))), exact: true },
]

const LoginScreen = lazy(() => lazyLoaderComponents(() => import("./LoginScreen")));
const InstructorScreens = lazy(() => lazyLoaderComponents(() => import("./../instructor")));

class RootScreens extends Component {

    loadRoutesByUserRole = (role) => {
        if (role === "1") {
            return <AdminLayout sidebarMenu={links}>
                <Suspense fallback={<Loader2 color="warning" open={true}></Loader2>}>
                    <Switch>
                        {routes.map(({ Component, ...rprops }, i) =>
                            <Route key={i} {...rprops} component={(props) => <Component  {...props} />} />
                        )}
                        <Route path="*">
                            <Redirect exact to="/inicio" />
                        </Route>
                    </Switch>
                </Suspense>
            </AdminLayout>;
        } else if (role === "2") {
            return <AdminLayout sidebarMenu={links}>
                <Suspense fallback={<Loader2 color="warning" open={true}></Loader2>}>
                    <Switch>
                        {routes.map(({ Component, ...rprops }, i) =>
                            <Route key={i} {...rprops} component={(props) => <Component  {...props} />} />
                        )}
                        <Route path="*">
                            <Redirect exact to="/inicio" />
                        </Route>
                    </Switch>
                </Suspense>
            </AdminLayout>
        } else {
            return <InstructorScreens />
        }
    }

    render() {
        window.document.title = this.props.config.titulo;

        return (
            <Router basename="/admin">
                {!(this.props.user) ?
                    <Suspense fallback={<FallbackLoader text="Cargando" style={{ "position": "fixed" }} />}>
                        {this.props.unauthorized &&
                            <div style={{ position: 'absolute', top: "20px" }} className="w-100 d-flex justify-content-center">
                                <UncontrolledAlert color="warning" className="shadow">
                                    Su sesión ha expirado
                                </UncontrolledAlert>
                            </div>
                        }
                        <Switch>
                            <Route exact path="/login"><LoginScreen /></Route>
                            <Route path="*">
                                <Redirect exact to="/login" />
                            </Route>
                        </Switch>
                    </Suspense>
                    :
                    this.loadRoutesByUserRole(this.props.user.role)
                }
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    unauthorized: state.user.unauthorized,
    user: state.user.userInfo,
    config: state.user.config
})

let Rs = connect(mapStateToProps)(RootScreens);

export default (p) => <Provider store={adminStore}><Rs {...p} /></Provider>