import * as React from "react";
import { connect } from 'react-redux'
import BodyWidget from "./Components/BodyWidget";
import Application from "./Application";
import "storm-react-diagrams/dist/style.min.css";
import "./index.css";
import {
  getDiagram,
  createTemplate,
  saveTemplate,
  getSVG,
  saveDiagramThenCreateTemplate,
  changeFunnelName,
  saveDiagramThenExit,
  saveDiagramThenShowOrHideSettingsModal,
  saveDiagramThenShowOrHideNotesModal,
  saveDiagram,
  getTemplate,
  sendImageToCollaborate,
  resetSendImageToCollaborateLink,
  showAnalyticsBoolean,
  createUTMLinkWithPromisefication,
  setPermission,
  getConversationInfoWithPromisefication,
  getConversionInfoForAllNodes,
  changeKeyDown,
} from '../../../store/actions/projects'
import { hideConversionLink } from "../../../store/actions/conversion";
import { updateModel } from "../../../store/actions/undo";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackMsg: 'prev',
    };
  }

  componentDidMount() {
    this.props.getDiagram(this.props.funnelId);
    this.props.getTemplate(this.props.funnelId);
    this.props.getSVG();

    localStorage.getItem('token2') ?

      localStorage.getItem('permission') &&
      localStorage.getItem('permission') !== 'undefined' ?
      JSON.parse(localStorage.getItem('multiSession')).map(owner => {
      JSON.parse(localStorage.getItem('permission')).map(
        elem =>
          elem.profileId === owner._id &&
          elem.funnelId === this.props.funnelId &&
          this.props.setPermission(elem.permissions)
      )
      })

      :
      
      JSON.parse(localStorage.getItem('multiSession')).map(owner => {
        if (owner.myPartners && `"` + owner.myPartners[0].token + `"` === localStorage.getItem('token2')) {
          this.props.setPermission(owner.myPartners && owner.myPartners[0].permissions)
        }
      })

    :

    localStorage.getItem('permission') &&
    localStorage.getItem('permission') !== 'undefined' &&
    JSON.parse(localStorage.getItem('permission')).map(
      elem =>
        elem.profileId === localStorage.getItem("userID") &&
        elem.funnelId === this.props.funnelId &&
        this.props.setPermission(elem.permissions)
    )

  }

  componentDidUpdate(prevProps) {
    if (prevProps.diagram) {
      if (
        prevProps.diagram.snackMsg !== this.state.snackMsg &&
        prevProps.diagram.snackMsg !== undefined 
      ) {
        this.props.getDiagram(this.props.funnelId);
        this.props.getTemplate(this.props.funnelId);
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

  render() {
    var app = new Application(
      this.state.diagram,
      this.props.svg,
    );
    return (
      <BodyWidget app={app} work={this.props} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    model: state.history.present[`model${ownProps.match.params.funnelId}`],
    diagram: state.projects[`diagram${ownProps.match.params.funnelId}`],
    svg: state.projects.svgList,
    funnelId: ownProps.match.params.funnelId,
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
    updateModel: (model, funnelId) => dispatch(updateModel(model, funnelId)),
    getSVG: () => dispatch(getSVG()),
    saveDiagram: (funnelId, obj, image) => dispatch(saveDiagram(funnelId, obj, image)),
    saveTemplate: (funnelId, obj) => dispatch(saveTemplate(funnelId, obj)),
    getDiagram: id => dispatch(getDiagram(id)),
    getTemplate: id => dispatch(getTemplate(id)),
    createTemplate: (id, name) => dispatch(createTemplate(id, name)),
    sendImageToCollaborate: (id, data) => dispatch(sendImageToCollaborate(id, data)),
    resetSendImageToCollaborateLink: () => dispatch(resetSendImageToCollaborateLink()),
    saveDiagramThenCreateTemplate: (funnelId, diagramObj, image, templateName) => dispatch(saveDiagramThenCreateTemplate(funnelId, diagramObj, image, templateName)),
    changeFunnelName: (funnelId, name) => dispatch(changeFunnelName(funnelId, name)),
    saveDiagramThenExit: (funnelId, diagramObj, image) => dispatch(saveDiagramThenExit(funnelId, diagramObj, image)),


    saveDiagramThenShowOrHideSettingsModal: (id, state, file, boolean, model, engine) =>
      dispatch(saveDiagramThenShowOrHideSettingsModal(id, state, file, boolean, model, engine)),

    saveDiagramThenShowOrHideNotesModal: (id, state, file, boolean, model, engine) =>
      dispatch(saveDiagramThenShowOrHideNotesModal(id, state, file, boolean, model, engine)),

    showAnalyticsBoolean: boolean => dispatch(showAnalyticsBoolean(boolean)),

    changeKeyDown: key => dispatch(changeKeyDown(key)),

    createUTMLinkWithPromisefication: (item1, item2, item3) => dispatch(createUTMLinkWithPromisefication(item1, item2, item3)),
    getConversationInfoWithPromisefication: (item1, item2) => dispatch(getConversationInfoWithPromisefication(item1, item2)),
    dispatch: item => dispatch(item),
    setPermission: item1 => dispatch(setPermission(item1)),
    getConversionInfoForAllNodes: funnelId => dispatch(getConversionInfoForAllNodes(funnelId)),

    hideConversionLink: boolean => dispatch(hideConversionLink(boolean)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);