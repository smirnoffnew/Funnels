import * as React from "react";
import { PortWidget } from "storm-react-diagrams";
import ReactSVG from "react-svg";
import { connect } from "react-redux";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as CopySVG } from "../../../../../assets/selectForWidget/copy.svg";
import { ReactComponent as DeleteAllLinksSVG } from "../../../../../assets/selectForWidget/delete-all-links.svg";
import { ReactComponent as DeleteSVG } from "../../../../../assets/selectForWidget/delete.svg";
import { ReactComponent as NotesSVG } from "../../../../../assets/selectForWidget/notes.svg";
import { ReactComponent as SettingsSVG } from "../../../../../assets/selectForWidget/settings.svg";
import {
  saveDiagramThenShowOrHideSettingsModal,
  saveDiagramThenShowOrHideNotesModal,
  changeKeyDown
} from "../../../../../store/actions/projects";
import {
  cloneSelected,
  deleteNode,
  deleteAllLinks,
  showRightModal
} from "../funcsForCustomNodeWidget";
import "./index.css";
import { getConversion, openLinkOnNewTab } from "../../utils";
import { DevelopmentStage } from "../../../../common/DevelopmentStage/DevelopmentStage";

const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";
  return (
    <div className={showHideClassName}>
      <section className="select-main-modal-node-widget up-arrow">
        {children}
      </section>
    </div>
  );
};

const SelectAnalytics = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";
  return (
    <div className={showHideClassName}>
      <section className="select-analytics-widget up-arrow-analytics">
        {children}
      </section>
    </div>
  );
};

class BigNodeWidget extends React.Component {
  state = {
    show: false,
    handleGridTwo: false
  };

  getDevelopmentStatus(funnelId, nodeId){
    if(this.props.developmentStatus.length !== 0 ){
      let statusAndnodeId = this.props.developmentStatus&&this.props.developmentStatus.find(el => el.nodeId === nodeId)
      this.setState({status: statusAndnodeId?statusAndnodeId.status:"DEFAULT"})
    }
   
  }

  componentDidMount(){
    this.getDevelopmentStatus(this.props.funnelId, this.props.node.id)
  }

  componentDidUpdate(prevProps){
    if(prevProps.showSettingsWidgetBoolean&&!this.props.showSettingsWidgetBoolean){
      if(prevProps.showSettingsWidgetModel.id === prevProps.node.id){
        this.getDevelopmentStatus(this.props.funnelId, this.props.node.id)
      }
    }if(prevProps.developmentStatus !== this.props.developmentStatus){
      this.getDevelopmentStatus(this.props.funnelId, this.props.node.id)
    }
    
  }

  showModal = () => {
    this.setState({
      show: true,
      handleGrid: this.props.diagram && this.props.diagram.handleGrid
    });
  };

  hideModal = () => {
    this.setState({
      show: false,
      handleGridTwo: false
    });
  };

  mouseMove = () => {
    this.state.handleGrid && this.setState({ handleGridTwo: true });
  };

  getCounterUrl(array, value) {
    const obj =
      array &&
      array.filter((arr, i) => {
        return arr.nodeId === value ? arr.counterUrl : null;
      });
    return obj[0] && obj[0].counterUrl && obj[0].counterUrl
      ? obj[0].counterUrl
      : "0 or no utm";
  }

  getCounterNode(array, value) {
    const obj =
      array &&
      array.filter((arr, i) => {
        return arr.nodeId === value ? arr.counterNode : null;
      });
    return obj[0] && obj[0].counterNode && obj[0].counterNode
      ? obj[0].counterNode
      : "0 or no script";
  }

  // searchCurretnNodeAndUrl() {
  //   if (this.props.conversionInfoForAllNodes) {
  //     const ifoForAllNodes = this.props.conversionInfoForAllNodes;
  //     if (ifoForAllNodes.find(el => el.nodeId === this.props.node.id)) {
  //       const countUrl = ifoForAllNodes.find(el => el.nodeId === this.props.node.id).counterUrl || 0;
  //       const countNode = ifoForAllNodes.find(el => el.nodeId === this.props.node.id).counterNode || 0;
  //       return {
  //         countUrl,
  //         countNode
  //       }
  //     }
  //   }
  //   return {
  //     countUrl: 0,
  //     countNode: 0
  //   }
  // }

