import React from "react";
import "./index.css";
import { ReactComponent as ArrowSelectSVG } from "../../../assets/arrow-up.svg";

class ModalFunnelWidget extends React.Component {
  constructor(props){
    super(props);
  }

  render() {

  const { handleClose, show, children, style, commentsStyleClass } = this.props

  const showHideClassName = show
    ? "display-block-funnel-widget"
    : "display-none";

  return (

    <div className={showHideClassName}>
      <section 
        className={commentsStyleClass ? "modal-funnel-widget-main-comments"+commentsStyleClass : "modal-funnel-widget-main"}
        style={style}
       
      >
        <button
          className="close-modal-funnel-widget"
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

  )}
}

export default ModalFunnelWidget;
