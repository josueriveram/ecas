import { Component, lazy, Suspense } from 'react';
import getWeb3 from './getWeb3';
import lazyLoaderComponents from './services/lazyLoaderComponents';
import LoaderIcon from './component/LoaderIcon';
import logo from './img/uninunezwallet140.png';
import "./bootstrap.min.css";
import "./index.css";

const UserScreen = lazy(() => lazyLoaderComponents(() => import("./screen/User")));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      providerLoaded: null,
    }
  }

  componentDidMount() {
    getWeb3().then((provider) => {
      if (!(provider)) {
        console.log("Install Metamask");
        return this.setState({
          providerLoaded: false
        });
      }
      // else if (!(await provider._metamask.isUnlocked())) {
      //   console.log(provider.isConnected())
      //   // window.ethereum.request({ method: 'eth_requestAccounts' }).then(resp => {
      //   //   return this.setState({
      //   //     providerLoaded: true
      //   //   });
      //   // }).catch(err => {

      //   // })

      // }

      this.setState({
        providerLoaded: true
      });
    }).catch(async (error) => {
      console.log({ error });
      this.setState({
        providerLoaded: false
      });
    });
  }

  render() {
    return (<>
      <Suspense fallback={<div className="fallback-loader"><LoaderIcon /></div>}>
        <nav className="navbar p-0">
          <div className="container">
            <span className="navbar-brand">
              <img src={logo} alt="Wallet Uninúñez" height="110px" />
            </span>
          </div>
        </nav>
        <div className="container">
          <div className="NG-app ">
            <div className="text-center text-muted pt-2 pb-2 ps-2" style={{ borderLeft: "4px solid #ff9400" }}>
              <p>
                Uninúñez Wallet es una Dapp (aplicación descentralizada) que utiliza <b>Smart Contracts</b> desplegados en la red <b>Blockchaim</b> Göerli Tesnet de <b>Etherium</b>, los cuales permiten mantener almacenados de forma segura tus certificaciones y puntos acumulados durante toda tu vida universitaria.
              </p>
              <p>
                Esta Dapp se encuentra en fase experimental y tiene como objetivo llevar a cabo una transformación digital utilizando la tecnología disruptiva Blockchain en la educación.
              </p>
            </div>
            {this.state.providerLoaded !== null ?
              (this.state.providerLoaded === false ?
                <div className="text-center text-muted pt-5">
                  <div role="alert" className=" alert alert-warning mt-5 d-flex align-items-center justify-content-center">
                    <div className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className=" text-warning bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                    <div>
                      Para conservar tu información es necesario que tengas una wallet en <b>Metamask</b>.  <a href="https://metamask.io/download.html" target="_blank">Descarga e instala</a> la extensión para Chrome o si prefieres su app móvil.
                    </div>
                  </div>
                  {/* <div className="mt-4">
                    <small><b><a>Más información</a></b></small>
                  </div> */}
                </div>
                : <UserScreen />) : <div className="text-center mt-5"><LoaderIcon /></div>
            }
          </div>
        </div>
        <div className="footer p-2 text-muted">
          <img src="https://axis.curn.edu.co/images/logo.png" alt="" height="60px" className="mb-2" />
          <p className="mb-1 text-center small">Reconocimiento personería jurídica: Resolución 6644 del 5 de junio de 1985 Mineducación</p>
          <p className="mb-0 text-center small">Institución de Educación Superior sujeta a inspección y vigilancia por parte del Ministerio de Educación Nacional</p>
        </div>
      </Suspense>
    </>);
  }


}

export default App;
