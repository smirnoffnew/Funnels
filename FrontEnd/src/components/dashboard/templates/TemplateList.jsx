import React from "react";
import { connect } from "react-redux";
import Layout from "../../common/Layout/Layout";
import { getAllTemplates, setPermission } from "../../../store/actions/projects";
import TemplateItemContainer from "./TemplateItemContainer.jsx";
import '../index.css'

class TemplateList extends React.Component {
  componentDidMount() {
    this.props.getAllTemplates();
  }

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
      <>
        <Layout title={`Templates List`}>
          <div className="projects-wrapper">
            {this.props.templates && this.props.templates.length > 0 ? (
              this.props.templates.map((funnel, index) => (
                <TemplateItemContainer
                  key={index}
                  _id={funnel._id}
                  funnelName={funnel.templateName}
                  funnelBody={funnel.templateBody}
                  projectId={funnel.templateAuthor}
                />
              ))
            ) : (
              <div className="no-funnels">No Templates</div>
            )}
          </div>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    templates: state.projects.templatesList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllTemplates: () => dispatch(getAllTemplates()),
    setPermission: item1 => dispatch(setPermission(item1)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateList);
