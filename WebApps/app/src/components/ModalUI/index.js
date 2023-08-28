import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { CheckIcon, WarningIcon, InfoIcon, QuestionIcon, XCloseIcon } from './../UI/Icons';
import { Button, Modal as ModalBootstrap, ModalBody, ModalHeader } from 'reactstrap';

const getIcon = (type) => {
  let size = 50;
  switch (type) {
    case "info":
      return <span className="text-info"><InfoIcon size={size} /></span>;
    case "question":
      return <span className="text-info"><QuestionIcon size={size} /></span>;
    case "danger":
      return <span className="text-danger"><XCloseIcon size={size} /></span>;
    case "warning":
      return <span className="text-warning"><WarningIcon size={size} /></span>;
    default:
      return <span className="text-success"><CheckIcon size={size} /></span>;
  }
}

const ModalUI = (props) => {

  const { size, type, title, alert, children, open, onClosed, backdrop, buttons, unmountOnClose, closeIcon } = props;

  const [modal, setModal] = useState(open);
  const [onclosed, setOnclosed] = useState(() => { });

  useEffect(() => {
    setModal(open);
  }, [open]);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <ModalBootstrap keyboard={false} contentClassName={`shadow border-0`}
        size={size || "lg"} centered onClosed={() => {
          !!(onClosed) && onClosed(onclosed);
        }}
        unmountOnClose={typeof unmountOnClose === "boolean" ? unmountOnClose : true}
        isOpen={modal}
        backdrop={backdrop || 'static'}
        toggle={toggle}>

        <ModalBody className="pl-md-4 pr-md-4 mb-3">
          {type &&
            <h1 className="mt-3 text-center font-weight-bold">
              <span>
                {getIcon(type)}
              </span>
            </h1>
          }
          {!!(closeIcon) && <ModalHeader style={{ border: "0px", position: "absolute", right: "0", top: "0" }} toggle={toggle}></ModalHeader>}

          {!!(title) && <div className="text-center mt-2 text-muted">
            <h3>{title}</h3>
            <p>{alert || ""}</p>
          </div>}

          <div className="mt-4 mb-4">
            {children}
          </div>

          <div className={`mt-4 d-flex justify-content-${buttons?.length === 1 ? "center" : "between"}`}>
            {buttons?.map((b, i) => {
              return (
                <Button
                  key={`m-b-${i}`}
                  color={b.color}
                  className={`btn-${b.color}`}
                  id={b.id || `modalbtn${i}`}
                  onClick={
                    !!(b.close) ?
                      toggle
                      :
                      (b.click && (() => {
                        setOnclosed(b.click)
                        toggle()
                      }))
                  }>{b.text}</Button>
              )
            })
            }
          </div>
        </ModalBody>
      </ModalBootstrap>
    </div>
  );
}

ModalUI.propTypes = {
  open: PropTypes.any.isRequired, //HTML element for open modal or boolean value
  type: PropTypes.oneOf(["success", "danger", "info", "warning", "question"]), // Modal icon type
  onClosed: PropTypes.func, //Function triggered by "acept button" (withow property close=true)
  buttons: PropTypes.array, //Buttons {color, text, close, click, id} for close and trigger any function 
  title: PropTypes.string, // Text as title of modal
  alert: PropTypes.any, // Text for make an alert not modal
  size: PropTypes.string, // Size of modal, default "lg"
  children: PropTypes.any, //Content of modal
  unmountOnClose: PropTypes.bool,
  closeIcon: PropTypes.bool,
  backdrop: PropTypes.bool,
};

export default ModalUI;