import React from 'react';
import ReactDOM from 'react-dom';
import './ModalPortal.css'

class ModalPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.portal = document.getElementById('diagram');
  }

  componentDidMount() {
    this.portal.appendChild(this.el);
  }

  componentWillUnmount() {
    this.portal.removeChild(this.el);
  }
  
  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return ReactDOM.createPortal(

      <div className={showHideClassName}>
        <section className="modal-main">
          <button className="close-modal" onClick={this.props.handleClose}>X</button>
          {this.props.children}
        </section>
      </div>,

      this.el,
    );
  }
}

export default ModalPortal;
