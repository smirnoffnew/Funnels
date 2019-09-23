import * as React from "react";
import randomString from "random-string";
import ModalNodeWidget from "../../../../common/ModalNodeWidget";
import { ReactComponent as SelectSVG } from "../../../../../assets/select.svg";
import { API_URL } from "../../../../../config";
import { ReactComponent as ArrowSelectSVG } from "../../../../../assets/arrow-up.svg";
import "./SettingsNodeRightPannel.css"
const FINISHED = "FINISHED";
const UNDER_DEVELOPMENT = "UNDER DEVELOPMENT";
const DEFAULT = "DEFAULT";

const SETTINGS_SECTION = "SETTINGS_SECTION";
const TRACKING_BIG_NODE_SECTION = "TRACKING_BIG_NODE_SECTION";
const TRACKING_SMALL_NODE_SECTION = "TRACKING_SMALL_NODE_SECTION";


export default class SettingsNodeRightPanel extends React.Component {
  state = {
    labelNode: "",
    script: "",
    toggleTriggerStyle: false,
    toggleGoalStyle: false,
    copied: false,
    originalUrl: "",
    url: '',
    sectionViews: {
      settings: true,
      trackingBigNode: true,
      trackingSmallNode: true
    },
    isUnderDevelopment: false,
    isFinished: false,
    sourceLinkNode:''

  };



  componentDidUpdate(prevProps) {
    if (prevProps.developmentStatus !== this.props.developmentStatus) {
      if (this.props.developmentStatus.status === DEFAULT) {
        this.setState({
          isFinished: false,
          isUnderDevelopment: false
        })
      } if (this.props.developmentStatus.status === UNDER_DEVELOPMENT) {
        this.setState({
          isFinished: false,
          isUnderDevelopment: true
        })
      } if (this.props.developmentStatus.status === FINISHED) {
        this.setState({
          isFinished: true,
          isUnderDevelopment: false
        })
      }
    }
  }

