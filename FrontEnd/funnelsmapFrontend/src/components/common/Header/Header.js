import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  createProjectWithPromisefication,
  createFunnelWithPromisefication,
  updateProjectsBySearch,
  getAllProjects
} from "../../../store/actions/projects";
import { signOutUser } from "../../../store/actions/auth";
import Modal from "../Modal/Modal";
import { API_URL } from "../../../config";
import ClickOutside from "../ClickOutside";
import { ReactComponent as SearchSVG } from "../../../assets/search.svg";
import { ReactComponent as QuestionSVG } from "../../../assets/question-mark.svg";
import "./header.css";

class Header extends Component {
  state = {
    show: false,
    showFunnel: false,
    showSignOut: false,
    projectName: "",
    funnelName: "",
    searchProject: ""
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false, projectName: "" });
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
    this.props
      .createProjectWithPromisefication(this.state.projectName)
      .then(response => {
        this.props.dispatch({
          type: "CREATE_PROJECT",
          payload: response.data
        });
        this.props.dispatch({ type: "CLEAR_CREATE_PROJECT_ERROR" });
        this.hideModal();
        this.props.dispatch(push("/"));
      })
      .catch(error => {
        this.props.dispatch({
          type: "CREATE_PROJECT_FAILURE",
          payload: error
        });
      });
  };

  handleCreateFunnel = () => {
    this.props
      .createFunnelWithPromisefication(
        this.state.funnelName,
        this.props.projectId
      )
      .then(response => {
        let res = response.data;
        let projectId = this.props.projectId;
        this.props.dispatch({
          type: "CREATE_FUNNEL",
          payload: {
            projectId,
            res
          }
        });
        this.props.dispatch({ type: "CLEAR_CREATE_FUNNEL_ERROR" });
        this.hideModalFunnel();
      })
      .catch(error => {
        this.props.dispatch({
          type: "CREATE_FUNNEL_FAILURE",
          payload: error
        });
      });
  };

  static getDerivedStateFromProps(nextProps) {
    // console.log(nextProps)
    if (nextProps.projects)
      return {
        projectsFromNextProps: nextProps.projects
      };
    else return null;
  }

  filterList = e => {
    this.setState(
      {
        searchProject: e.target.value
      },
      () => {
        let updatedList =
          this.state.projectsFromNextProps &&
          this.state.projectsFromNextProps.filter(item => {
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
    }, 700);
  };

  render() {
    const userAvatar = JSON.parse(localStorage.getItem("userAvatar"));
    const userFirstName = localStorage.getItem("userFirstName");

    if (this.props.error && this.props.error.length > 0) {
      console.log(this.props.error);
    }

    return (
      <>
        <header>
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

                {this.props.pathname.includes("funnels") ? (
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
                )}

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
                  {userAvatar === API_URL ? (
                    <div className="header-preview-empty">
                      {userFirstName[0] && userFirstName[0].toUpperCase()}
                    </div>
                  ) : (
                    <img src={userAvatar} alt="Avatar" />
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
          {this.props.error && this.props.error.length > 0 && (
            <div className={`input-group`}>{this.props.error}</div>
          )}

          <button
            className="btn btn-1 create-project-button-in-modal"
            onClick={() => this.handleCreateProject()}
          >
            Create Project
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
          {this.props.errorFunnel && this.props.errorFunnel.length > 0 && (
            <div className={`input-group`}>{this.props.errorFunnel}</div>
          )}

          <button
            className="btn btn-1 create-project-button-in-modal"
            onClick={() => this.handleCreateFunnel()}
          >
            Create Funnel
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
            {/* <p 
            className='text-settings-payment' 
            style={{
              display: 'flex',
              paddingLeft: '15px',
              marginBottom: '10px',
              borderTop: '1px solid rgb(220, 229, 236)',
              paddingTop: '15px',
            }}
            ><span style={{ color: '#fd8f21', marginRight: 8 }}>✓</span>Funnelsmap UI/UX design</p>
            <p className='text-settings-payment' style={{ display: 'flex', marginLeft: 15 }}><li style={{ color: '#ea4e9d' }}></li>MOSKALOW</p>
            <p className='text-settings-payment' style={{ display: 'flex', marginLeft: 15, marginBottom: 25, marginTop: 10 }}><li style={{ color: '#4186e0' }}></li>TRIOLUX</p> */}

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
    authenticated: state.auth.authenticated,
    error: state.projects.createProjectError,
    errorFunnel: state.projects.createFunnelError,
    projectId: state.router.location.pathname.substring(9), // get projectId from pathname
    pathname: state.router.location.pathname,
    projects: state.projects.projectsList
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
    getAllProjects: () => dispatch(getAllProjects())
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