  // getConversion() {
  //   let Conversion = "0%"
  //   if (this.props.conversionInfoForAllNodes && this.props.conversionInfoForAllNodes[0]&&this.props.funnelLinks!== " ") {
  //     const links = this.props.funnelLinks.filter(element => this.props.node.id === element.target)
  //     const counterUrlmass = this.props.conversionInfoForAllNodes.map(element => {
  //       if (links.find(elem => elem.source === element.nodeId)) {
  //         return element.counterUrl
  //       }
  //       return 0
  //     })
  //     const currentCounterUrl = this.searchCurretnNodeAndUrl().countUrl
  //     const clickCount = counterUrlmass.reduce((accumulator, currentValue) => accumulator + currentValue)+ currentCounterUrl;
  //       let Conversion = clickCount?((this.searchCurretnNodeAndUrl().countNode / clickCount) * 100):0;
  //     return Conversion&&Conversion.toFixed(2) + "%" 
  //   }
  //   return Conversion
  // }

  handleClicOnWidget = () =>  {
    if (this.props.keyDown === "Control"&&this.props.engine.diagramModel.nodes[this.props.node.id].extras.originalUrl) {
      openLinkOnNewTab(this.props.engine.diagramModel.nodes[this.props.node.id].extras.originalUrl, this.props.changeKeyDown(""))
    }
  }

  render() {
    return (
      <>
        <div className="big-node-title">
          {this.props.node.extras.named
            ? this.props.node.extras.named
            : this.props.node.type}
        </div>

        <div
          style={{
            position: "relative",
            height: 122,
            width: 92,
            borderRadius: 7,
            zIndex: 10
          }}
          onMouseEnter={this.showModal}
          onMouseLeave={this.hideModal}
          title={
            this.props.node.extras.named
              ? this.props.node.extras.named
              : this.props.node.type
          }
        >
          {this.state.handleGridTwo ? (
            <>
              <div className="left-line" />
              <div className="right-line" />
              <div className="top-line" />
              <div className="bottom-line" />
            </>
          ) : null}

          <div
            className="big-area-for-hover"
            onMouseEnter={this.showModal}
            onMouseLeave={this.hideModal}
            onMouseMove={this.mouseMove}
            onClick={this.handleClicOnWidget}
          />

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false });
            }}
            onMouseEnter={this.showModal}
            onMouseLeave={this.hideModal}
          >
            {this.props.showAnalyticsBoolean ? (
              <SelectAnalytics show={true}>
                <>
                  <div
                    className="analytics-box"
                    title={this.props.conversionInfoForAllNodes &&
                      this.getCounterUrl(
                        this.props.conversionInfoForAllNodes,
                        this.props.node.id
                      )}
                  >
                    <p className="top-anal">Clicks:</p>
                    <p className="bottom-anal">
                      {this.props.conversionInfoForAllNodes &&
                        this.getCounterUrl(
                          this.props.conversionInfoForAllNodes,
                          this.props.node.id
                        )}
                    </p>
                  </div>
                  <div
                    className="analytics-box"
                    title={this.props.conversionInfoForAllNodes &&
                      this.getCounterNode(
                        this.props.conversionInfoForAllNodes,
                        this.props.node.id
                      )}
                  >
                    <p className="top-anal">Active on page:</p>
                    <p className="bottom-anal">
                      {this.props.conversionInfoForAllNodes &&
                        this.getCounterNode(
                          this.props.conversionInfoForAllNodes,
                          this.props.node.id
                        )}
                    </p>
                  </div>
                  <div
                    className="analytics-box"
                  // title={"644/22%"}
                  >
                    <p className="top-anal">Conversion:</p>
                    <p className="bottom-anal">
                      {getConversion(this.props.conversionInfoForAllNodes, this.props.funnelLinks, this.props.node.id)}
                    </p>
                  </div>
                </>
              </SelectAnalytics>
            ) : (
                <Select
                  show={
                    this.props.permissionForCollaborator === "Edit"
                      ? this.state.show
                      : false
                  }
                >
                  <button
                    className="btn-select-widget"
                    onClick={() =>
                      showRightModal(
                        this.props.diagram.funnelName,
                        this.props.diagram.funnelNotes,
                        this.props.saveDiagramThenShowOrHideSettingsModal,
                        this.props.funnelId,
                        this.props.engine,
                        this.props.node,
                        "big"
                      )
                    }
                    title={"Settings"}
                  >
                    <SettingsSVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() =>
                      showRightModal(
                        this.props.diagram.funnelName,
                        this.props.diagram.funnelNotes,
                        this.props.saveDiagramThenShowOrHideNotesModal,
                        this.props.funnelId,
                        this.props.engine,
                        this.props.node
                      )
                    }
                    title={"Notes"}
                  >
                    <NotesSVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() =>
                      cloneSelected(
                        this.props.diagram.funnelName,
                        this.props.diagram.funnelNotes,
                        this.props.engine,
                        this.props.saveDiagramThenShowOrHideSettingsModal,
                        this.props.funnelId,
                        this.props.node
                      )
                    }
                    title={"Copy"}
                  >
                    <CopySVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() =>
                      deleteNode(this.props.funnelId, this.props.node.id)
                    }
                    title={"Delete"}
                  >
                    <DeleteSVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() => deleteAllLinks(this.props.engine)}
                    title={"Delete All Links"}
                  >
                    <DeleteAllLinksSVG />
                  </button>
                </Select>
              )}
          </ClickOutside>

          <ReactSVG
            src={this.props.svg}
            beforeInjection={svg => {
              svg.setAttribute(
                "style",
                `box-shadow: 0 0 28px ${
                this.props.node.extras.goald
                  ? "#fd8f21"
                  : null || this.props.node.extras.triggerd
                    ? "#5ab5ff"
                    : null
                }`
              );
            }}
          />

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 55,
              left: -13
            }}
          >
            <PortWidget name="left" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -13,
              left: 38
            }}
          >
            <PortWidget name="top" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -8,
              left: 80
            }}
          >
            <DevelopmentStage status={this.state.status} />
          </div>
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 55,
              left: 90
            }}
          >

            <PortWidget name="right" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 119,
              left: 38
            }}
          >
            <PortWidget name="bottom" node={this.props.node} />
          </div>
        </div>
      </>
    );
  }
}

