import detectEthereumProvider from '@metamask/detect-provider';

const getWeb3 = () => {
    return detectEthereumProvider();
   /* return new Promise( (resolve, reject) => {
        window.addEventListener('load', async function() {
            
            const provider = await detectEthereumProvider();

            if (provider) {
            resolve(provider);
            } else {
            console.log('Please install MetaMask!');
            reject();
            }
            
            
        });
    });*/
};

export default getWeb3;