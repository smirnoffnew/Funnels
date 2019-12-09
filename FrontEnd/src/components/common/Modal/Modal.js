import React from 'react';
import './Modal.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Modal = ({ handleClose, show, width, padding, zIndex, borderRadius, children }) => {

  React.useEffect(() => {
    AOS.init({
      duration : 150
    })
  })

  React.useEffect(() => {
    AOS.refresh();
  }, [handleClose])

  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName} data-aos={ show ? "zoom-out" : "zoom-in"}>
      <section className="modal-main" style={{width, padding, zIndex, borderRadius}}>
        <button className="close-modal" onClick={handleClose}>X</button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
