import React, { Component, lazy, Suspense } from 'react';
import { connect, Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Route, Switch
} from 'react-router-dom';
import { UncontrolledAlert } from 'reactstrap';
import UserLayout from '../../components/layouts/User';
import FallbackLoader from '../../components/UI/FallbackLoader';
import { Loader2 } from '../../components/UI/Loader';
import { getParameterByName } from '../../services/constants';
import lazyLoaderComponents from "../../services/lazyLoaderComponents";
import { setShowAllActivities } from '../../store/user/actions/activitiesAction';
import userStore from './../../store/user';

const loadComponent = (comp) => lazy(() => lazyLoaderComponents(() => import(`./${comp}`)));
const routes = [
    { path: "/inicio/:idactividad", Component: loadComponent("ActivityDetails/MyActivity"), exact: true },
    { path: "/inicio", Component: loadComponent("HomeScreen"), exact: true },
    { path: "/historial/:idactividad", Component: loadComponent("ActivityDetails/ActivityHistory"), exact: true },
    { path: "/historial", Component: loadComponent("HistoryScreen") },
    { path: "/inscripcion/:idactividad", Component: loadComponent("ActivityDetails/ActivityOffer"), exact: true },
    { path: "/inscripcion", Component: loadComponent("InscriptionsScreen"), exact: true },
    { path: "/puntos", Component: loadComponent("ScoreScreen"), exact: true },
    { path: "/asistencia/:idactividad", Component: loadComponent("AsistanceScreen"), exact: true },
    { path: "/horas", Component: loadComponent("HoursHistoryScreen"), exact: true }
]
const LoginScreen = loadComponent("LoginScreen");

class RootScreens extends Component {

    constructor(props) {
        super(props);
        let bo = getParameterByName("bienestar_only") === "true";
        if (bo) {
            props.setShowAllActivities(!bo)
        }
    }

    render() {
        window.document.title = this.props.config.titulo;
        return (
            <Router>
                {(!(this.props.user)) ?
                    <Suspense fallback={<FallbackLoader text="Cargando" style={{ "position": "fixed" }} />}>
                        {this.props.unauthorized &&
                            <div style={{ position: 'absolute', top: "20px" }} className="w-100 d-flex justify-content-center">
                                <UncontrolledAlert color="warning" className="shadow">
                                    Su sesión ha expirado
                                </UncontrolledAlert>
                            </div>
                        }
                        <Switch>
                            {/* <Route exact path="/login"><LoginScreen /></Route> */}
                            <Route path="*">
                                {/* <Redirect exact to="/login" /> */}
                                <LoginScreen />
                            </Route>
                        </Switch>
                    </Suspense>
                    :
                    <UserLayout>
                        <Suspense fallback={<Loader2 color="warning" open={true}></Loader2>}>
                            <Switch>
                                {routes.map(({ Component, ...rprops }, ri) =>
                                    <Route key={ri} {...rprops} component={(props) => <Component  {...props} />} />
                                )}
                                <Route path="*">
                                    <Redirect exact to="/inicio" />
                                </Route>
                            </Switch>
                        </Suspense>
                    </UserLayout>
                }
            </Router >
        );
    }
}

const mapStateToProps = state => ({
    unauthorized: state.user.unauthorized,
    user: state.user.userInfo,
    config: state.user.config,
})

const mapDispatchToProps = dispatch => ({
    setShowAllActivities: (bool) => dispatch(setShowAllActivities(bool))
})

let Rs = connect(mapStateToProps, mapDispatchToProps)(RootScreens);

export default () => <Provider store={userStore}><Rs /></Provider>
// import React, { Component, lazy, Suspense } from 'react';
// import { connect, Provider } from 'react-redux';
// import {
//     HashRouter as Router,
//     Redirect,
//     Route, Switch
// } from 'react-router-dom';
// import { UncontrolledAlert } from 'reactstrap';
// import UserLayout from '../../components/layouts/User';
// import FallbackLoader from '../../components/UI/FallbackLoader';
// import { Loader2 } from '../../components/UI/Loader';
// import lazyLoaderComponents from "../../services/lazyLoaderComponents";
// import userStore from './../../store/user';

// const LoginScreen = lazy(() => lazyLoaderComponents(() => import('./LoginScreen')))
// const Home = lazy(() => lazyLoaderComponents(() => import('./HomeScreen')))
// const Inscriptions = lazy(() => lazyLoaderComponents(() => import('./InscriptionsScreen')))
// const History = lazy(() => lazyLoaderComponents(() => import('./HistoryScreen')));
// const ActivityDetails = lazy(() => lazyLoaderComponents(() => import('./ActivityDetails/MyActivity')))
// const ActivityOfferDetails = lazy(() => lazyLoaderComponents(() => import('./ActivityDetails/ActivityOffer')))
// const ActivityHistoryDetails = lazy(() => lazyLoaderComponents(() => import('./ActivityDetails/ActivityHistory')))
// const ScoreScreen = lazy(() => lazyLoaderComponents(() => import('./ScoreScreen')))
// const HoursHistoryScreen = lazy(() => lazyLoaderComponents(() => import('./HoursHistoryScreen')))

// class RootScreens extends Component {
//     render() {
//         return (
//             <Router>
//                 {(!(this.props.user)) ?
//                     <Suspense fallback={<FallbackLoader text="Cargando" style={{ "position": "fixed" }} />}>
//                         {this.props.unauthorized &&
//                             <div style={{ position: 'absolute', top: "20px" }} className="w-100 d-flex justify-content-center">
//                                 <UncontrolledAlert color="warning" className="shadow">
//                                     Su sesión ha expirado
//                                 </UncontrolledAlert>
//                             </div>
//                         }
//                         <Switch>
//                             <Route exact path="/login"><LoginScreen /></Route>
//                             <Route path="*">
//                                 <Redirect exact to="/login" />
//                             </Route>
//                         </Switch>
//                     </Suspense>
//                     :
//                     <UserLayout>
//                         <Suspense fallback={<Loader2 color="warning" open={true}></Loader2>}>
//                             <Switch>
//                                 <Route exact path="/inicio/:idactividad" component={(props) => <ActivityDetails {...props} />} />
//                                 <Route exact path="/inicio" component={(props) => <Home  {...props} />} />
//                                 <Route exact path="/historial" component={(props) => <History  {...props} />}/>
//                                 <Route exact path="/historial/:idactividad" component={(props) => <ActivityHistoryDetails  {...props} />}/>
//                                 <Route exact path="/inscripcion/:idactividad" component={(props) => <ActivityOfferDetails {...props} />} />
//                                 <Route exact path="/inscripcion" component={(props) => <Inscriptions  {...props} />} />
//                                 <Route exact path="/puntos" component={(props) => <ScoreScreen  {...props} />} />
//                                 <Route exact path="/horas" component={(props) => <HoursHistoryScreen  {...props} />} />
//                                 <Route path="*">
//                                     <Redirect exact to="/inicio" />
//                                 </Route>
//                             </Switch>
//                         </Suspense>
//                     </UserLayout>
//                 }
//             </Router >
//         );
//     }
// }

// const mapStateToProps = state => ({
//     unauthorized: state.user.unauthorized,
//     user: state.user.userInfo
// })

// let Rs = connect(mapStateToProps)(RootScreens);

// export default () => <Provider store={userStore}><Rs /></Provider>