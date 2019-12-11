import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  createProjectWithPromisefication,
  createFunnelWithPromisefication,
  updateProjectsBySearch,
  getAllProjects,
  setPermission
} from "../../../store/actions/projects";
import { signOutUser } from "../../../store/actions/auth";
import Modal from "../Modal/Modal";
import ClickOutside from "../ClickOutside";
import { ReactComponent as SearchSVG } from "../../../assets/search.svg";
import { ReactComponent as QuestionSVG } from "../../../assets/question-mark.svg";
import "./header.css";
import { getAllOwners } from "../../../store/actions/users";
import HeaderNavigationBox from "./HeaderNavigationBox";
import uuid from 'uuid'

class Header extends Component {
  state = {
    show: false,
    showFunnel: false,
    showSignOut: false,
    projectName: "",
    funnelName: "",
    searchProject: "",
    showHeaderNavigationBox: false,
  };

  componentDidMount = () => {
    this.props.getAllOwners();
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({
      show: false,
      projectName: ""
    });
    this.props.dispatch({ type: "CLEAR_CREATE_PROJECT_ERROR" });
  };

  showModalFunnel = () => {
    this.setState({ showFunnel: true });
  };

  hideModalFunnel = () => {
    this.setState({ showFunnel: false, funnelName: "" });
    this.props.dispatch({ type: "CLEAR_CREATE_FUNNEL_ERROR" });
  };

  showModalSignOut = () => {
    this.setState({
      showSignOut: true,
      show: false,
      showFunnel: false
    }, () => {
      this.props.getAllOwners();
    });
  };

  hideModalSignOut = () => {
    this.setState({ showSignOut: false });
  };

