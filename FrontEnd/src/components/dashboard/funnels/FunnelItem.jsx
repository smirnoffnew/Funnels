import React from 'react';
import { NavLink } from "react-router-dom";
import ClickOutside from '../../common/ClickOutside'
import Modal from '../../common/Modal/Modal'
import '../index.css'


class FunnelItem extends React.Component {
  state = {
    show: false,
    showDelete: false,
    projectName: '',
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  showModalDelete = () => {
    this.setState({ showDelete: true, show: false });
  };

  hideModalDelete = () => {
    this.setState({ showDelete: false });
  };

  handleDeleteFunnel = () => {
    this.props.handleDelete(this.props.projectId, this.props._id)
    this.hideModalDelete()
    this.hideModal()
  }

  render() {
    const {
      _id,
      // projectId,
      funnelName,
      // funnelBody,
      // handleDelete,
      backgroundImg,
    } = this.props;

    return (
      <>
        <div className='project-wrapper'>
          <div className='project-image'
            style={{
              background: backgroundImg && backgroundImg.length > 0 ? `url(${'http://' + backgroundImg}) no-repeat center` : '#212939',
              backgroundSize: '220px 130px'
            }}
          >
            <NavLink
              className='view-funnels'
              to={'/diagram/' + _id}
              onClick={()=> {
                this.props.clearHistory()
              }}
            >
              Open
            </NavLink>
          </div>

          <div className='project' 
          >
            <p className="project-name" 
            >{funnelName}</p>
          </div>


          {
            !this.props.pathname.includes("collaborations") &&
            this.props.permissionForCollaborator &&
              this.props.permissionForCollaborator.includes("Edit") ?
              <button className="options-project" onClick={this.showModal}>
                Options
              </button>
              : null
          }

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false })
            }}
          >
            <Select show={this.state.show} handleClose={this.hideModal} expanded={this.state.expanded}>

              {/* <button className='btn-select btn-select-copy'>Make a copy</button>
              {/* <button className='btn-select btn-select-share'>Share</button> */}
              {/* <button className='btn-select btn-select-delete' onClick={this.showModalDelete}>Delete</button>  */}

              <button className='btn-select btn-select-copy' onClick={this.showModalDelete}>Delete</button>
              {/* <button className='btn-select btn-select-share'>Share</button> */}
              {/* <button className='btn-select btn-select-delete' onClick={this.showModalDelete}>Delete</button> */}

            </Select>
          </ClickOutside>

          <Modal show={this.state.showDelete} handleClose={this.hideModalDelete}>
            <label className='label-create'>Delete</label>

            <p style={{ fontSize: '13px' }} className='label-input-delete-project'>Are you sure you want to delete this funnel?</p>


            <div className='delete-modal-btn-wrapper'>
              <button className='btn btn-1 btn-delete-modal' onClick={() => this.handleDeleteFunnel()}>Delete</button>
              <button className='btn btn-1 btn-delete-modal' onClick={this.hideModalDelete}>Exit</button>
            </div>

            {/* {this.props.error && this.props.error.length > 0 && (
              <div className={`input-group`}>{this.props.error}</div>
            )} */}
          </Modal>

        </div>


      </>
    );
  }
}

export default FunnelItem;

//modalka, fuck yeah
const Select = ({ show, children }) => {
  const showHideClassName = show ? "select display-block" : "select display-none";

  return (
    <div className={showHideClassName}>
      <section className="select-main">
        {children}
      </section>
    </div>
  );
};