  saveDiagramHandle = file => {
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.app.getDiagramEngine().getDiagramModel()
        ),
        funnelName: this.props.work.diagram.funnelName,
        funnelNotes: this.props.work.diagram.funnelNotes,
      },
      () => {
        this.props.work.saveDiagram(this.props.work.funnelId, this.state, file);
      }
    );
  };

  handleToggleTriggerStyle = () => {
    this.setState(
      prev => {
        return {
          toggleTriggerStyle: !prev.toggleTriggerStyle,
          toggleGoalStyle: false
        };
      },
      () => {
        (this.props.work.showSettingsWidgetModel.extras.setTriggerExtras &&
          this.props.work.showSettingsWidgetModel.extras.setTriggerExtras(
            this.state.toggleTriggerStyle
          )) ||
          (this.props.work.showSettingsWidgetModel.setTrigger &&
            this.props.work.showSettingsWidgetModel.setTrigger(
              this.state.toggleTriggerStyle
            ));

        (this.props.work.showSettingsWidgetModel.extras.setGoalExtras &&
          this.props.work.showSettingsWidgetModel.extras.setGoalExtras(
            this.state.toggleGoalStyle
          )) ||
          (this.props.work.showSettingsWidgetModel.setGoal &&
            this.props.work.showSettingsWidgetModel.setGoal(
              this.state.toggleGoalStyle
            ));
      }
    );

    const name = randomString({ length: 10 });
    const file = new File([], name, {
      type: "image/svg"
    });
    this.saveDiagramHandle(file);
  };

  handleToggleGoalStyle = () => {
    this.setState(
      prev => {
        return {
          toggleGoalStyle: !prev.toggleGoalStyle,
          toggleTriggerStyle: false
        };
      },
      () => {
        (this.props.work.showSettingsWidgetModel.extras.setTriggerExtras &&
          this.props.work.showSettingsWidgetModel.extras.setTriggerExtras(
            this.state.toggleTriggerStyle
          )) ||
          (this.props.work.showSettingsWidgetModel.setTrigger &&
            this.props.work.showSettingsWidgetModel.setTrigger(
              this.state.toggleTriggerStyle
            ));

        (this.props.work.showSettingsWidgetModel.extras.setGoalExtras &&
          this.props.work.showSettingsWidgetModel.extras.setGoalExtras(
            this.state.toggleGoalStyle
          )) ||
          (this.props.work.showSettingsWidgetModel.setGoal &&
            this.props.work.showSettingsWidgetModel.setGoal(
              this.state.toggleGoalStyle
            ));
      }
    );

    const name = randomString({ length: 10 });
    const file = new File([], name, {
      type: "image/svg"
    });
    this.saveDiagramHandle(file);
  };

  handleChangeNode = e => {
    this.setState(
      {
        labelNode: e.target.value
      },
      () =>
        (this.props.work.showSettingsWidgetModel.extras.setNameExtras &&
          this.props.work.showSettingsWidgetModel.extras.setNameExtras(
            this.state.labelNode
          ))
        ||
        (this.props.work.showSettingsWidgetModel.setName &&
          this.props.work.showSettingsWidgetModel.setName(this.state.labelNode))
    );
  }


  handleChangeNodeSourceLink = e => {
    this.setState(
      {
        sourceLinkNode: e.target.value
      },
      () =>
        (this.props.work.showSettingsWidgetModel.extras.setSourceLinkExtras &&
          this.props.work.showSettingsWidgetModel.extras.setSourceLinkExtras(
            this.state.sourceLinkNode
          ))
        ||
        (this.props.work.showSettingsWidgetModel.setSourceLink &&
          this.props.work.showSettingsWidgetModel.setSourceLink(this.state.sourceLinkNode))
    );
  }

  saveDiagramThenCloseSettingModal = file => {
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.work.showSettingsWidgetEngine
        ),
        funnelName: this.props.work.diagram.funnelName,
        funnelNotes: this.props.work.diagram.funnelNotes
      },
      () => {
        this.props.work.saveDiagramThenShowOrHideSettingsModal(
          this.props.work.funnelId,
          this.state,
          file,
          false
        );
        this.setState({
          labelNode: "",
          url: "",
          originalUrl: "",
          scriptD: '',
          copied: false,
          sourceLinkNode:''
          
        });
      }
    );
  }

  handleScriptChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => this.props.work.dispatch({
      type: "CREATE_UTM_LINK_MESSAGE_RESET"
    }));
  };

  copyToClipboardScript = e => {
    this.script.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({
      copied: true
    }, () => this.props.work.dispatch({
      type: "CREATE_UTM_LINK_MESSAGE_RESET"
    }));
  };

  copyToClipboardUrl = e => {
    this.utm.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({
      copied: true
    }, () => this.props.work.dispatch({
      type: "CREATE_UTM_LINK_MESSAGE_RESET"
    }));
  };

  handleCreateUTMLink = () => {
    this.props.work.createUTMLinkWithPromisefication(
      this.props.work.funnelId,
      this.props.work.showSettingsWidgetModel &&
      this.props.work.showSettingsWidgetModel.id,
      this.state.originalUrl,
    )
      .then(response => {
        this.props.work.dispatch({
          type: 'CREATE_UTM_LINK_MESSAGE',
          payload: response.message
        });
        this.setState({
          url: response.url,
        }, () => {
          (this.props.work.showSettingsWidgetModel.extras.setUTMLinkExtras &&
            this.props.work.showSettingsWidgetModel.extras.setUTMLinkExtras(
              this.state.url
            ))
            ||
            (this.props.work.showSettingsWidgetModel.setUTMLink &&
              this.props.work.showSettingsWidgetModel.setUTMLink(this.state.url));

          (this.props.work.showSettingsWidgetModel.extras.setUTMLinkOriginalExtras &&
            this.props.work.showSettingsWidgetModel.extras.setUTMLinkOriginalExtras(
              this.state.originalUrl
            ))
            ||
            (this.props.work.showSettingsWidgetModel.setUTMLinkOriginal &&
              this.props.work.showSettingsWidgetModel.setUTMLinkOriginal(this.state.originalUrl));
        });
      })
      .catch(error => {
        this.props.work.dispatch({
          type: 'CREATE_UTM_LINK_MESSAGE',
          payload: error
        });
      });
  };

  setDevelopmentStage(status) {
    this.props.changeStatusOfNode(this.props.work.funnelId, this.props.work.showSettingsWidgetModel.id, status)
  }

  handleClickOnDevelopmentStage(status) {
    if (status === FINISHED) {
      this.setState({ isUnderDevelopment: false, isFinished: this.state.isFinished ? false : true },
        () => {
          if (!this.state.isUnderDevelopment && !this.state.isFinished) {
            this.setDevelopmentStage("");
          } else {
            this.setDevelopmentStage(FINISHED);
          }
        }
      )
    } if (status === UNDER_DEVELOPMENT) {
      this.setState({ isUnderDevelopment: this.state.isUnderDevelopment ? false : true, isFinished: false },
        () => {
          if (!this.state.isUnderDevelopment && !this.state.isFinished) {
            this.setDevelopmentStage("");
          } else {
            this.setDevelopmentStage(UNDER_DEVELOPMENT);
          }
        }
      )
    }

  }

  changeViewSection = (section) => {
    const { sectionViews } = this.state;
    const { settings, trackingBigNode, trackingSmallNode } = sectionViews
    switch (section) {
      case SETTINGS_SECTION: {
        this.setState({
          sectionViews: {
            ...sectionViews,
            settings: !settings
          }
        })
        return
      }
      case TRACKING_BIG_NODE_SECTION: {
        this.setState({
          sectionViews: {
            ...sectionViews,
            trackingBigNode: !trackingBigNode
          }
        })
        return
      }
      case TRACKING_SMALL_NODE_SECTION: {
        this.setState({
          sectionViews: {
            ...sectionViews,
            trackingSmallNode: !trackingSmallNode
          }
        })
        return
      }
      default: return
    }
  }

  render() {
    const { settings, trackingBigNode, trackingSmallNode } = this.state.sectionViews
    return (
      <ModalNodeWidget
        style={{height:'calc(100vh - 67px)',   overflow: 'auto'}}
        show={this.props.work.showSettingsWidgetBoolean}
        handleClose={() => {
          const name = randomString({ length: 10 });
          const file = new File(["test"], name, {
            type: "image/png"
          });
          this.saveDiagramThenCloseSettingModal(file);
        }}
        handleHideSection={() => this.changeViewSection(SETTINGS_SECTION)}
        isViewSettingsSection={settings}
      >
        <label className="label-create-widget-settings">Settings</label>
        {this.state.copied && (
          <span className="label-input">Copied!</span>
        )}

        {
          settings && <div className="modal-content-wrapper">
            {this.props.work.UTMLinkMessage && (
              <div className={`input-group`}>
                {this.props.work.UTMLinkMessage}
              </div>
            )}
            <label htmlFor="Name" className="label-input">
              Name
          </label>
            <input
              className="node-panel-textarea-input"
              style={{ height: 25, marginBottom: '-3px' }}
              id="Name"
              placeholder="Label Name"
              type="text"
              value={
                this.state.labelNode === '' ?

                  this.props.work.showSettingsWidgetModel &&
                    this.props.work.showSettingsWidgetModel.extras.named === undefined ?

                    this.props.work.showSettingsWidgetModel &&
                    // this.props.work.showSettingsWidgetModel.type :
                    '' :

                    this.props.work.showSettingsWidgetModel &&
                    this.props.work.showSettingsWidgetModel.extras.named

                  : this.state.labelNode
              }
              onChange={this.handleChangeNode}
            />
            <label htmlFor="Name" className="label-input">
              Source link
          </label>
            <input
              className="node-panel-textarea-input"
              style={{ height: 25, marginBottom: '4px' }}
              id="Link"
              type="text"
              value={
                this.state.sourceLinkNode === '' ?

                this.props.work.showSettingsWidgetModel &&
                  this.props.work.showSettingsWidgetModel.extras.sourceLink === undefined ?

                  this.props.work.showSettingsWidgetModel &&
                  // this.props.work.showSettingsWidgetModel.type :
                  '' :

                  this.props.work.showSettingsWidgetModel &&
                  this.props.work.showSettingsWidgetModel.extras.sourceLink

                : this.state.sourceLinkNode
              }
              onChange={this.handleChangeNodeSourceLink}
            />
            <div className="radio-button-container">
              <label
                htmlFor="CheckBoxFinished"
                className="container-checkbox"
              >
                Completed
                <input
                  id='CheckBoxFinished'
                  type="radio"
                  checked={this.state.isFinished}
                  // defaultChecked={false}
                  // onClick={this.handleChangeCheckbox}
                  onChange={() => null}
                  onClick={() => this.handleClickOnDevelopmentStage(FINISHED)}
                />
                <span className="checkmark"></span>
              </label>
              <label
                htmlFor="CheckBoxUnderDevelopment"
                className="container-checkbox"
              >
                Under development
                <input
                  id='CheckBoxUnderDevelopment'
                  type="radio"
                  checked={this.state.isUnderDevelopment}
                  // defaultChecked={false}
                  // onClick={this.handleChangeCheckbox}
                  onChange={() => null}
                  onClick={() => this.handleClickOnDevelopmentStage(UNDER_DEVELOPMENT)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>

        }


        {this.props.work.showTypeOfNode &&
          this.props.work.showTypeOfNode === "small" ? (
            <>
              <label className="label-create-widget-settings">Tracking</label>
              <div className={'arrow-tip-tracking'} onClick={() => this.changeViewSection(TRACKING_SMALL_NODE_SECTION)} style={{ transform: `${trackingSmallNode ? "scale(1, -1)" : " "}` }}>
                <ArrowSelectSVG />
              </div>

              {
                trackingSmallNode &&
                <div style={{ padding: 15 }}>
                  <>

                    <label htmlFor="UTMLink" className="label-input">
                      Generate UTM link from Original link
              </label>
                    <input
                      id="UTMLink"
                      type="text"
                      name="originalUrl"
                      placeholder="ex.: https://www.google.com/"
                      value={
                        this.state.originalUrl === '' ?

                          this.props.work.showSettingsWidgetModel &&
                            this.props.work.showSettingsWidgetModel.extras.originalUrl === undefined ?

                            '' :

                            this.props.work.showSettingsWidgetModel &&
                            this.props.work.showSettingsWidgetModel.extras.originalUrl

                          : this.state.originalUrl
                      }
                      onChange={this.handleScriptChange}
                    />
                    {(this.state.url && this.state.url.length > 0) ||
                      this.props.work.showSettingsWidgetModel.extras.url ? (
                        <>
                          <label htmlFor="U" className="label-input">
                            Generated UTM link
                  </label>
                          <input
                            type="text"
                            name="U"
                            ref={ref => this.utm = ref}
                            value={
                              this.state.url
                                ? this.state.url
                                : this.props.work.showSettingsWidgetModel.extras.url
                            }
                            onChange={() => { }}
                          />
                          <button
                            className="btn-generate-utm"
                            onClick={this.copyToClipboardUrl}
                            style={{ float: "left" }}
                          >
                            Copy
                  </button>
                        </>
                      ) : null}
                    <button
                      className="btn-generate-utm"
                      onClick={() => this.handleCreateUTMLink()}
                    >
                      Generate
              </button>
                  </>
                </div>
              }




              <button
                className="btn-set-as-a-trigger"
                onClick={this.handleToggleTriggerStyle}
                style={{
                  margin: "30px auto"
                }}
              >
                {
                  this.props.work.showSettingsWidgetModel &&
                  this.props.work.showSettingsWidgetModel.extras.triggerd &&
                  <SelectSVG />
                }
                Set as a trigger
            </button>
            </>
          ) : (
            <>
              <label className="label-create-widget-settings">Tracking</label>
              <div className={'arrow-tip-tracking'} onClick={() => this.changeViewSection(TRACKING_BIG_NODE_SECTION)} style={{ transform: `${trackingBigNode ? "scale(1, -1)" : " "}` }}>
                <ArrowSelectSVG />
              </div>
              {
                trackingBigNode && <> <div style={{ padding: 15 }}>
                  <>
                    <label htmlFor="UTMLink" className="label-input">
                      Generate UTM link from Original link
                </label>
                    <input
                      id="UTMLink"
                      type="text"
                      name="originalUrl"
                      placeholder="ex.: https://www.google.com/"
                      value={
                        // this.state.originalUrl === '' ?

                        //   this.props.work.showSettingsWidgetModel &&
                        //     this.props.work.showSettingsWidgetModel.extras.originalUrl === undefined ?

                        //     '' :

                        //     this.props.work.showSettingsWidgetModel &&
                        //     this.props.work.showSettingsWidgetModel.extras.originalUrl

                        //   : this.state.originalUrl
                        (this.state.originalUrl ? this.state.originalUrl : this.props.work.showSettingsWidgetModel &&
                          this.props.work.showSettingsWidgetModel.extras.originalUrl) || ""
                        //______________________________________________________________________________________________________________________________CHANGE___________________________________
                      }
                      onChange={this.handleScriptChange}
                    />
                    {(this.state.url && this.state.url.length > 0) ||
                      (this.props.work.showSettingsWidgetModel &&
                        this.props.work.showSettingsWidgetModel.extras.url) ? (
                        <>
                          <label htmlFor="N" className="label-input">
                            Generated UTM link
                    </label>
                          <input
                            type="text"
                            name="N"
                            ref={ref => this.utm = ref}
                            value={
                              this.state.url
                                ? this.state.url
                                : this.props.work.showSettingsWidgetModel &&
                                this.props.work.showSettingsWidgetModel.extras.url
                            }
                            onChange={() => { }}
                          />
                          <button
                            className="btn-generate-utm"
                            onClick={this.copyToClipboardUrl}
                            style={{ float: "left" }}
                          >
                            Copy
                    </button>
                        </>
                      ) : null}
                    <button
                      className="btn-generate-utm"
                      onClick={() => this.handleCreateUTMLink()}
                    >
                      Generate
                </button>
                  </>

                </div>

                  <div style={{ padding: 15 }}>
                    <label htmlFor="GenerateScript" className="label-input">
                      {this.state.scriptD ? "Generated script" : "Generate script"}
                    </label>
                    <textarea
                      className="node-panel-textarea-input"
                      style={{
                        height: 120,
                        marginBottom: 15
                      }}
                      id="GenerateScript"
                      name="script"
                      ref={ref => this.script = ref}
                      type="text"
                      value={
                        this.state.scriptD ? this.state.scriptD : this.props.work.showSettingsWidgetModel ?
                          this.props.work.showSettingsWidgetModel.extras.scriptd : " "
                      }
                      onChange={this.handleScriptChange}
                    />
                    {this.state.scriptD || (this.props.work.showSettingsWidgetModel &&
                      this.props.work.showSettingsWidgetModel.extras.scriptd) ? (
                        <>
                          <button
                            className="btn-generate-utm"
                            onClick={this.copyToClipboardScript}
                          >
                            Copy
                  </button>
                        </>
                      ) : (
                        <button
                          className="btn-generate-utm"
                          onClick={() => {
                            this.setState({
                              copied: false,
                              scriptD: `<script> 
                          window.onload = function() { 
                            (() => {
                              if(!localStorage.getItem('${this.props.work
                                  .showSettingsWidgetModel &&
                                this.props.work.showSettingsWidgetModel.id}',)){
                              fetch('${API_URL}/funnel/node/counter', {
                                method: 'PATCH',
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                  'Cache-Control': 'only-if-cached'
                                },
                                body: JSON.stringify({
                                  nodeId: '${this.props.work
                                  .showSettingsWidgetModel &&
                                this.props.work.showSettingsWidgetModel.id}',
                                  funnelId: '${this.props.work.funnelId}',
                                })
                              }) .then(() => {  localStorage.setItem('${this.props.work
                                  .showSettingsWidgetModel &&
                                this.props.work.showSettingsWidgetModel.id}', true);} )
                            };
                            })();
                          }; 
                        </script>`
                            }, () => {
                              (this.props.work.showSettingsWidgetModel.extras.setScriptExtras &&
                                this.props.work.showSettingsWidgetModel.extras.setScriptExtras(
                                  this.state.scriptD
                                ))
                                ||
                                (this.props.work.showSettingsWidgetModel.setScript &&
                                  this.props.work.showSettingsWidgetModel.setScript(this.state.scriptD));
                            });
                          }}
                        >
                          Generate
                </button>
                      )}
                  </div>

                </>
              }

              <div className="buttons-set-wrapper">
                <button
                  className="btn-set-as-a-trigger"
                  onClick={this.handleToggleTriggerStyle}
                >
                  {
                    this.props.work.showSettingsWidgetModel &&
                    this.props.work.showSettingsWidgetModel.extras.triggerd &&
                    <SelectSVG />
                  }
                  Set as a trigger
              </button>
                <button
                  className="btn-set-as-a-goal"
                  onClick={this.handleToggleGoalStyle}
                >
                  {
                    this.props.work.showSettingsWidgetModel &&
                    this.props.work.showSettingsWidgetModel.extras.goald &&
                    <SelectSVG />
                  }
                  Set as a goal
              </button>
              </div>
            </>
          )}


      </ModalNodeWidget>
    );
  }
}
