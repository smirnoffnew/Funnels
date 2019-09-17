import React, { Component } from "react";
import { connect } from "react-redux";
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
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    messageCreateProject: state.projects.createNewProjectWithTemplateMessage
  };
};

const mapDispatchToState = dispatch => ({
  deleteTemplate: funnelId => dispatch(deleteTemplate(funnelId)),
  createNewProjectWithTemplate: (id, name, projectId) =>
    dispatch(createNewProjectWithTemplate(id, name, projectId))
});

export default connect(
  mapStateToProps,
  mapDispatchToState
)(TemplateItemContainer);
