import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../../common/Layout/Layout";
import { getAllFunnelsCollaboration } from "../../../store/actions/collaborations";
import FunnelItemContainer from "../funnels/FunnelItemContainer";
import '../index.css'

class Collaborations extends Component {
  componentDidMount = () => {
    this.props.getAllFunnelsCollaboration();
  };

  render() {

    return (
      <Layout title="Collaborations">
        <div className="projects-wrapper">
          {this.props.data && this.props.data.length > 0 ? (
            this.props.data.map((funnel, index) => (
              <FunnelItemContainer
                key={index}
                _id={funnel._id}
                funnelName={funnel.funnelName}
                projectId={funnel.funnelProject}
                backgroundImg={funnel.funnelBackground}
                collaborators={funnel.collaborators}
              />
            ))
          ) : (
            <div className="create-funnels">No Funnels Collaboration.</div>
          )}
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state', state)
  return {
    data: state.collaborations.funnelsCollaborationsList,
    error: state.collaborations.funnelsCollaborationsListError
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAllFunnelsCollaboration: () => dispatch(getAllFunnelsCollaboration())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collaborations);
