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
} from '../../../store/actions/projects'

import { getAllDevelopmentStages, changeStatusOfNode } from '../../../store/actions/developmentStages'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackMsg: 'prev',
      developmentStatus: "DEFAULT"
    };
  }

  componentDidMount() {
    this.props.getAllDevelopmentStages(this.props.funnelId);
    this.props.getDiagram(this.props.funnelId);
    this.props.getTemplate(this.props.funnelId);
    this.props.getSVG();

    localStorage.getItem('permission') &&
      localStorage.getItem('permission') !== 'undefined' ?
      JSON.parse(localStorage.getItem('permission')).map(
        elem =>
          elem.profileId === localStorage.getItem("userID") &&
          elem.funnelId === this.props.funnelId &&
          this.props.setPermission(elem.permissions)
      )
      : this.props.setPermission("Edit")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.diagram) {
      if (prevProps.diagram.snackMsg !== this.state.snackMsg && prevProps.diagram.snackMsg !== undefined) {
        this.props.getDiagram(this.props.funnelId);
        this.props.getTemplate(this.props.funnelId);

        localStorage.getItem('permission') &&
          localStorage.getItem('permission') !== 'undefined' ?
          JSON.parse(localStorage.getItem('permission')).map(
            elem =>
              elem.profileId === localStorage.getItem("userID") &&
              elem.funnelId === this.props.funnelId &&
              this.props.setPermission(elem.permissions)
          )
          : this.props.setPermission("Edit")
      }
    }
    if (((!prevProps.showSettingsWidgetBoolean && this.props.showSettingsWidgetBoolean) && this.props.showSettingsWidgetModel) && this.props.developmentStatus.length !== 0) {
      let statusAndnodeId = this.props.developmentStatus && this.props.developmentStatus.find(el => el.nodeId === this.props.showSettingsWidgetModel.id)
      this.setState({
        statusAndnodeId: { 
          status: statusAndnodeId ? statusAndnodeId.status : "DEFAULT" ,
          nodeId: statusAndnodeId ? statusAndnodeId.nodeId : "non"
        }
      })
    }
    else return null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.diagram)
      if (nextProps.diagram.snackMsg !== prevState.snackMsg)
        return {
          diagram: nextProps.diagram.converted,
          snackMsg: 'next',
        };
      else
        return {
          snackMsg: 'prev',
        };
    else return null
  }

  render() {
    var app = new Application(
      this.state.diagram && this.state.diagram,
      this.props.svg && this.props.svg,
    );
    return (
      <BodyWidget app={app} work={this.props}
        developmentStatus={this.state.statusAndnodeId}
        changeStatusOfNode={this.props.changeStatusOfNode}

      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  // console.log('diagram', state.projects[`diagram${ownProps.match.params.funnelId}`])
  return {
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
    developmentStatus: state.developmentStages.stages
  };
}

const mapDispatchToProps = dispatch => {
  return {
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

    createUTMLinkWithPromisefication: (item1, item2, item3) => dispatch(createUTMLinkWithPromisefication(item1, item2, item3)),
    getConversationInfoWithPromisefication: (item1, item2) => dispatch(getConversationInfoWithPromisefication(item1, item2)),
    dispatch: item => dispatch(item),
    setPermission: item1 => dispatch(setPermission(item1)),
    getConversionInfoForAllNodes: funnelId => dispatch(getConversionInfoForAllNodes(funnelId)),
    getAllDevelopmentStages: funnelId => dispatch(getAllDevelopmentStages(funnelId)),
    changeStatusOfNode: (item1, item2, item3) => dispatch(changeStatusOfNode(item1, item2, item3))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);