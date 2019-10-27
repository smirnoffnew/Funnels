import React from "react";
import { connect } from "react-redux";
// import { addCollaborator } from "../../../../store/actions/collaborations";
import "../../index.css";
import { addPartner } from "../../../../store/actions/users";

class AddPartner extends React.Component {
  componentDidMount = () => {
    console.log('componentDidMount addPartner')
    this.props.addPartner(this.props.tokenPartner);
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
    tokenPartner: ownProps.match.params.token,
    error: state.users.addPartnerError
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addPartner: id => dispatch(addPartner(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPartner);
