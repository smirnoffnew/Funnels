import React, { Component } from "react";
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from "react-redux";
import FunnelItem from "./FunnelItem.jsx";
import { deleteFunnel, setPermission } from "../../../store/actions/projects";

class FunnelItemContainer extends Component {

  handleDelete = (projectId, funnelId) => {
    this.props.deleteFunnel(projectId, funnelId);
  };

  render() {
    const {
      _id,
      funnelName,
      projectId,
      funnelBody,
      backgroundImg,
      collaborators
    } = this.props;

    localStorage.setItem('permission', JSON.stringify(collaborators));

    return (
      <FunnelItem
        _id={_id}
        funnelName={funnelName}
        funnelBody={funnelBody}
        projectId={projectId}
        handleDelete={this.handleDelete}
        backgroundImg={backgroundImg}
        permissionForCollaborator={this.props.permissionForCollaborator}
        pathname={this.props.pathname}
        clearHistory={this.props.clearHistory}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    pathname: state.router.location.pathname,
    permissionForCollaborator: state.projects.permissionForCollaborator,
  };
};

const mapDispatchToState = dispatch => ({
  clearHistory: () => dispatch(UndoActionCreators.clearHistory()),
  setPermission: item1 => dispatch(setPermission(item1)),
  deleteFunnel: (projectId, funnelId) =>
    dispatch(deleteFunnel(projectId, funnelId))
});

export default connect(
  mapStateToProps,
  mapDispatchToState
)(FunnelItemContainer);
