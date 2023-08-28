import React, { createElement, useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
// import ModalUI from '../ModalUI';
import { Preview, print } from 'react-html2pdf';
import { QRcode } from '../UI/Icons';

const QR = ({ data, name, children, as = "span", ...props }) => {

    // const [modal, setModal] = useState(null);
    const [showTemplate, setShowTemplate] = useState(false);

    const downloadQRCode = () => {
        setShowTemplate(true);
    };

    useEffect(() => {
        if (showTemplate) {
            print(name, 'QR-jsx-template');
            setTimeout(() => {
                setShowTemplate(false)
            }, 3000)
        }
    }, [showTemplate])

    const genQR = () => {
        downloadQRCode()
        // setModal({
        //     title: "",
        //     size: "md",
        //     alert: "",
        //     children: <Preview id={'QR-jsx-template'} >
        //         {children}
        //         <div className='text-center'>
        //             <QRCodeSVG
        //                 value={data}
        //                 size={300}
        //                 includeMargin
        //             />
        //         </div>
        //     </Preview>,
        //     open: true,
        //     onClosed: (act) => {
        //         if (act) {
        //             act();
        //         }
        //         setModal(null)
        //     },
        //     buttons: [
        //         { text: "Cerrar", color: "success", close: true },
        //         { text: "Descargar QR", color: "success", click: () => downloadQRCode }
        //     ]
        // })
    }

    return (
        <>
            {showTemplate && <div style={{ display: "none", zIndex: -10 }}>
                <Preview id={'QR-jsx-template'} >
                    {children}
                    <div className='text-center'>
                        <QRCodeSVG
                            value={data}
                            size={300}
                            includeMargin
                        />
                    </div>
                </Preview>
            </div>}
            {/* <ModalUI open={modal?.open || false} {...modal} /> */}
            {createElement(
                as,
                {
                    ...props,
                    onClick: () => genQR()
                },
                <QRcode size={18} />)
            }
        </>
    )
}

export default QR
