import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import "./bootstrap.min.css";
import './index.css';
import ErrorHandler from './components/ErrorHandler';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';
import lazyLoaderComponents from './services/lazyLoaderComponents';
import FallbackLoader from './components/UI/FallbackLoader';
import { AXIOS_REQUEST } from './services/axiosService';

const UsersRootScreens = lazy(() => lazyLoaderComponents(() => import('./screens/user')));
const AdminRootScreens = lazy(() => lazyLoaderComponents(() => import('./screens/admin')));

console.log("%cADVERTENCIA: \nEsta es una función del navegador destinada a desarrolladores. \nSi intenta hacer algo aquí para habilitar alguna función o \"piratear\" caracteristicas del sitio, podrías perder el acceso al mismo."
  , "color:red;font-size:20px;background-color: yellow;font-weight: bold;");

{
  !!(window._NGconfig.maintenance_url) && AXIOS_REQUEST(null, 'get', null, false, window._NGconfig.maintenance_url)
    .then(resp => {
      if (!!(resp) && typeof resp === 'string') {
        window.location = resp;
      }
    }).catch(() => { })
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <ErrorHandler>
    <Router>
      <Suspense fallback={<FallbackLoader text="Cargando" style={{ "position": "fixed" }} />}>
        <Switch>
          <Route path="/admin">
            <AdminRootScreens />
          </Route>
          <Route path="/">
            <UsersRootScreens />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  </ErrorHandler>
  // </React.StrictMode>
);

