import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { addCollaborator } from '../../../../store/actions/collaborations'
import logo from '../../../../assets/Logo_invert.png'
import { ReactComponent as CollaborateSVG } from '../../../../assets/collaborate.svg';
import BodyWidget from "../../../diagram/storm/Components/BodyWidget";
import Application from "../../../diagram/storm/Application";
import {
  getDiagram,
  getSVG,
  showAnalyticsBoolean,
  setPermission,
  getConversationInfoWithPromisefication,
  getConversionInfoForAllNodes,
  changeKeyDown,
} from '../../../../store/actions/projects'
import { hideConversionLink } from "../../../../store/actions/conversion";
import { updateModel } from "../../../../store/actions/undo";
import "storm-react-diagrams/dist/style.min.css";
import './AddCollaboratorsImage.css'
import "../../../diagram/storm/index.css";

class AddCollaboratorsImage extends React.Component {

  state = {
    navigate: false,
    referrer: null,
    snackMsg: 'prev',
  };

  componentDidMount() {
    let params = new URLSearchParams(window.location.search);

    this.props.getDiagram( params.get('funnelId') );
    this.props.getSVG();

    this.props.setPermission('View');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.diagram) {
      if (
        prevProps.diagram.snackMsg !== this.state.snackMsg &&
        prevProps.diagram.snackMsg !== undefined
      ) {
        this.props.getDiagram(this.props.funnelId);
      }
    }
    else return null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.diagram)
      if (
        nextProps.diagram.snackMsg !== prevState.snackMsg
      )
        return {
          diagram: nextProps.model ? nextProps.model : nextProps.diagram.converted,
          snackMsg: 'next',
        };
      else
        return {
          diagram: nextProps.model ? nextProps.model : nextProps.diagram.converted,
          snackMsg: 'prev',
        };
    else return null
  }

  redirectToAddCollaborators = () => {
    let params = new URLSearchParams(window.location.search);
    this.setState({ referrer: `/add-collaborators/${params.get('add-collaborators-image')}` });
  }

  render() {
    const app = new Application(
      this.state.diagram,
      this.props.svg,
    );

    // let params = new URLSearchParams(window.location.search);


    const { referrer } = this.state;
    if (referrer) return <Redirect to={referrer} />;

    return (
      <div className='add-collaborators-img-body'>

        <BodyWidget app={app} work={this.props} addCollaborators />

        {/* <img className='add-collaborators-img-image' src={'http://' + params.get('image')} alt='img' /> */}

        <div className='add-collaborators-img-right-panel-wrapper'>
          <div className='add-collaborators-img-right-panel'>
            <img className='signin-logo' src={logo} alt='logo' />
            <p className='add-collaborators-img-text-first'>The Following Funnel Has <br /> Been Shared with You</p>
            <CollaborateSVG />
            <p className='add-collaborators-img-text-second'>Click below to add to this funnel to <br /> your dashboard</p>
            <button className="btn btn-1" onClick={() => this.redirectToAddCollaborators()}>Add to My Dashboard</button>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let params = new URLSearchParams(window.location.search);

  return {
    router: state.router,
    tokenCollaborator: ownProps.match.params.token,
    error: state.collaborations.addCollaboratorError,
    diagram: state.projects[`diagram${params.get('funnelId')}`],
    model: state.history.present[`model${params.get('funnelId')}`],
    svg: state.projects.svgList,
    funnelId: params.get('funnelId'),
    message: state.projects.saveDiagramMessage,
    createTemplateMessage: state.projects.createTemplateMessage,
    link: state.projects.sendImageToCollaborateLink,
    pathname: state.router.location.pathname,
    changeFunnelNameMessage: state.projects.changeFunnelNameMessage,
    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,
    showSettingsWidgetEngine: state.projects.showSettingsWidgetEngine,
    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,
    showNotesWidgetEngine: state.projects.showNotesWidgetEngine,
    showTypeOfNode: state.projects.showTypeOfNode,
    UTMLinkMessage: state.projects.createUTMLinkMessage,
    permissionForCollaborator: state.projects.permissionForCollaborator,
    ownersList: state.users.ownersList,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addCollaborator: id => dispatch(addCollaborator(id)),
    updateModel: (model, funnelId) => dispatch(updateModel(model, funnelId)),
    getSVG: () => dispatch(getSVG()),
    getDiagram: id => dispatch(getDiagram(id)),
    showAnalyticsBoolean: boolean => dispatch(showAnalyticsBoolean(boolean)),
    changeKeyDown: key => dispatch(changeKeyDown(key)),
    getConversationInfoWithPromisefication: (item1, item2) => dispatch(getConversationInfoWithPromisefication(item1, item2)),
    dispatch: item => dispatch(item),
    setPermission: item1 => dispatch(setPermission(item1)),
    getConversionInfoForAllNodes: funnelId => dispatch(getConversionInfoForAllNodes(funnelId)),
    hideConversionLink: boolean => dispatch(hideConversionLink(boolean)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCollaboratorsImage);
