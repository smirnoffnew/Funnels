import React from "react";
import { connect } from "react-redux";
import { addCollaborator } from "../../../../store/actions/collaborations";
import "../../index.css";
import MenuItem from "../../../common/SideNav/Menu/MenuItem";
import { ReactComponent as ProjectSVG } from '../../../../assets/Projects.svg';

class AddCollaborators extends React.Component {
  componentDidMount() {
    this.props.addCollaborator(this.props.tokenCollaborator);
  }

  render() {
    return (
      <>
        {this.props.error && this.props.error.length > 0 ? (
          <p className="create-funnels">
            {this.props.error}
            <div style={{ background: '#212939' }}>
              <MenuItem exact={true} to="/projects" name="Go Back To Projects" icon={<ProjectSVG />} />
            </div>
          </p>
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
