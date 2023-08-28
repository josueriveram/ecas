import React, { useEffect, useState } from "react";

export const Link = ({ className, href, children }) => {
    const onClick = (event) => {
        // if ctrl or meta key are held on click, allow default behavior of opening link in new tab
        if (event.metaKey || event.ctrlKey) {return;}
        // prevent full page reload
        event.preventDefault();
        // update url
        window.history.pushState({}, "", href);

        // communicate to Routes that URL has changed
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };
    return (<a className={className} href={href} onClick={onClick}>{children}</a>);
};

export const Route = ({ path, children }) => {
    // state to track URL and force component to re-render on change
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        // define callback as separate function so it can be removed later with cleanup function
        const onLocationChange = () => {
            // update path state to current window URL
            setCurrentPath(window.location.pathname);
        }

        // listen for popstate event
        window.addEventListener('popstate', onLocationChange);

        // clean up event listener
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        };
    }, [])

    return currentPath === path ? children : null;
}
