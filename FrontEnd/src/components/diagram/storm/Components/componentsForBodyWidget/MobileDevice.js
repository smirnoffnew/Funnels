import React from "react";
import Modal from '../../../../common/Modal/Modal'

export default class MobileDevice extends React.Component {

  state = {
    detectMobileDevice: true,
  }

  showDetectMobileDevice = () => this.setState({ detectMobileDevice: true })
  hideDetectMobileDevice = () => this.setState({ 
    detectMobileDevice: false 
  }, () => {
    this.props.app.getDiagramEngine().zoomToFit();
    document.getElementById("diagram-layer").click();
  })

  render() {
    return (
      <Modal show={this.state.detectMobileDevice} handleClose={this.hideDetectMobileDevice} >
        <label className='label-create'>Editing prohibited</label>
        <p
          style={{ fontSize: "13px", marginBottom: 50 }}
          className="label-input-delete-project"
        >
          Editing is possible only on the desktop!
        </p>
        <button
          className='btn btn-1 create-project-button-in-modal'
          style={{
            color: '#fff',
            display: 'flex',
            fontWeight: 400,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => this.hideDetectMobileDevice()}
        >
          OK
        </button>
      </Modal >
    );
  }
}