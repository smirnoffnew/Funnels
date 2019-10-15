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
import { openLinkOnNewTab, isEmpty, /*isEmpty*/ } from "../../utils";
import { DevelopmentStage } from "../../../../common/DevelopmentStage/DevelopmentStage";
import { NotesStatusIconGroup } from "../../../../common/NotesStatus/NotesStatus";
import { setConversionCompound } from "../../../../../store/actions/conversion";
// import ModalPortal from "../../../../common/ModalPortal/ModalPortal";
import AdvancedConversion, { getAdvancedConversion } from "../AdvancedConversion/AdvancedConversion";

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

const SelectAnalyticsRight = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";

  return (
    <div className={showHideClassName}>
      <section
        className={
          'select-analytics-widget up-arrow-analytics'
        }
      >
        {children}
      </section>
    </div>
  );
};

const SelectAnalyticsLeft = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";

  return (
    <div className={showHideClassName}>
      <section
        className={
          'select-analytics-widget up-arrow-analytics-reverse'
        }
        style={{
          left: -140
        }}
      >
        {children}
      </section>
    </div>
  );
};

class BigNodeWidget extends React.Component {
  state = {
    show: false,
    handleGridTwo: false,
    advancedConversionCompound: {},
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
      : "0%"
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

  getRevenue = (price, clickNodes) => {
    const revenue = (+price && +clickNodes) ? price * clickNodes : 0
    return revenue + ' $'
  }

  render() {

    // console.log( 
    //   this.props.showAnalyticsBoolean,
    //   this.props.hideConversionLinkBoolean
    // )

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

                {
                  this.props.node.extras.conversionsContainer &&
                  this.props.node.extras.conversionsContainer.length > 0 &&
                  <SelectAnalyticsLeft show={
                    // this.props.hideConversionLinkBoolean
                    true
                  } >
                    <div
                      className='super-conversion-block'
                    >
                      {
                        this.props.node.extras.conversionsContainer &&
                        this.props.node.extras.conversionsContainer.map((item, index) => (
                          <AdvancedConversion
                            key={index}
                            hideConversionLinkBoolean={this.props.hideConversionLinkBoolean}
                            conversionName={item}
                            index={index}
                            node={this.props.node}
                            advancedConversion={this.props.advancedConversion}
                            conversionInfoForAllNodes={this.props.conversionInfoForAllNodes}
                          />
                        ))
                      }
                    </div>
                  </SelectAnalyticsLeft>
                }


                <SelectAnalyticsRight
                  show={true}
                >
                  <div style={{
                    display: 'flex'
                  }}>


                    <div
                      style={{
                        width: '100%'
                      }}
                    >
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
                              advancedConversionCompound: {
                                id,
                                type: 'utm',
                                portId: this.props.node.ports.clickOnLink.id
                              }
                            }, () => {
                              this.props.setConversionCompound(this.state.advancedConversionCompound)
                            })
                          }}
                          style={{
                            opacity: this.props.hideConversionLinkBoolean ? 1 : 0,
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
                              advancedConversionCompound: {
                                id,
                                type: 'pageVisited',
                                portId: this.props.node.ports.activeOnPage.id
                              }
                            }, () => {
                              this.props.setConversionCompound(this.state.advancedConversionCompound)
                            })
                          }}
                          style={{
                            opacity: this.props.hideConversionLinkBoolean ? 1 : 0,
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
                        style={{
                          display: this.props.node.extras.goald ? 'block' : 'none'
                        }}
                      >
                        <div style={{
                          display: 'block'
                        }}>
                          <p className="top-anal">Revenue</p>
                          <p className="bottom-anal">
                            {
                              this.props.conversionInfoForAllNodes &&
                              this.getRevenue(
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
                        style={{
                          borderTop: '1px solid #dce5ec',
                          paddingBottom: 4
                        }}
                      >
                        <div style={{
                          display: 'block',
                        }}>
                          <p className="top-anal">Conversion:</p>
                          <div className='bottom-anal'>
                            {
                              this.props.node.ports['conversionDefault'] &&
                                this.props.node.ports['conversionDefault'].links &&
                                !isEmpty(this.props.node.ports['conversionDefault'].links) ?
                                getAdvancedConversion(
                                  'conversionDefault',
                                  this.props.conversionInfoForAllNodes,
                                  this.props.node
                                ) :
                                (this.props.node.extras.conversions &&
                                  this.props.node.extras.conversions.forEach((item, index) => {
                                    if (
                                      item.to.id === this.props.node.id &&
                                      item.to.type === 'conversionDefault'
                                    ) {
                                      this.props.node.extras.conversions.splice(
                                        index,
                                        1
                                      )
                                    }
                                  }), '0%')
                            }
                          </div>
                          <div
                            className='conversion-port'
                            style={{
                              bottom: 10,
                              right: -16,
                              position: 'absolute',
                              zIndex: 100,
                              opacity:
                                this.props.hideConversionLinkBoolean ? 1 : 0,
                            }}
                            onMouseUp={() => {
                              this.props.node.setConversions &&
                                this.props.node.setConversions(
                                  {
                                    from: this.props.advancedConversion,
                                    to: {
                                      id: this.props.node.id,
                                      type: 'conversionDefault'
                                    }
                                  }
                                )
                            }}
                          >
                            <PortWidget
                              name={'conversionDefault'}
                              node={this.props.node}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          left: 45,
                          bottom: -10,
                          cursor: 'pointer',
                          display:
                            !this.props.hideConversionLinkBoolean ? 'none' :
                              this.props.node.extras.conversionsContainer === undefined ||
                                (this.props.node.extras.conversionsContainer &&
                                this.props.node.extras.conversionsContainer.length <= 2) ? 'block' : 'none'
                        }}
                        title={'add conversion block'}
                      >
                        <AddButtonSVG
                          onClick={() => {
                            if (
                              this.props.node.extras.conversionsContainer &&
                              this.props.node.extras.conversionsContainer.includes('conversion3', 2)) {
                              document.getElementById("diagram-layer").click();
                            }
                            else if (
                              this.props.node.extras.conversionsContainer &&
                              this.props.node.extras.conversionsContainer.includes('conversion2', 1)) {
                              this.props.node.setConversionsContainer &&
                                this.props.node.setConversionsContainer('conversion3')
                              document.getElementById("diagram-layer").click();
                            }
                            else if (
                              this.props.node.extras.conversionsContainer &&
                              this.props.node.extras.conversionsContainer.includes('conversion1', 0)) {
                              this.props.node.setConversionsContainer &&
                                this.props.node.setConversionsContainer('conversion2')
                              document.getElementById("diagram-layer").click();
                            }
                            else {
                              this.props.node.setConversionsContainer &&
                                this.props.node.setConversionsContainer('conversion1')
                              document.getElementById("diagram-layer").click();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </SelectAnalyticsRight>
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
                    style={{
                      paddingRight:
                        this.props.node.extras.notesd &&
                        this.props.node.extras.notesd.length !== 0 && 0
                    }}
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
                      deleteNode(
                        this.props.engine,
                        this.props.funnelId,
                        this.props.node.id
                      )
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
            }}
          >
            <PortWidget name="bottom" node={this.props.node} />
          </div>

          <div
            style={{
              display: 'none'
            }}
          >
            <PortWidget name="conversionDefault" node={this.props.node} />
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
