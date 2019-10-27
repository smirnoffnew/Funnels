import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from "../../common/Layout/Layout";
import './SettingsUsers.css'
import SettingsPermissionsForm from './SettingsPermissions';
import Modal from '../../common/Modal/Modal';
import { deleteUser, getAllPartners } from '../../../store/actions/users';
import SettingsPermissionsFormModal from './SettingsPermissionsModal';

class SettingsUsers extends Component {
  state = {
    showModalChangePermission: false,
    showModalDeleteUser: false,
  }

  componentDidMount = () => {
    this.props.getAllPartners()
  }

  hideModalChangePermission = () => {
    this.setState({
      showModalChangePermission: false
    })
  };

  showModalChangePermission = (rules, id) => {
    this.setState({
      showModalChangePermission: true,
      rules,
      id 
    })
  };


  hideModalDeleteUser = () => {
    this.setState({
      showModalDeleteUser: false
    })
  };

  showModalDeleteUser = (
    id,
    firstName,
    lastName
  ) => {
    this.setState({
      showModalDeleteUser: true,
      userId: id,
      userFirstName: firstName,
      userLastName: lastName,
    })
  };

  hideModal = () => {
    this.props.dispatch({ type: 'GENERATED_LINK_TO_ADD_USER_RESET' });
  };

  copyToClipboardUrl = e => {
    this.linkToAddU.select();
    document.execCommand("copy");
    e.target.focus();
    this.props.dispatch({
      type: "GENERATED_LINK_TO_ADD_USER_RESET"
    });
  };



  render() {
    this.props.usersList &&
    this.props.usersList.map(user => {
      console.log('user', user)
    })

    return (
      <Layout title="Users">

        {this.props.messageErrorGetAllUsers &&
          <div className="input-group">Oops! {this.props.messageErrorGetAllUsers}</div>}



        <Modal
          show={this.props.linkToAddUser}
          handleClose={this.hideModal}
        >
          <label className="label-create">User link</label>

          <label htmlFor="Name" className="label-input">
            {/* Link For Add User */}
          </label>
          <input
            ref={ref => this.linkToAddU = ref}
            id="Name"
            placeholder="Link For Add User"
            type="text"
            value={this.props.linkToAddUser ? this.props.linkToAddUser : ''}
            onChange={() => { }}
          />
          <button
            className="btn btn-1 create-project-button-in-modal"
            onClick={e => this.copyToClipboardUrl(e)}
          >
            Copy Link
          </button>
        </Modal>

        <Modal
          show={this.state.showModalChangePermission}
          handleClose={this.hideModalChangePermission}
        >
          <SettingsPermissionsFormModal
            rules={this.state.rules}
            id={this.state.id}
            handleHideModal={this.hideModalChangePermission}
          />
        </Modal>

        <Modal
          show={this.state.showModalDeleteUser}
          handleClose={this.hideModalDeleteUser}
        >
          <label className="label-create">Remove User</label>
          <p
            style={{ fontSize: "13px" }}
            className="label-input-delete-project"
          >
            Are you sure you want to remove
            {' '}
            {this.state.userFirstName}{' '}{this.state.userLastName}?
          </p>
          <div className="delete-modal-btn-wrapper">
            <button
              className="btn btn-1 btn-delete-modal"
              onClick={() => {
                this.props.deleteUser(this.state.userId)
                this.hideModalDeleteUser()
              }}
            >
              Remove
            </button>
            <button
              className="btn btn-1 btn-delete-modal"
              onClick={this.hideModalDeleteUser}
            >
              Exit
            </button>
          </div>
          {this.props.messageErrorDeleteUser &&
            <div className={`input-group`}>{this.props.messageErrorDeleteUser}</div>
          }
        </Modal>


        <div className='settings-user-wrapper'>
          <SettingsPermissionsForm />

          {
            this.props.usersList &&
            this.props.usersList.length >= 1  &&


            <div className='settings-box'>
              <label className='settings-box-label'>Users</label>
              <br />
              <div className='setting-input-wrapper'>




                <div
                  className='funnels-collaborators'
                  style={{ maxHeight: '180px' }}
                >
                  {

                    this.props.usersList.map((user, index) => (
                      <div
                        className='funnels-collaborators-item'
                        key={index}
                      >
                        <div
                          className="empty-collaborator-photo"
                        >
                          {
                            user.partnerProfile &&
                            user.partnerProfile.firstName[0].toUpperCase()
                          }
                        </div>
                        <p
                          style={{ width: '212px' }}
                          className='collaborators-in-modal'
                        >
                          {
                            user.partnerProfile &&
                            user.partnerProfile.firstName
                          }
                          {' '}
                          {
                            user.partnerProfile &&
                            user.partnerProfile.accountName
                          }
                        </p>
                        <button
                          className='button-change-permission'
                          onClick={() => {
                            this.showModalChangePermission(
                              user.permissions,
                              user._id
                            )
                          }}
                        >
                          Change Permission
                      </button>
                        <button
                          className='button-remove-collaborator'
                          onClick={() => {
                            this.showModalDeleteUser(
                              user._id,
                              user.partnerProfile &&
                              user.partnerProfile.firstName,
                              user.partnerProfile &&
                              user.partnerProfile.accountName,
                            )
                          }}
                        >
                          Remove
                      </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  console.log('state linkToAddUser', state)
  return {
    linkToAddUser: state.users.linkToAddUser,
    usersList: state.users.usersList,
    messageErrorGetAllUsers: state.users.messageErrorGetAllUsers,
    messageErrorDeleteUser: state.users.messageErrorDeleteUser,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item),
    deleteUser: id => dispatch(deleteUser(id)),
    getAllPartners: () => dispatch(getAllPartners()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsUsers)

