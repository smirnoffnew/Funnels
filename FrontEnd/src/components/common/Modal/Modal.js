import React from 'react';
import './Modal.css'

const Modal = ({ handleClose, show, width, padding, zIndex, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main" style={{width, padding, zIndex}}>
        <button className="close-modal" onClick={handleClose}>X</button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
