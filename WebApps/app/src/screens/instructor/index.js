import React, { Component, lazy, Suspense } from 'react';
import {
    Redirect,
    Route, Switch
} from 'react-router-dom';
import AdminLayout from '../../components/layouts/admin';
import lazyLoaderComponents from "../../services/lazyLoaderComponents";
import { Loader2 } from '../../components/UI/Loader';
import { Award, ClockIcon, Grid, JournalAlbum } from '../../components/UI/Icons';

const links = [
    { text: "Inicio", icon: <Grid size={17} />, uri: "/inicio" },
    { text: "Asistencias", icon: <JournalAlbum size={17} />, uri: "/actividades" },
    { text: "Aprobaciones", icon: <Award size={17} />, uri: "/aprobaciones" },
    { text: "Historial", icon: <ClockIcon size={17} />, uri: "/historial" },
];

const routes = [
    { path: "/inicio", Component: lazy(() => lazyLoaderComponents(() => import("./HomeScreen"))), exact: true },
    { path: "/actividades/:idactividad", Component: lazy(() => lazyLoaderComponents(() => import("./../admin/ActivityDetails/MyActivity"))), exact: true },
    { path: "/actividades", Component: lazy(() => lazyLoaderComponents(() => import("./ActivitiesScreen"))), exact: true },
    { path: "/aprobaciones/:idactividad", Component: lazy(() => lazyLoaderComponents(() => import("./../admin/ActivityDetails/Approbations"))), exact: true },
    { path: "/aprobaciones", Component: lazy(() => lazyLoaderComponents(() => import("./ApprobationsScreen"))), exact: true },
    { path: "/historial/:idactividad", Component: lazy(() => lazyLoaderComponents(() => import("./../admin/ActivityDetails/History"))), exact: true },
    { path: "/historial", Component: lazy(() => lazyLoaderComponents(() => import("./HistoryScreen"))), exact: true },
]

class RootScreens extends Component {
    render() {
        return (
            <AdminLayout sidebarMenu={links}>
                <Suspense fallback={<Loader2 color="warning" open={true}></Loader2>}>
                    <Switch>
                        {routes.map(({ Component, ...rprops }, i) => {
                            return <Route key={i} {...rprops} component={(props) => <Component  {...props} />} />;
                        })}
                        <Route path="*">
                            <Redirect exact to="/inicio" />
                        </Route>
                    </Switch>
                </Suspense>
            </AdminLayout>
        );
    }
}

export default RootScreens