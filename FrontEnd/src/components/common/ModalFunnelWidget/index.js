import React from "react";
import "./index.css";
import { ReactComponent as ArrowSelectSVG } from "../../../assets/arrow-up.svg";

const ModalFunnelWidget = ({ handleClose, show, children, style, commentsStyleClass }) => {
  const showHideClassName = show
    ? "display-block-funnel-widget"
    : "display-none";

  return (
    <div className={showHideClassName}>
      <section 
        className={commentsStyleClass ? "modal-node-widget-main"+commentsStyleClass : "modal-node-widget-main"}
        style={style}
      >
        <button
          className="close-modal-node-widget"
          onClick={handleClose}
          title={"click to close modal"}
        >
          <div className="arrow-for-select">
            <ArrowSelectSVG />
          </div>
        </button>
        {children}
      </section>
    </div>
  );
};

export default ModalFunnelWidget;