const getLinks = (state) => {
  if (state.projects[`diagram${state.router.location.pathname.substring(9)}`]) {
    const body = state.projects[`diagram${state.router.location.pathname.substring(9)}`];
    const Links = body.converted && JSON.parse(body.converted).links;
    return Links || " "
  }
  return " "
}

const mapStateToProps = state => {
  return {
    diagram:
      state.projects[`diagram${state.router.location.pathname.substring(9)}`],

    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,

    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,

    funnelId: state.router.location.pathname.substring(9),
    funnelLinks: getLinks(state),
    svgList: state.projects.svgList,

    showAnalyticsBoolean: state.projects.showAnalyticsBoolean,
    permissionForCollaborator: state.projects.permissionForCollaborator,

    conversionInfoForAllNodes: state.projects.conversionInfoForAllNodes,
    developmentStatus: state.developmentStages.stages,

    keyDown: state.projects.keyDown,
  };
};

const mapDispatchToProps = dispatch => {
  return {

    changeKeyDown: key => dispatch(changeKeyDown(key)),
    saveDiagramThenShowOrHideSettingsModal: (
      id,
      state,
      file,
      boolean,
      model,
      engine,
      typeOfNode
    ) =>
      dispatch(
        saveDiagramThenShowOrHideSettingsModal(
          id,
          state,
          file,
          boolean,
          model,
          engine,
          typeOfNode
        )
      ),

    saveDiagramThenShowOrHideNotesModal: (
      id,
      state,
      file,
      boolean,
      model,
      engine
    ) =>
      dispatch(
        saveDiagramThenShowOrHideNotesModal(
          id,
          state,
          file,
          boolean,
          model,
          engine
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigNodeWidget);
