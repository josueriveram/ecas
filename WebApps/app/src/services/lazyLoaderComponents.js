/**
 * Function to try load 'split' react components
 * @param {function} lazyComponent function that load a lazy component 
 * @param {number} attemptsLeft default 2. Attemps number to try load component
 */
const lazyLoaderComponents = (lazyComponent, attemptsLeft = 2) => {
    return new Promise((resolve, reject) => {
        lazyComponent()
            .then(resolve)
            .catch((error) => {
                //When a chunck failed, then try load again after 1.5s
                setTimeout(() => {
                    if (attemptsLeft === 1 || !window.navigator?.onLine === false) {
                        reject(error);
                        return;
                    }
                    lazyLoaderComponents(lazyComponent, attemptsLeft - 1).then(resolve, reject);
                }, 1500)
            })
    })
}

export default lazyLoaderComponents;