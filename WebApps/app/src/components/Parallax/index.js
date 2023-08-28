// export default function Parallax() {

//     useEffect(() => {
//         window.addEventListener("scroll", function () {
//             const parallax = document.querySelector(".parallax")
//             let scrollPosition = window.pageYOffset

//             parallax.style.transform = `translateY(${scrollPosition * 0.5}px)`
//         })
//     }, []);

//     return (
//         <div className="App">
//             <section className="hero">
//                 <img
//                     src="https://picsum.photos/800/600"
//                     alt="test"
//                     className="parallax"
//                     style={{
//                         transform: `translateY(${offset * 0.5}px)`
//                     }}
//                 />
//                 <div className="text-wrapper">
//                     <h1 className="headline">Parallax</h1>
//                     <h2 className="sub-headline">Scrolling effect</h2>
//                 </div>
//             </section>
//         </div>
//     );
//   }

import * as React from "react"
import { useEffect, useState } from "react"
import "./styles.css"

export default function Parallax(props) {
    const { targetY, targetX, speed, classTarget, element, children } = props;
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        function handleScroll() {
            if(window.pageYOffset){

            }
            setOffset(window.pageYOffset)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, []);

    return (
        <div style={{position: "relative"}} >
            {children}
        </div>
    )
}