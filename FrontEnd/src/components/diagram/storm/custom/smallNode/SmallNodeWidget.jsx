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
import { DevelopmentStage } from "../../../../common/DevelopmentStage/DevelopmentStage";
import { openLinkOnNewTab } from "../../utils";
import { NotesStatusIconGroup } from "../../../../common/NotesStatus/NotesStatus";
import { setConversionCompound } from "../../../../../store/actions/conversion";
import { updateModel } from "../../../../../store/actions/undo";

const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";

  return (
    <div className={showHideClassName}>
      <section className="select-main-modal-node-widget-horizontally up-arrow-horizontally ">
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
      <section className="select-analytics-widget-horizontally up-arrow-analytics-horizontally">
        {children}
      </section>
    </div>
  );
};

class SmallNodeWidget extends React.Component {
  state = {
    show: false,
    handleGridTwo: false,
  };

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
      : 0;
  }

  handleClickOnWidget = () => {
    if (
      this.props.keyDown === "Alt" &&
      this.props.engine.diagramModel.nodes[this.props.node.id].extras.sourceLink
    ) {
      openLinkOnNewTab(
        this.props.engine.diagramModel.nodes[this.props.node.id].extras.sourceLink,
        this.props.changeKeyDown("")
      )
    }
  }

  render() {
    console.log('this', this)
    return (
      <>
        <div className="small-node-title">
          {this.props.node.extras.named
            ? this.props.node.extras.named
            : this.props.node.type}
        </div>

        <div
          style={{
            position: "relative",
            height: 53,
            width: 155,
            borderRadius: 7,
            zIndex: 10
          }}
          // onMouseEnter={this.showModal}
          // onMouseLeave={this.hideModal}
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

          {
            !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ?
              <div
                className="small-area-for-hover"
                onMouseEnter={this.showModal}
                onMouseLeave={this.hideModal}
                onMouseMove={this.mouseMove}
                onClick={this.handleClickOnWidget}
              />
              : null
          }

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false })
            }}
            onMouseEnter={this.showModal}
            onMouseLeave={this.hideModal}
          >
            {this.props.showAnalyticsBoolean ? (
              <SelectAnalytics show={true}>
                <>
                  <div className="analytics-box-horizontally" >
                    <p className="left-anal">Clicks:</p>
                    <div className="right-anal">
                      {this.props.conversionInfoForAllNodes &&
                        this.getCounterUrl(
                          this.props.conversionInfoForAllNodes,
                          this.props.node.id
                        )}
                    </div>
                  </div>

                  <div style={{ display: 'none' }} >
                    <PortWidget name="activeOnPage" node={this.props.node} />
                    <PortWidget name="conversionDefault" node={this.props.node} />
                    <PortWidget name="conversion1" node={this.props.node} />
                    <PortWidget name="conversion2" node={this.props.node} />
                    <PortWidget name="conversion3" node={this.props.node} />
                  </div>

                </>
              </SelectAnalytics>
            ) : (
                <Select
                  show={
                    this.props.permissionForCollaborator.includes("Edit")
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
                        "small"
                      )
                    }
                    title={"Settings"}
                  >
                    <SettingsSVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    style={{
                      paddingTop:
                        this.props.node.extras.notesd &&
                        this.props.node.extras.notesd.length !== 0 && 0,
                      width:
                        this.props.node.extras.notesd &&
                        this.props.node.extras.notesd.length !== 0 && 27,
                      height:
                        this.props.node.extras.notesd &&
                        this.props.node.extras.notesd.length !== 0 && 28
                    }}
                    onClick={() =>
                      showRightModal(
                        this.props.diagram.funnelName,
                        this.props.diagram.funnelNotes,
                        this.props.saveDiagramThenShowOrHideNotesModal,
                        this.props.funnelId,
                        this.props.engine,
                        this.props.node,
                      )
                    }
                    title={"Notes"}
                  >
                    {this.props.node.extras.notesd &&
                      this.props.node.extras.notesd.length !== 0 ?
                      <NotesStatusIconGroup /> : <NotesSVG />
                    }
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
                        this.props.node,
                        this.props.updateModel,
                      )
                    }
                    title={"Copy"}
                  >
                    <CopySVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() =>
                      deleteNode(
                        this.props.engine,
                        this.props.funnelId,
                        this.props.node.id,
                        this.props.updateModel,
                      )
                    }
                    title={"Delete"}
                  >
                    <DeleteSVG />
                  </button>
                  <button
                    className="btn-select-widget"
                    onClick={() => deleteAllLinks(
                      this.props.engine,
                      this.props.funnelId,
                      this.props.updateModel,
                    )}
                    title={"Delete All Links"}
                  >
                    <DeleteAllLinksSVG />
                  </button>
                </Select>
              )}
          </ClickOutside>

          <div
            className="small-model-wrapper"
            style={{
              boxShadow: `0 0 28px ${
                this.props.node.selected ? "#30d5c8" : "#F6F7F8"
                }`
            }}
          >
            <div style={{ padding: 5, width: 40, height: 40 }}>
              <ReactSVG
                src={this.props.svg}
                beforeInjection={svg => {
                  svg.setAttribute("style", "width: 40px; height: 40px;");
                }}
              />
            </div>
            <div className="small-model-text-wrapper">
              <p className="small-model-text">{this.props.node.type}</p>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -8,
              left: 143
            }}
          >
            <DevelopmentStage
              status={
                this.props.node.extras &&
                this.props.node.extras.status &&
                this.props.node.extras.status
              }
            />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 19,
              left: -15,
            }}
          >
            <PortWidget name="left" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -14,
              left: 75,
            }}
          >
            <PortWidget name="top" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 19,
              left: 152,
            }}
          >
            <PortWidget name="right" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 49,
              left: 75,
            }}
          >
            <PortWidget name="bottom" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              bottom: '-115%',
              transform: 'translate(-50%, 50%)',
              left: '53%',
              opacity: this.props.hideConversionLinkBoolean ? 1 : 0,
              background: 'rgba(25,25,255, 0.5)',
              borderRadius: '50%'
            }}
            onMouseDown={() => {
              const id = this.props.node.id
              this.setState({
                advancedConversion: {
                  id,
                  type: 'utm',
                  portId: this.props.node.ports.clickOnLink.id
                }
              }, () => {
                this.props.setConversionCompound(this.state.advancedConversion)
              })
            }}
          >
            <PortWidget name="clickOnLink" node={this.props.node} />
          </div>

          <div style={{ display: 'none' }} >
            <PortWidget name="activeOnPage" node={this.props.node} />
            <PortWidget name="conversionDefault" node={this.props.node} />
            <PortWidget name="conversion1" node={this.props.node} />
            <PortWidget name="conversion2" node={this.props.node} />
            <PortWidget name="conversion3" node={this.props.node} />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    diagram:
      state.projects[`diagram${state.router.location.pathname.substring(9)}`],
    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,

    showSettingsWidgetEngine: state.projects.showSettingsWidgetEngine,

    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,

    funnelId: state.router.location.pathname.substring(9),
    svgList: state.projects.svgList,

    showAnalyticsBoolean: state.projects.showAnalyticsBoolean,
    permissionForCollaborator: state.projects.permissionForCollaborator,

    conversionInfoForAllNodes: state.projects.conversionInfoForAllNodes,

    keyDown: state.projects.keyDown,
    hideConversionLinkBoolean: state.conversion.hideConversionLinkBoolean,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateModel: (model, funnelId) => dispatch(updateModel(model, funnelId)),
    setConversionCompound: advancedConversion => dispatch(setConversionCompound(advancedConversion)),
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
)(SmallNodeWidget);