  handleChange = e =>
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        this.props.dispatch({ type: "CLEAR_CREATE_PROJECT_ERROR" });
        this.props.dispatch({ type: "CLEAR_CREATE_FUNNEL_ERROR" });
      }
    );

  handleCreateProject = () => {
    this.props.dispatch({
      type: 'CREATE_PROJECT_FATCHING',
      payload: true
    });

    this.props
      .createProjectWithPromisefication(this.state.projectName)
      .then(response => {
        this.props.dispatch({
          type: "CREATE_PROJECT",
          payload: response.data
        });
        this.props.dispatch({ type: "CLEAR_CREATE_PROJECT_ERROR" });
        this.hideModal();

        this.props.pathname !== '/projects' && this.props.dispatch(push("/projects"));

        this.props.dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.message,
            id: uuid(),
          }
        });

        this.props.dispatch({
          type: 'CREATE_PROJECT_FATCHING',
          payload: false
        });
      })
      .catch(error => {
        this.props.dispatch({
          type: "CREATE_PROJECT_FAILURE",
          payload: error
        });
        this.props.dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: error,
            id: uuid(),
          }
        });
      });
  };

  handleCreateFunnel = () => {
    this.props.dispatch({
      type: 'CREATE_FUNNEL_FATCHING',
      payload: true
    });
    this.props
      .createFunnelWithPromisefication(
        this.state.funnelName,
        this.props.projectId
      )
      .then(response => {
        // debugger
        let res = response.data;
        let projectId = this.props.projectId;
        this.props.dispatch({
          type: "CREATE_FUNNEL",
          payload: {
            projectId,
            res
          }
        });
        this.props.dispatch({
          type: 'CREATE_FUNNEL_FATCHING',
          payload: false
        });
        this.props.dispatch({ type: "CLEAR_CREATE_FUNNEL_ERROR" });
        this.hideModalFunnel();

        this.props.dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.message,
            id: uuid(),
          }
        });
      })
      .catch(error => {
        this.props.dispatch({
          type: "CREATE_FUNNEL_FAILURE",
          payload: error
        });
        this.props.dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: error,
            id: uuid(),
          }
        });
      });
  };

  filterList = e => {
    this.setState(
      {
        searchProject: e.target.value
      },
      () => {
        let updatedList =
          this.props.projects &&
          this.props.projects.filter(item => {
            return (
              item.projectName
                .toLowerCase()
                .search(this.state.searchProject.toLowerCase()) !== -1
            );
          });
        if (this.state.searchProject.length > 0) {
          this.setState({ updatedProjects: updatedList }, () =>
            this.props.updateProjectsBySearch(this.state.updatedProjects)
          );
        } else this.props.getAllProjects();
      }
    );
  };

  animMouseEnter = () => {
    this.searchRef.style.display = "block";
    this.searchRef.style.animation = "widthAnimationEnter 0.7s";
  };

  animMouseLeave = () => {
    this.searchRef.style.animation = "widthAnimationLeave 0.7s";
    setTimeout(() => {
      this.searchRef.style.display = "none";
    }, 500);
  };

  changeHeaderNavigationBox = () => {
    this.setState(prev => {
      return {
        showHeaderNavigationBox: !prev.showHeaderNavigationBox
      }
    })
  }

  render() {
    const userAvatar = JSON.parse(localStorage.getItem("userAvatar"))
    // console.log('userAvatar', userAvatar)
    const userFirstName = localStorage.getItem("userFirstName");

    if (this.props.error && this.props.error.length > 0) {
      console.log(this.props.error);
    }

    localStorage.getItem('token2') ?
      localStorage.getItem('multiSession') &&
      JSON.parse(localStorage.getItem('multiSession')).map(owner => {
        if (owner.myPartners && `"` + owner.myPartners[0].token + `"` === localStorage.getItem('token2')) {
          // console.log('owner', owner.myPartners && owner.myPartners[0])
          this.props.setPermission(owner.myPartners && owner.myPartners[0].permissions)
        }
      })
      :
      this.props.setPermission('View,Edit,Create')


    return (
      <>
        <header>

          <ClickOutside
            onClickOutside={() => {
              this.setState({
                showHeaderNavigationBox: false
              })
            }}
            style={{
              display: 'inline'
            }}
          >
            <div className="burgers">
              <input
                className="burger-check"
                id="burger-check"
                type="checkbox"
                checked={this.state.showHeaderNavigationBox}
                onClick={this.changeHeaderNavigationBox}
                onChange={() => { }}
              />
              <label htmlFor="burger-check" className="burger" />
              <nav id="navigation1" className="navigation">
                <HeaderNavigationBox />
              </nav>
            </div>
          </ClickOutside>

          <div className="logo">{this.props.title}</div>
          <nav>
            {this.props.authenticated ? (
              <div className="header-buttons">
                <div
                  className="search-projects-bar"
                  onMouseEnter={this.animMouseEnter}
                  onMouseLeave={this.animMouseLeave}
                >
                  {
                    <>
                      <SearchSVG />
                      <input
                        type="text"
                        placeholder="Search Project"
                        onChange={e => this.filterList(e)}
                        value={this.state.searchProject}
                        className="search-projects"
                        style={{ display: "none" }}
                        ref={ref => (this.searchRef = ref)}
                      />
                    </>
                  }
                </div>

                {
                  this.props.permissionForCollaborator &&
                    this.props.permissionForCollaborator.includes("Create") ?
                    this.props.pathname.includes("funnels") ? (
                      <button
                        className="btn btn-1 btn-show-modal-create"
                        onClick={this.showModalFunnel}
                      >
                        Create Funnel
                    </button>
                    ) : (
                        <button
                          className="btn btn-1 btn-show-modal-create"
                          onClick={this.showModal}
                        >
                          Create Project
                    </button>
                      )
                    : null

                }



                <a
                  href="https://funnelsmap.com/tutorials/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 30, marginRight: 10, display: "flex" }}
                >
                  <QuestionSVG />
                </a>

                {/* <div style={{ marginLeft: 5, marginRight: 20, display: 'flex' }}>
                    <RingSVG />
                  </div> */}

                <div
                  className="header-img-preview"
                  onClick={this.showModalSignOut}
                >
                  {userAvatar === '' ? (
                    <div className="header-preview-empty">
                      {userFirstName[0] && userFirstName[0].toUpperCase()}
                    </div>
                  ) : (
                      <img src={'http://' + userAvatar} alt="Avatar" />
                    )}
                </div>
              </div>
            ) : null}
          </nav>
        </header>

        <Modal show={this.state.show} handleClose={this.hideModal}>
          <label className="label-create">Create Project</label>

          <label htmlFor="NameProject" className="label-input">
            Name
          </label>
          <input
            id="NameProject"
            placeholder="Project Name"
            type="text"
            name="projectName"
            value={this.state.projectName}
            onChange={this.handleChange}
          />
          {/* {this.props.error && this.props.error.length > 0 && (
            <div className={`input-group`}>{this.props.error}</div>
          )} */}

          <button
            className={
              this.props.isCreateProjectFatching ? 
              "btn btn-1 create-project-button-in-modal btn-disabled"
              : 
              "btn btn-1 create-project-button-in-modal"
            }

            disabled={this.props.isCreateProjectFatching}
            onClick={() => this.handleCreateProject()}
          >
            {
              this.props.isCreateProjectFatching ? 
                <span className='loader-spinner'/> 
                : 'Create Project'
            }
          </button>
        </Modal>

        <Modal show={this.state.showFunnel} handleClose={this.hideModalFunnel}>
          <label className="label-create">Create Funnel</label>

          <label htmlFor="NameFunnel" className="label-input">
            Name
          </label>
          <input
            id="NameFunnel"
            placeholder="Funnel Name"
            type="text"
            name="funnelName"
            value={this.state.funnelName}
            onChange={this.handleChange}
          />
          {/* {this.props.errorFunnel && this.props.errorFunnel.length > 0 && (
            <div className={`input-group`}>{this.props.errorFunnel}</div>
          )} */}

           <button
            className={
              this.props.isCreateFunnelFatching ? 
              "btn btn-1 create-project-button-in-modal btn-disabled"
              : 
              "btn btn-1 create-project-button-in-modal"
            }

            disabled={this.props.isCreateFunnelFatching}
            onClick={() => this.handleCreateFunnel()}
          >
            {
              this.props.isCreateFunnelFatching ? 
                <span className='loader-spinner'/> 
                : 'Create Funnel'
            }
          </button>
        </Modal>

        <ClickOutside
          onClickOutside={() => {
            this.setState({ showSignOut: false });
          }}
        >
          <Select show={this.state.showSignOut}>
            <p
              className="header-select-label"
              style={{
                fontSize: "13px",
                textAlign: "left",
                paddingLeft: "11px",
                background: "#f6f8f9",
                margin: "0",
                paddingTop: "20px",
                paddingBottom: "20px"
              }}
            >
              You are currently on a free subscription!
              {/* <br />
              <span style={{ color: '#fd8f21' }}>Upgrade</span> */}
            </p>

            {
              localStorage.getItem('multiSession') && localStorage.getItem('multiSession').length > 10 &&
              <>
                <p
                  className='text-multi-session'
                  style={{
                    display: 'flex',
                    paddingLeft: '15px',
                    marginBottom: '13px',
                    borderTop: '1px solid rgb(220, 229, 236)',
                    paddingTop: '15px',
                  }}
                  onClick={() => {
                    if (localStorage.getItem('token2')) {
                      localStorage.removeItem('token2')
                      this.props.dispatch(push('/projects'))
                      window.location.reload()
                    }
                  }}
                >
                  {!localStorage.getItem('token2') &&
                    <span style={{ color: '#fd8f21', marginRight: 8 }}>✓</span>
                  }
                  {localStorage.getItem('userFirstName')}
                </p>

                {
                  // localStorage.getItem('multiSession') &&
                  JSON.parse(localStorage.getItem('multiSession'))
                    .map((owner, index) => (
                      <p
                        key={index}
                        className='text-multi-session'
                        style={{
                          display: 'flex',
                          marginLeft: 15,
                          marginBottom: 8,
                        }}
                        onClick={() => {
                          if (owner.myPartners &&
                            `"` + owner.myPartners[0].token + `"` !== localStorage.getItem('token2')) {
                            const token2 = `"${owner.myPartners && owner.myPartners[0].token}"`
                            localStorage.setItem('token2', token2)
                            this.props.dispatch(push('/projects'))
                            window.location.reload()
                          }
                        }}
                      >
                        {owner.myPartners &&
                          `"` + owner.myPartners[0].token + `"` === localStorage.getItem('token2') &&
                          <span style={{ color: '#fd8f21', marginRight: 8 }}>✓</span>
                        }

                        {owner.firstName}
                      </p>
                    ))
                }
              </>
            }



            <button
              className="btn-select btn-select-delete"
              onClick={() => this.props.signOutUser()}
            >
              Log Out
            </button>
          </Select>
        </ClickOutside>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isCreateProjectFatching: state.projects.isCreateProjectFatching,
    isCreateFunnelFatching: state.projects.isCreateFunnelFatching,

    authenticated: state.auth.authenticated,
    error: state.projects.createProjectError,
    errorFunnel: state.projects.createFunnelError,
    projectId: state.router.location.pathname.substring(9), // get projectId from pathname
    pathname: state.router.location.pathname,
    projects: state.projects.projectsList,

    ownersList: state.users.ownersList,
    messageErrorGetAllOwners: state.users.messageErrorGetAllOwners,
    permissionForCollaborator: state.projects.permissionForCollaborator
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item),
    createProjectWithPromisefication: projectName =>
      dispatch(createProjectWithPromisefication(projectName)),
    createFunnelWithPromisefication: (funnelName, id) =>
      dispatch(createFunnelWithPromisefication(funnelName, id)),
    signOutUser: () => dispatch(signOutUser()),
    updateProjectsBySearch: updatedProjects =>
      dispatch(updateProjectsBySearch(updatedProjects)),
    getAllProjects: () => dispatch(getAllProjects()),
    setPermission: item1 => dispatch(setPermission(item1)),
    getAllOwners: () => dispatch(getAllOwners()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

//fuck yeah
const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "header-select header-display-block"
    : "header-select header-display-none";

  return (
    <div className={showHideClassName}>
      <section className="header-select-main">{children}</section>
    </div>
  );
};
