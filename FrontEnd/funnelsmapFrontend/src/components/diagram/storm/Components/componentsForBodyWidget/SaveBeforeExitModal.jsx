import * as React from "react";
import domtoimage from 'dom-to-image';
import randomString from 'random-string';

import Modal from '../../../../common/Modal/Modal'
import { NavLink } from "react-router-dom";
import { ReactComponent as LogoWidgetSVG } from '../../../../../assets/logo-widget.svg'


export default class SaveBeforeExitModal extends React.Component {

  state = {
    saveBeforeExit: false,
  }

  showSaveBeforeExit = () => this.setState({ saveBeforeExit: true })
  hideSaveBeforeExit = () => this.setState({ saveBeforeExit: false })

  saveDiagramThenExit = file => this.setState({
    snackMsg: 'next',
    converted: this.props.app.serialization(this.props.app.getDiagramEngine().getDiagramModel())
  }, () => {
    this.props.work.saveDiagramThenExit(this.props.work.funnelId, this.state, file)
  });

  render() {
    return (
      <>
        {
          this.props.work.pathname.includes('diagram') ?

            !this.props.work.permissionForCollaborator.includes("Edit") ?
              <NavLink
                to={'/collaborations'}
                style={{
                  height: 65
                }}
              >
                <LogoWidgetSVG />
              </NavLink>
              :
              <div
                className='logo-widget'
                onClick={this.showSaveBeforeExit}
              >
                <LogoWidgetSVG />
              </div>

            :
            <div
              className='logo-widget'
            >
              <NavLink
                to={'/templates'}
              >
                <LogoWidgetSVG />
              </NavLink>
            </div>
        }

        <Modal show={this.state.saveBeforeExit} handleClose={this.hideSaveBeforeExit} >
          <label className='label-create'>Save Before Exit</label>

          <div style={{
            display: 'flex',
            width: 300,
            margin: '22px auto',
          }}>
            <button
              className='btn btn-1 create-project-button-in-modal'
              onClick={() => {
                let diagram = document.getElementById('diagram-layer');
                domtoimage.toBlob(diagram)
                  .then(data => {
                    let name = randomString({ length: 10 });
                    var file = new File([data], name, { type: "image/svg" });
                    this.saveDiagramThenExit(file)
                  })
                  .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                  });
              }}
            >
              Save
          </button>

            <NavLink
              to={'/projects'}
              className='btn btn-1 create-project-button-in-modal'
              style={{
                color: '#fff',
                display: 'flex',
                fontWeight: 400,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Don't Save
          </NavLink>
          </div>
          {
            this.props.work.message && (
              <div className='input-group'>{this.props.work.message}</div>
            )
          }
        </Modal >
      </>
    );
  }
}