import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "../../common/Modal/Modal";
import ClickOutside from "../../common/ClickOutside";
import {
  getAllFunnels,
  createLink,
  resetLink,
  removeCollaborator,
  changePermission,
  resetCollaboratorsModalMessage
} from "../../../store/actions/projects";
import {
  getAllCollaboratorsForFunnels,
  resetAllCollaboratorsForFunnels
} from "../../../store/actions/collaborations";
import "../index.css";

class ProjectItem extends React.Component {
  state = {
    show: false,
    showDelete: false,
    showCollaborate: false,
    projectName: "",
    selectedFunnelsList: [],
    permission: "View Only"
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

  showModalCollaborate = () => {
    this.setState({ showCollaborate: true, show: false });
    this.props.getAllFunnels(this.props._id);
  };

  hideModalCollaborate = () => {
    this.setState({ showCollaborate: false });
    this.props.resetLink();
  };

  handleDeleteProject = () => {
    this.props.handleDelete(this.props._id);
    this.hideModalDelete();
    this.hideModal();
  };

  add = e => {
    this.setState(
      {
        selectedFunnelsList: [...this.state.selectedFunnelsList, e.target.name]
      },
      () => {
        this.props.resetAllCollaboratorsForFunnels();
        this.state.selectedFunnelsList.length > 0 &&
        this.props.getAllCollaboratorsForFunnels(
          this.state.selectedFunnelsList
        );
      }
    );
  };

  remove = e => {
    this.setState(
      {
        selectedFunnelsList: this.state.selectedFunnelsList.filter(
          item => item !== e.target.name
        )
      },
      () => {
        this.props.resetAllCollaboratorsForFunnels();
        this.state.selectedFunnelsList.length > 0 &&
        this.props.getAllCollaboratorsForFunnels(
          this.state.selectedFunnelsList
        );
      }
    );
  };

  handleChangePermission = e => {
    this.setState({ permission: e.target.value });
  };

  handleCreateLink = () => {
    this.props.createLink(
      this.state.selectedFunnelsList,
      this.state.permission
    );
  };

  copyToClipboard = e => {
    this.link.select();
    document.execCommand("copy");
    e.target.focus();
  };

  changePermission = (funnelId, _id, permissions) => {
    this.props.changePermission(funnelId, _id, permissions);

    setTimeout(() => {
      this.props.resetCollaboratorsModalMessage();
    }, 3000);

    setTimeout(() => {
      this.props.resetAllCollaboratorsForFunnels();
      this.state.selectedFunnelsList.length > 0 &&
      this.props.getAllCollaboratorsForFunnels(this.state.selectedFunnelsList);
    }, 1500);
  };

  removeCollaborator = (funnelId, _id) => {
    this.props.removeCollaborator(funnelId, _id);

    setTimeout(() => {
      this.props.resetCollaboratorsModalMessage();
    }, 3000);

    setTimeout(() => {
      this.props.resetAllCollaboratorsForFunnels();
      this.state.selectedFunnelsList.length > 0 &&
      this.props.getAllCollaboratorsForFunnels(this.state.selectedFunnelsList);
    }, 1500);
  };

  render() {
    const {
      _id,
      projectName,
      funnelsLength
      // handleDelete,
    } = this.props;

    return (
      <>
        <div className="project-wrapper">
          <div className="project-image">
            <NavLink className="view-funnels" to={"/funnels/" + _id}>
              View Funnels
            </NavLink>
          </div>

          <div className="project">
            <p className="project-name" >{projectName}</p>
            {/* <br /> */}
            {funnelsLength} funnels
          </div>

          {
            this.props.permissionForCollaborator &&
              this.props.permissionForCollaborator.includes("Edit") ?
              <button className="options-project" onClick={this.showModal}>
                Options
              </button>
              : null
          }

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false });
            }}
          >
            <Select
              show={this.state.show}
              handleClose={this.hideModal}
              expanded={this.state.expanded}
            >
              {/* <button className='btn-select btn-select-copy'>Make a copy</button> */}
              {/* <button className='btn-select' onClick={this.showModalCollaborate}>Collaborate</button> */}
              {/* <button className='btn-select btn-select-share'>Share</button> */}
              {/* <button className='btn-select btn-select-delete' onClick={this.showModalDelete}>Delete</button> */}

              <button
                className="btn-select btn-select-copy"
                onClick={this.showModalCollaborate}
              >
                Collaborate
              </button>
              {/* <button className='btn-select' onClick={this.showModalCollaborate}>Collaborate</button> */}
              {/* <button className='btn-select btn-select-share'>Share</button> */}
              <button
                className="btn-select btn-select-delete"
                onClick={this.showModalDelete}
              >
                Delete
              </button>
            </Select>
          </ClickOutside>

          <Modal
            show={this.state.showDelete}
            handleClose={this.hideModalDelete}
          >
            <label className="label-create">Delete</label>

            <p
              style={{ fontSize: "13px" }}
              className="label-input-delete-project"
            >
              Are you sure you want to delete this project? All funnels will be
              lost!
            </p>

            <div className="delete-modal-btn-wrapper">
              <button
                className="btn btn-1 btn-delete-modal"
                onClick={() => this.handleDeleteProject()}
              >
                Delete
              </button>
              <button
                className="btn btn-1 btn-delete-modal"
                onClick={this.hideModalDelete}
              >
                Exit
              </button>
            </div>

            {/* {this.props.error && this.props.error.length > 0 && (
              <div className={`input-group`}>{this.props.error}</div>
            )} */}
          </Modal>

          <Modal
            show={this.state.showCollaborate}
            handleClose={this.hideModalCollaborate}
          >
            <label className="label-create">Collaborate</label>

            <label className="label-input" style={{ marginLeft: "15px" }}>
              Choose Funnels
            </label>
            <div className="funnels-checkbox">
              {this.props.funnels && this.props.funnels.length > 0 ? (
                this.props.funnels.map((funnel, key) => (
                  <React.Fragment key={key}>
                    <label className="container-checkbox">
                      {funnel.funnelName}
                      <input
                        name={funnel._id}
                        type="checkbox"
                        onClick={e =>
                          this.state.selectedFunnelsList.includes(e.target.name)
                            ? this.remove(e)
                            : this.add(e)
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                  </React.Fragment>
                ))
              ) : (
                <p className="label-input" style={{ marginLeft: "15px" }}>
                  No funnels
                </p>
              )}
            </div>

            <label className="label-choose-permission">
              Choose Permission:
            </label>
            <div className="custom-select-wrapper">
              <select
                className="custom-select"
                value={this.state.permission}
                onChange={e => this.handleChangePermission(e)}
              >
                <option value="View Only">View Only</option>
                <option value="Edit">Edit</option>
              </select>
            </div>

            {this.props.collaborators && this.props.collaborators.length > 0 ? (
              <>
                <label className="label-input" style={{ marginLeft: "15px" }}>
                  Collaborators:
                </label>
                <div className="funnels-collaborators">
                  {this.props.collaborators.map((item, key) => (
                    <React.Fragment key={key}>
                      {item.myCollaborations.map((collaborator, key) => (
                        <div key={key} className="funnels-collaborators-item">
                          {item.photoUrl === "" ? (
                            <div className="empty-collaborator-photo">
                              {item.firstName[0] &&
                                item.firstName[0].toUpperCase()}
                            </div>
                          ) : (
                            <img
                              className="collaborator-photo"
                              src={"http://" + item.photoUrl}
                              alt="Avatar"
                            />
                          )}

                          <p className="collaborators-in-modal">
                            {item.firstName}
                          </p>
                          <p className="collaborators-in-modal">
                            {collaborator.funnel.funnelName}
                          </p>
                          <p className="collaborators-in-modal">
                            {collaborator.permissions}
                          </p>

                          <button
                            className="button-change-permission"
                            onClick={() =>
                              this.changePermission(
                                collaborator.funnelId,
                                item._id,
                                collaborator.permissions
                              )
                            }
                          >
                            Change Permission
                          </button>
                          <button
                            className="button-remove-collaborator"
                            onClick={() =>
                              this.removeCollaborator(
                                collaborator.funnelId,
                                item._id
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : null}

            {this.props.collaboratorsModalMessage &&
              this.props.collaboratorsModalMessage.length > 0 && (
                <div
                  className={`input-group`}
                  style={{ marginTop: "10px", margin: "auto", display: "flex" }}
                >
                  {this.props.collaboratorsModalMessage}
                </div>
              )}
            {this.props.link && this.props.link.length > 0 ? (
              <>
                <input
                  className="created-link-wrapper"
                  ref={ref => (this.link = ref)}
                  value={this.props.link}
                  onChange={() => {}}
                />
                <button
                  className="btn btn-1 btn-delete-modal"
                  style={{ margin: "15px auto" }}
                  onClick={this.copyToClipboard}
                >
                  Copy Link
                </button>
              </>
            ) : (
              <button
                className={
                  this.state.selectedFunnelsList.length === 0 ? 
                  'btn btn-1 btn-delete-modal btn-disabled' 
                  : 
                  'btn btn-1 btn-delete-modal '
                }
                style={{ margin: "15px auto" }}
                onClick={() => this.handleCreateLink()}
                disabled={this.state.selectedFunnelsList.length === 0}
              >
                Create Link
              </button>
            )}
          </Modal>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    funnels: state.projects[`funnelsList${ownProps._id}`],
    link: state.projects.createLink,
    collaborators: state.collaborations.allCollaboratorsForFunnels,
    collaboratorsModalMessage: state.projects.collaboratorsModalMessage
  };
}

const mapDispatchToState = dispatch => ({
  getAllFunnels: id => dispatch(getAllFunnels(id)),
  createLink: (selectedFunnelsList, permission) =>
    dispatch(createLink(selectedFunnelsList, permission)),
  resetLink: () => dispatch(resetLink()),

  getAllCollaboratorsForFunnels: id =>
    dispatch(getAllCollaboratorsForFunnels(id)),
  resetAllCollaboratorsForFunnels: () =>
    dispatch(resetAllCollaboratorsForFunnels()),

  changePermission: (funnelId, _id, permissions) =>
    dispatch(changePermission(funnelId, _id, permissions)),
  removeCollaborator: (funnelId, _id) =>
    dispatch(removeCollaborator(funnelId, _id)),
  resetCollaboratorsModalMessage: () =>
    dispatch(resetCollaboratorsModalMessage())
});

export default connect(
  mapStateToProps,
  mapDispatchToState
)(ProjectItem);

//modalka, fuck yeah
const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "select display-block"
    : "select display-none";

  return (
    <div className={showHideClassName}>
      <section className="select-main">{children}</section>
    </div>
  );
};
