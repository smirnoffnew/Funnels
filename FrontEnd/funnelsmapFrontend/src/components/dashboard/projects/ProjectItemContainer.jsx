import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectItem from './ProjectItem';
import { deleteProjectByUserId } from '../../../store/actions/projects'

class ProjectItemContainer extends Component {
  handleDelete = id => {
    this.props.deleteProjectByUserId(id)
  }

  render() {
    const { _id, projectName, funnelsLength } = this.props;
    return (
      <ProjectItem
        _id={_id}
        projectName={projectName}
        funnelsLength={funnelsLength}
        handleDelete={this.handleDelete}
      />
    );
  }
}

const mapDispatchToState = dispatch => ({
  deleteProjectByUserId: id => dispatch(deleteProjectByUserId(id)),
});

export default connect(null, mapDispatchToState)(ProjectItemContainer);
