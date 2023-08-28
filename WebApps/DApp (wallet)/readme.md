# WALLET PROJECT

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1. Packages instalation
Open wallet project and execute the comand:

```JS
npm install
```

## 2. Configuration

Into root of wallet project, go to the file <b>truffle-config.js</b> and find the line:
```JS
...

goerli:{
    provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/[API_KEY]"),
    network_id:5
}

...
```

Then, you have to replace API_KEY to your own api key generated in Infura


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
