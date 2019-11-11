import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import TemplateItem from "./TemplateItem.jsx";
import {
  deleteTemplate,
  createNewProjectWithTemplate
} from "../../../store/actions/projects";

class TemplateItemContainer extends Component {
  handleDelete = funnelId => {
    this.props.deleteTemplate(funnelId);
  };

  createNewProjectWithTemplate = (id, projectName, projectId) => {
    this.props.createNewProjectWithTemplate(id, projectName, projectId);
  };

  render() {
    const { _id, funnelName, projectId, funnelBody } = this.props;
    return (
      <TemplateItem
        _id={_id}
        funnelName={funnelName}
        funnelBody={funnelBody}
        projectId={projectId}
        handleDelete={this.handleDelete}
        createNewProjectWithTemplate={this.createNewProjectWithTemplate}
        messageCreateProject={this.props.messageCreateProject}
        permissionForCollaborator={this.props.permissionForCollaborator}
        clearHistory={this.props.clearHistory}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    messageCreateProject: state.projects.createNewProjectWithTemplateMessage,
    permissionForCollaborator: state.projects.permissionForCollaborator,
  };
};

const mapDispatchToState = dispatch => ({
  clearHistory: () => dispatch(UndoActionCreators.clearHistory()),
  deleteTemplate: funnelId => dispatch(deleteTemplate(funnelId)),
  createNewProjectWithTemplate: (id, name, projectId) =>
    dispatch(createNewProjectWithTemplate(id, name, projectId))
});

export default connect(
  mapStateToProps,
  mapDispatchToState
)(TemplateItemContainer);
