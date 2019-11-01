import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../../common/Layout/Layout";
import { getAllFunnelsCollaboration } from "../../../store/actions/collaborations";
import FunnelItemContainer from "../funnels/FunnelItemContainer";
import '../index.css'
import { setPermission } from "../../../store/actions/projects";

class Collaborations extends Component {
  componentDidMount = () => {
    this.props.getAllFunnelsCollaboration();
  };

  render() {
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
            <div className="no-funnels">No Funnels Collaboration</div>
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
    setPermission: item1 => dispatch(setPermission(item1)),
    getAllFunnelsCollaboration: () => dispatch(getAllFunnelsCollaboration())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collaborations);
