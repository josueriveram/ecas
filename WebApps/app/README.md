# ECAS APP PROJECT

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## 1. Packages instalation
Open wallet project and execute the comand:

```JS
npm install
```

## 2. Configuration
Into root of ecas app project, go to the file <b>public/_config.js</b> and set the configuration needed:

```JS
{
    api_base_url: 'https://[API_URL]/api',
    error_reporting_url: "[ERROR_REPORTING_API_URL]",
    ldap_search_user: '[LDAP_API_URL]',
    google_client_id: '[GOOGLE_CLIENT_ID].apps.googleusercontent.com',
    logo_login: '/logologin.svg',
    app_url: 'https://[PIBLIC_APP_URL]', //App public link
    maintenance_url: "[API_MAINTENANCE_URL_REQUEST]", //OPTIONAL TO VERIFY IF APP IS IN MAINTENANCE
    wallet_url: 'https://[WALLET_APP_URL]', //OPTIONAL FOR WALLET
}
```

## 3. Compilation
To generate a production build, execute the next comand:

```JS
npm run build
```
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
