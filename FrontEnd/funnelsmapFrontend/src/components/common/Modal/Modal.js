import React from 'react';
import './Modal.css'

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className="close-modal" onClick={handleClose}>X</button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
