import React from "react";
import { connect } from "react-redux";
import { addCollaborator } from "../../../../store/actions/collaborations";
import "../../index.css";

class AddCollaborators extends React.Component {
  componentDidMount() {
    this.props.addCollaborator(this.props.tokenCollaborator);
  }

  render() {
    return (
      <>
        {this.props.error && this.props.error.length > 0 ? (
          <p className="create-funnels">{this.props.error}</p>
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    tokenCollaborator: ownProps.match.params.token,
    error: state.collaborations.addCollaboratorError
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addCollaborator: id => dispatch(addCollaborator(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCollaborators);
