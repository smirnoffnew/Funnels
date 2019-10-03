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
import { ReactComponent as AddButtonSVG } from "../../../../../assets/AddButton.svg";
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
import { openLinkOnNewTab } from "../../utils";
import { DevelopmentStage } from "../../../../common/DevelopmentStage/DevelopmentStage";
import { NotesStatusIconGroup } from "../../../../common/NotesStatus/NotesStatus";
import { setConversionCompound } from "../../../../../store/actions/conversion";

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
    handleGridTwo: false,

    advancedConversion: {},

    conversion1: 0,
    conversion2: 0,
    conversion3: 0,
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

  getCounterNode(array, value) {
    const obj =
      array &&
      array.filter((arr, i) => {
        return arr.nodeId === value ? arr.counterNode : null;
      });
    return obj[0] && obj[0].counterNode && obj[0].counterNode
      ? obj[0].counterNode
      : 0;
  }

  getConversion = () => {
    return Number.parseInt(
      this.props.conversionInfoForAllNodes &&
      this.getCounterUrl(
        this.props.conversionInfoForAllNodes,
        this.props.node.id
      )
    ) > 0
      ? (
        (Number.parseInt(
          this.props.conversionInfoForAllNodes &&
            this.getCounterNode(
              this.props.conversionInfoForAllNodes,
              this.props.node.id
            )
            ? this.props.conversionInfoForAllNodes &&
            this.getCounterNode(
              this.props.conversionInfoForAllNodes,
              this.props.node.id
            )
            : 0
        ) /
          Number.parseInt(
            this.props.conversionInfoForAllNodes &&
            this.getCounterUrl(
              this.props.conversionInfoForAllNodes,
              this.props.node.id
            )
          )) *
        100
      ).toFixed(2) + "%"
      : "none"
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

  getRevonew = (price, clickNodes) => {
    const revonew = (+price && +clickNodes) ? price * clickNodes : 0
    return revonew + ' $'
  }

  getAdvancedConversion = nameOfAdvancedConversion => {
    if (this.props.conversionInfoForAllNodes) {
      return this.props.node.extras.conversions &&
        this.props.node.extras.conversions.map(item => {
          if (item.to.id === this.props.node.id) {
            if (item.from.type === 'utm') {
              if (item.to.type === nameOfAdvancedConversion) {
                const counterUTMFrom = this.getCounterUrl(
                  this.props.conversionInfoForAllNodes,
                  item.from.id
                )
                const counterPageTo = this.getCounterNode(
                  this.props.conversionInfoForAllNodes,
                  this.props.node.id
                )
                const advancedConversion = (counterPageTo / counterUTMFrom) * 100

                return advancedConversion.toFixed(2) + "%"
              }
              return null
            }
            if (item.from.type === 'pageVisited') {
              if (item.to.type === nameOfAdvancedConversion) {
                const counterPageFrom = this.getCounterNode(
                  this.props.conversionInfoForAllNodes,
                  item.from.id
                )
                const counterPageTo = this.getCounterNode(
                  this.props.conversionInfoForAllNodes,
                  this.props.node.id
                )
                const advancedConversion = counterPageFrom - counterPageTo

                return advancedConversion
              }
              return null
            }
          }
          return null
        })
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
            onClick={this.handleClickOnWidget}
          />

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false });
            }}
            onMouseEnter={this.showModal}
            onMouseLeave={this.hideModal}
          >
            {this.props.showAnalyticsBoolean ? (
              <>
                <SelectAnalytics show={true}>
                  <div style={{
                    display: 'flex'
                  }}>
                    <div>
                      <div
                        className="analytics-box"
                        title={this.props.conversionInfoForAllNodes &&
                          this.getCounterUrl(
                            this.props.conversionInfoForAllNodes,
                            this.props.node.id
                          )}
                      >
                        <div style={{
                          display: 'block'
                        }}>
                          <p className="top-anal">Clicks</p>
                          <p className="bottom-anal">
                            {this.props.conversionInfoForAllNodes &&
                              this.getCounterUrl(
                                this.props.conversionInfoForAllNodes,
                                this.props.node.id
                              )}
                          </p>
                        </div>
                        <div
                          className='conversion-port-on-node'
                          onMouseDown={() => {
                            const id = this.props.node.id
                            this.setState({
                              advancedConversion: {
                                id,
                                type: 'utm'
                              }
                            }, () => {
                              this.props.setConversionCompound(this.state.advancedConversion)
                            })
                          }}
                        >
                          <PortWidget
                            name="clickOnLink"
                            node={this.props.node}
                          />
                        </div>
                      </div>

                      <div
                        className="analytics-box"
                        title={this.props.conversionInfoForAllNodes &&
                          this.getCounterNode(
                            this.props.conversionInfoForAllNodes,
                            this.props.node.id
                          )}
                      >
                        <div style={{
                          display: 'block'
                        }}>
                          <p className="top-anal">Active on page</p>
                          <p className="bottom-anal">
                            {this.props.conversionInfoForAllNodes &&
                              this.getCounterNode(
                                this.props.conversionInfoForAllNodes,
                                this.props.node.id
                              )}
                          </p>
                        </div>
                        <div
                          className='conversion-port-on-node'
                          onMouseDown={() => {
                            const id = this.props.node.id
                            this.setState({
                              advancedConversion: {
                                id,
                                type: 'pageVisited'
                              }
                            }, () => {
                              this.props.setConversionCompound(this.state.advancedConversion)
                            })
                          }}
                        >
                          <PortWidget
                            name="activeOnPage"
                            node={this.props.node}
                          />
                        </div>
                      </div>

                      <div
                        className="analytics-box"
                        style={{ borderBottom: '1px solid #dce5ec' }}
                      >
                        <div style={{
                          display: 'block'
                        }}>
                          <p className="top-anal">Revonew</p>
                          <p className="bottom-anal">
                            {
                              this.props.conversionInfoForAllNodes &&
                              this.getRevonew(
                                +this.props.node.extras.price,
                                this.getCounterNode(
                                  this.props.conversionInfoForAllNodes,
                                  this.props.node.id
                                )
                              )
                            }
                          </p>
                        </div>
                      </div>

                      <div
                        className="analytics-box"
                      // title={"644/22%"}
                      >
                        <div style={{
                          display: 'block'
                        }}>
                          <p className="top-anal">Conversion:</p>
                          <p className="bottom-anal">
                            {this.getConversion()}
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          top: '97px',
                          right: '-5px',
                          cursor: 'pointer'
                        }}
                        title={'add conversion block'}
                      >
                        <AddButtonSVG
                          onClick={() => { }}
                        />
                      </div>
                    </div>

                    <div className='super-conversion-block'>

                      <div className='advanced-conversion-block'>
                        <div className='conversion-wrapper'>
                          <div className='top-anal'>
                            Conversion1:
                          </div>
                          <div className='bottom-anal'>
                            {this.getAdvancedConversion('Conversion1')}
                          </div>
                        </div>
                        <div
                          className='conversion-port'
                          onMouseUp={() => {
                            this.props.node.setConversions &&
                              this.props.node.setConversions(
                                {
                                  from: this.props.advancedConversion,
                                  to: {
                                    id: this.props.node.id,
                                    type: 'Conversion1'
                                  }
                                }
                              )
                          }}
                        >
                          <PortWidget name="conversion1" node={this.props.node} />
                        </div>
                      </div>

                      <div className='advanced-conversion-block'>
                        <div className='conversion-wrapper'>
                          <div className='top-anal'>
                            Conversion2:
                          </div>
                          <div className='bottom-anal'>
                            {this.getAdvancedConversion('Conversion2')}
                          </div>
                        </div>
                        <div
                          className='conversion-port'
                          onMouseUp={() => {
                            this.props.node.setConversions &&
                              this.props.node.setConversions(
                                {
                                  from: this.props.advancedConversion,
                                  to: {
                                    id: this.props.node.id,
                                    type: 'Conversion2'
                                  }
                                }
                              )
                          }}
                        >
                          <PortWidget name="conversion2" node={this.props.node} />
                        </div>
                      </div>

                      <div className='advanced-conversion-block'>
                        <div className='conversion-wrapper'>
                          <div className='top-anal'>
                            Conversion3:
                          </div>
                          <div className='bottom-anal'>
                            {this.getAdvancedConversion('Conversion3')}
                          </div>
                        </div>
                        <div
                          className='conversion-port'
                          onMouseUp={() => {
                            this.props.node.setConversions &&
                              this.props.node.setConversions(
                                {
                                  from: this.props.advancedConversion,
                                  to: {
                                    id: this.props.node.id,
                                    type: 'Conversion3'
                                  }
                                }
                              )
                          }}
                        >
                          <PortWidget name="conversion3" node={this.props.node} />
                        </div>
                      </div>

                      <div style={{ display: 'none' }} >
                        <PortWidget name="top" node={this.props.node} />
                        <PortWidget name="bottom" node={this.props.node} />
                        <PortWidget name="left" node={this.props.node} />
                        <PortWidget name="right" node={this.props.node} />
                      </div>

                    </div>

                  </div>
                </SelectAnalytics>
              </>
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
              top: -8,
              left: 80
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
              top: 55,
              left: -13,
              // opacity: this.props.hideConversionLinkBoolean && '0'
              display: this.props.hideConversionLinkBoolean && 'none'
            }}
          >
            <PortWidget name="left" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: -13,
              left: 38,
              display: this.props.hideConversionLinkBoolean && 'none'
            }}
          >
            <PortWidget name="top" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 55,
              left: 90,
              // opacity: this.props.hideConversionLinkBoolean && '0'
              display: this.props.hideConversionLinkBoolean && 'none'
            }}
          >

            <PortWidget name="right" node={this.props.node} />
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 119,
              left: 38,
              // opacity: this.props.hideConversionLinkBoolean && '0'
              display: this.props.hideConversionLinkBoolean && 'none'
            }}
          >
            <PortWidget name="bottom" node={this.props.node} />
          </div>

          <div
            style={{
              display: 'none'
            }}
          >
            <PortWidget name="conversion1" node={this.props.node} />
            <PortWidget name="conversion2" node={this.props.node} />
            <PortWidget name="conversion3" node={this.props.node} />

            <PortWidget name="clickOnLink" node={this.props.node} />
            <PortWidget name="activeOnPage" node={this.props.node} />


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

    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,

    funnelId: state.router.location.pathname.substring(9),
    svgList: state.projects.svgList,

    showAnalyticsBoolean: state.projects.showAnalyticsBoolean,
    permissionForCollaborator: state.projects.permissionForCollaborator,

    conversionInfoForAllNodes: state.projects.conversionInfoForAllNodes,

    keyDown: state.projects.keyDown,
    hideConversionLinkBoolean: state.conversion.hideConversionLinkBoolean,
    advancedConversion: state.conversion.advancedConversion,
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
)(BigNodeWidget);
