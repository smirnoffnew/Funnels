import * as React from "react";
import ReactSVG from "react-svg";
import * as RJD from "storm-react-diagrams";
import domtoimage from "dom-to-image";
import randomString from "random-string";
import { TrayWidget } from "./TrayWidget";
import { TrayBigItemWidget, TraySmallItemWidget, TrayTextItemWidget } from "./TrayItemWidget";
import ClickOutside from "../../../common/ClickOutside";
import { CustomNodeModel } from "../custom/CustomNodeModel";
import PagesButton from "../../../../assets/PagesButton.svg";
import EventsButton from "../../../../assets/EventsButton.svg";
import TrafficButton from "../../../../assets/TrafficButton.svg";
import TextButton from "../../../../assets/textButton.svg";
import EmailMarketingButton from "../../../../assets/EmailMarketingButton.svg";
import TextArea from "../../../../assets/TextArea.svg";
import TextPanel from "../../../../assets/TextPanel.svg";
import TemplatesButton from "../../../../assets/TemplatesButton.svg";
import { ReactComponent as ArrowSelectSVG } from "../../../../assets/ArrowSelect.svg";
import { ReactComponent as ShareFunnelSVG } from "../../../../assets/instructions.svg";
import { ReactComponent as AnalyticsSVG } from '../../../../assets/Analytics.svg'
import { ReactComponent as AnalyticsSelectedSVG } from '../../../../assets/AnalyticsSelected.svg';
import { ReactComponent as EditSVG } from '../../../../assets/EditSelected.svg'
import LupaSVG from "../../../../assets/lupa.svg";
import FunnelOptionsRightPanel from "./componentsForBodyWidget/FunnelOptionsRightPanel";
import FunnelNotesRightPanel from "./componentsForBodyWidget/FunnelNotesRightPanel";
import SettingsNodeRightPanel from "./componentsForBodyWidget/SettingsNodeRightPanel";
import NotesNodeRightPanel from "./componentsForBodyWidget/NotesNodeRightPanel";
import SaveBeforeExitModal from "./componentsForBodyWidget/SaveBeforeExitModal";
import CreateTemplateModal from "./componentsForBodyWidget/CreateTemplateModal";
import { API_URL } from "../../../../config";
import FunnelCommentsRightPanel from "./componentsForBodyWidget/FunnelCommentsRightPanel";
import { keyMonitor } from "../utils";

const Select = ({ show, children, style }) => {
  const showHideClassName = show
    ? "select display-block"
    : "select display-none";
  return (
    <div className={showHideClassName}>
      <section
        className="select-main-body-widget up-arrow-body-widget"
        style={style}
      >
        {children}
      </section>
    </div>
  );
};

export default class BodyWidget extends React.Component {
  state = {
    show: false,
    toggle: "first",
    backgroundActive: "linear-gradient(90deg, #e62d24 0%, #fd8f21 100%)",
    backgroundDefault: "#212939",
    showSelect: false,
    inverseZoom: false,
    allowCanvasZoom: true,
    toggleAnalytics: false,
    conversionIsView: false,
    srdLinkLayerSwitch: false,
  };

  saveDiagramHandle = file => {
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.app.getDiagramEngine().getDiagramModel()
        ),
        funnelNotes:
          (this.props.work.diagram && this.props.work.diagram.funnelNotes) || []
      },
      () => {
        this.props.work.saveDiagram(this.props.work.funnelId, this.state, file);
      }
    );
  }

  saveTemplateHandle = () =>
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.app.getDiagramEngine().getDiagramModel()
        )
      },
      () => {
        this.props.work.saveTemplate(this.props.work.funnelId, this.state);
      }
    );

  toggle = name => {
    this.setState({
      toggle: name,
      show: true
    });
  }

  handleToggleAnalytics = () => {
    this.setState(prev => {
      return {
        toggleAnalytics: !prev.toggleAnalytics,
      }
    }, () => {
      this.props.work.showAnalyticsBoolean(this.state.toggleAnalytics)
      this.props.work.getConversionInfoForAllNodes(this.props.work.funnelId)

        domtoimage
          .toBlob(this.diagramRef)
          .then(data => {
            const name = randomString({ length: 10 });
            const file = new File([data], name, {
              type: "image/svg"
            });
            this.saveDiagramHandle(file);
            this.hideSelect();
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      
    })

    if (this.state.toggleAnalytics) {
      this.changeConverseLinksVisible(false)
    }
  }

  button = (name, icon, className, title) => {
    return (
      <div
        onClick={() => this.toggle(name)}
        className={className}
        style={{
          background:
            this.state.toggle === name
              ? this.state.backgroundActive
              : this.state.backgroundDefault,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
        title={title}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "transparent",
            position: "absolute"
          }}
          onClick={() => this.toggle(name)}
        />

        {
          name === 'fifth' || name === 'third' ?
            <ReactSVG
              src={icon}
              alt=""
              beforeInjection={svg => {
                svg.setAttribute("style", `padding: 10px;`);
                svg.setAttribute("style", `margin-left: 4px;`);
              }}
            />
            :
            <ReactSVG
              src={icon}
              alt=""
              beforeInjection={svg => {
                svg.setAttribute("style", `padding: 10px;`);
              }}
            />
        }
      </div>
    );
  };

  copyToClipboard = e => {
    this.link.select();
    document.execCommand("copy");
    e.target.focus();
    this.props.work.resetSendImageToCollaborateLink();
  };

  nodeFactory(data) {
    switch (data.type) {
      case data.type:
        return new CustomNodeModel(data.type);
      default:
        return new CustomNodeModel("BlogPost");
    }
  }

  createBigItemsWidget(name) {
    if (this.props.work.svg) {
      let allItemsByName = this.props.app.getValues(this.props.work.svg, name);
      return allItemsByName.map((item, key) => (
        <TrayBigItemWidget
          key={key}
          model={{ type: item.name }}
          name={item.name}
          icon={API_URL + item.url}
        />
      ));
    }
  }

  createSmallItemsWidget(name) {
    if (this.props.work.svg) {
      let allItemsByName = this.props.app.getValues(this.props.work.svg, name);
      return allItemsByName.map((item, key) => (
        <TraySmallItemWidget
          key={key}
          model={{ type: item.name }}
          name={item.name}
          icon={API_URL + item.url}
        />
      ));
    }
  }

  createTextItemsWidget() {
    return (
      [
        <TrayTextItemWidget
          key='1'
          model={{ type: 'Text Area' }}
          name='Text Area'
          // icon= { API_URL + '/public/svg/TextArea.svg' } // добавить нужный свг на бэке
          icon={TextArea}
        />,
        <TrayTextItemWidget
          key='2'
          model={{ type: 'Text Panel' }}
          name='Text Panel'
          // icon= { API_URL + '/public/svg/TextPanel.svg' } // добавить нужный свг на бэке
          icon={TextPanel}
        />
      ]
    )
  }

  showSelect = () => this.setState({ showSelect: true });
  hideSelect = () => this.setState({ showSelect: false });

  scalePlus = () => {
    this.props.app.getDiagramEngine().getDiagramModel().zoom =
      this.props.app.getDiagramEngine().getDiagramModel().zoom + 5;
    document.getElementById("diagram-layer").click();
  };

  scaleMinus = () => {
    this.props.app.getDiagramEngine().getDiagramModel().zoom =
      this.props.app.getDiagramEngine().getDiagramModel().zoom - 5;
    document.getElementById("diagram-layer").click();
  };

  zoomToFit = () => {
    this.props.app.getDiagramEngine().zoomToFit();
    document.getElementById("diagram-layer").click();
  };

  componentDidMount() {
    keyMonitor('Alt', this.props.work.changeKeyDown, this.props.work.changeKeyDown);
  }

  changeConverseLinksVisible = boolean => {
    this.props.work.hideConversionLink(boolean)

    domtoimage
      .toBlob(this.diagramRef)
      .then(data => {
        let name = randomString({ length: 10 });
        var file = new File([data], name, {
          type: "image/svg"
        });
        this.saveDiagramHandle(file);
        this.hideSelect();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });

    document.getElementById("diagram-layer").click();
    this.forceUpdate();
  }

  render() {
    this.props.work.permissionForCollaborator === "Edit" ?
      this.props.app.getDiagramEngine().getDiagramModel().setLocked(false)
      :
      this.props.app.getDiagramEngine().getDiagramModel().setLocked(true)
    return (
      <>
        <SettingsNodeRightPanel work={this.props.work} app={this.props.app} />
        <NotesNodeRightPanel work={this.props.work} app={this.props.app} />

        <div className="message-diagram">
          {this.props.work.message && this.props.work.message}
        </div>
        <div className="body">
          <div className="header">
            <SaveBeforeExitModal work={this.props.work} app={this.props.app} />

            <div className="title">
              {this.props.work.diagram && this.props.work.diagram.funnelName}
            </div>

            <div
              onClick={() => this.handleToggleAnalytics()}
              className='analytics-button'
              title='Analytics'
            >
              {
                this.state.toggleAnalytics
                  ? <AnalyticsSelectedSVG />
                  : <AnalyticsSVG />
              }
            </div>
            <div
              className='edit-button'
              title='Edit'
              onClick={() => {
                this.setState({
                  conversionIsView: !this.state.conversionIsView
                }, () => {
                  this.changeConverseLinksVisible(this.state.conversionIsView);
                })
              }}
              style={{
                background:
                  this.state.conversionIsView
                    ? this.state.backgroundActive
                    : this.state.backgroundDefault,
                borderRadius: 4,
                with: 56,
                height: 56,
              }}
            >
              {
                this.state.toggleAnalytics ?
                  <EditSVG />
                  : ""
              }
            </div>

            {this.props.work.link ? (
              <>
                <input
                  className="created-link-wrapper"
                  style={{ margin: 0, padding: 10 }}
                  ref={ref => (this.link = ref)}
                  value={this.props.work.link}
                  onChange={() => { }}
                />
                <button
                  className="btn btn-1 btn-delete-modal"
                  style={{ margin: "0px 10px 0px 10px" }}
                  onClick={this.copyToClipboard}
                >
                  Copy Link
                </button>
              </>
            ) : null}

            {/* <button
              className='btn btn-1'
              style={{
                width: 100,
                height: 40,
                borderRadius: 7,
                marginRight: 10
              }}
              onClick={() => {
                this.setState(prev =>({
                  srdLinkLayerSwitch: !prev.srdLinkLayerSwitch
                }), () => {
                  if(this.state.srdLinkLayerSwitch){
                    document.getElementsByClassName('srd-link-layer')[0].style.zIndex = 1
                  }
                  else{
                    document.getElementsByClassName('srd-link-layer')[0].style.zIndex = 0
                  }
                })
              }}
            >
              link layer switch {this.state.srdLinkLayerSwitch ? `'on'` : `'off'`}
            </button> */}

            {this.props.work.pathname.includes("diagram") ? (
              <>
                {
                  this.props.work.permissionForCollaborator === "Edit" ?
                    <>
                      <div className="zoom-wrapper">
                        <ReactSVG
                          src={LupaSVG}
                          alt=""
                          beforeInjection={svg => {
                            svg.setAttribute("style", "width: 17px; height: 25px;");
                          }}
                        />
                        <div className="zoom-count">
                          {this.props.app
                            .getDiagramEngine()
                            .getDiagramModel()
                            .zoom.toFixed(0)}
                          %
                        </div>
                        <div className="zoom-buttons-wrapper">
                          <button
                            className="zoom-button-plus"
                            onClick={this.scalePlus}
                          >
                            +
                          </button>
                          <button
                            className="zoom-button-minus"
                            onClick={this.scaleMinus}
                          >
                            -
                      </button>
                        </div>
                      </div>

                      <button
                        className="btn btn-1"
                        style={{
                          width: 100,
                          height: 40,
                          borderRadius: 7,
                          marginRight: 10
                        }}
                        onClick={() => this.zoomToFit()}
                      >
                        Zoom to Fit
                      </button>

                      <button
                        className="btn btn-1 diagram-header-button-save"
                        onClick={this.showSelect}
                      >
                        SAVE
                      <div className="arrow-for-select">
                          <ArrowSelectSVG />
                        </div>
                      </button>

                      <FunnelCommentsRightPanel
                        work={this.props.work}
                        app={this.props.app}
                      />

                      <FunnelNotesRightPanel
                        work={this.props.work}
                        app={this.props.app}
                      />

                      <div className="diagram-header-instruction-buttons">
                        <button
                          className="diagram-header-instruction-button"
                          onClick={() => {
                            domtoimage
                              .toBlob(this.diagramRef)
                              .then(data => {
                                let name = randomString({ length: 10 });
                                var file = new File([data], name, {
                                  type: "image/svg"
                                });
                                this.saveDiagramHandle(file);
                                this.props.work.sendImageToCollaborate(
                                  this.props.work.funnelId,
                                  file
                                );
                                this.hideSelect();
                              })
                              .catch(function (error) {
                                console.error("oops, something went wrong!", error);
                              });
                          }}
                          title={"Share The Funnel"}
                        >
                          <ShareFunnelSVG />
                        </button>
                      </div>

                      <FunnelOptionsRightPanel
                        work={this.props.work}
                        app={this.props.app}
                      />
                    </>
                    :
                    <div className="zoom-wrapper">
                      <ReactSVG
                        src={LupaSVG}
                        alt=""
                        beforeInjection={svg => {
                          svg.setAttribute("style", "width: 17px; height: 25px;");
                        }}
                      />
                      <div className="zoom-count">
                        {this.props.app
                          .getDiagramEngine()
                          .getDiagramModel()
                          .zoom.toFixed(0)}
                        %
                    </div>
                      <div className="zoom-buttons-wrapper">
                        <button
                          className="zoom-button-plus"
                          onClick={this.scalePlus}
                        >
                          +
                      </button>
                        <button
                          className="zoom-button-minus"
                          onClick={this.scaleMinus}
                        >
                          -
                      </button>
                      </div>
                    </div>
                }

              </>
            ) : (
                <button
                  className="btn btn-1 diagram-header-button-save"
                  onClick={this.showSelect}
                  style={{ margin: 12.5 }}
                >
                  SAVE
                <div className="arrow-for-select">
                    <ArrowSelectSVG />
                  </div>
                </button>
              )}

            {/* {
              this.props.work.pathname.includes("diagram") ?


            } */}

            {this.props.work.pathname.includes("diagram") ? (
              <ClickOutside
                onClickOutside={() => {
                  this.setState({ showSelect: false });
                }}
              >
                <Select show={this.state.showSelect}>
                  <button
                    className="btn btn-1 button-select-body-widget"
                    onClick={() => {
                      domtoimage
                        .toPng(this.diagramRef)
                        .then(data => {
                          var img = new Image();
                          img.src = data;
                          var link = document.createElement("a");
                          link.download = "my-diagram.png";
                          link.href = img.src;
                          link.click();
                          this.hideSelect();
                        })
                        .catch(function (error) {
                          console.error("oops, something went wrong!", error);
                        });
                    }}
                  >
                    Export PNG
                  </button>
                  <button
                    className="btn btn-1 button-select-body-widget"
                    onClick={() => {
                      domtoimage
                        .toBlob(this.diagramRef)
                        .then(data => {
                          let name = randomString({ length: 10 });
                          var file = new File([data], name, {
                            type: "image/svg"
                          });
                          this.saveDiagramHandle(file);
                          this.hideSelect();
                        })
                        .catch(function (error) {
                          console.error("oops, something went wrong!", error);
                        });
                    }}
                  >
                    Update Funnel
                  </button>

                  <CreateTemplateModal
                    work={this.props.work}
                    app={this.props.app}
                  />
                </Select>
              </ClickOutside>
            ) : (
                <ClickOutside
                  onClickOutside={() => {
                    this.setState({ showSelect: false });
                  }}
                >
                  <Select show={this.state.showSelect} style={{ right: 9 }}>
                    <button
                      className="btn btn-1 button-select-body-widget"
                      onClick={() => {
                        domtoimage
                          .toPng(this.diagramRef)
                          .then(data => {
                            var img = new Image();
                            img.src = data;
                            var link = document.createElement("a");
                            link.download = "my-diagram.png";
                            link.href = img.src;
                            link.click();
                            this.hideSelect();
                          })
                          .catch(function (error) {
                            console.error("oops, something went wrong!", error);
                          });
                      }}
                    >
                      Export PNG
                  </button>
                    <button
                      className="btn btn-1 button-select-body-widget"
                      onClick={() => this.saveTemplateHandle()}
                    >
                      Update Template
                  </button>
                  </Select>
                </ClickOutside>
              )}
          </div>

          <div className="content">
            {
              this.props.work.permissionForCollaborator === "Edit" &&
              <div className="panel-buttons">
                {this.button(
                  "first",
                  PagesButton,
                  "panel-button panel-button-first",
                  "Pages"
                )}
                {this.button("second", TrafficButton, "panel-button", "Traffic")}
                {this.button("third", EventsButton, "panel-button", "Events")}
                {this.button(
                  "fourth",
                  EmailMarketingButton,
                  "panel-button",
                  "Email Marketing"
                )}
                {this.button(
                  "fifth",
                  TextButton,
                  "panel-button",
                  "Text"
                )}
                {this.button(
                  "six",
                  TemplatesButton,
                  "panel-button panel-button-last",
                  "Templates"
                )}
              </div>
            }

            {this.state.toggle === "first" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>
                  {this.createBigItemsWidget("Pages")}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            {this.state.toggle === "second" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>
                  {this.createSmallItemsWidget("Traffic")}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            {this.state.toggle === "third" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>
                  {this.createSmallItemsWidget("Events")}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            {this.state.toggle === "fourth" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>
                  {this.createSmallItemsWidget("EmailMarketing")}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            {this.state.toggle === "fifth" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>
                  {this.createTextItemsWidget()}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            {this.state.toggle === "six" ? (
              <ClickOutside
                onClickOutside={() => this.setState({ show: false })}
              >
                <TrayWidget show={this.state.show}>{/*empty*/}</TrayWidget>
              </ClickOutside>
            ) : null}

            <div id="diagram">
              <div
                id="diagram-layer"
                ref={ref => this.diagramRef = ref}
                onDrop={event => {
                  try {
                    const data = JSON.parse(
                      event.dataTransfer.getData("storm-diagram-node")
                    );
                    const node = this.nodeFactory(data);
                    const points = this.props.app
                      .getDiagramEngine()
                      .getRelativeMousePoint(event);
                    node.x = points.x;
                    node.y = points.y;
                    this.props.app
                      .getDiagramEngine()
                      .getDiagramModel()
                      .addNode(node);
                    this.forceUpdate();
                  }
                  catch (err) {
                    console.log(err)
                  }
                }}
                onDragOver={event => {
                  event.preventDefault();
                }}
                onWheel={event => {
                  const diagramModel = this.props.app
                    .getDiagramEngine()
                    .getDiagramModel();
                  event.preventDefault();
                  event.stopPropagation();
                  const oldZoomFactor = diagramModel.getZoomLevel() / 100;
                  let scrollDelta = this.state.inverseZoom
                    ? -event.deltaY
                    : event.deltaY;
                  if (event.ctrlKey && scrollDelta % 1 !== 0) {
                    scrollDelta /= 3;
                  } else {
                    scrollDelta /= 60;
                  }
                  if (diagramModel.getZoomLevel() + scrollDelta > 10) {
                    diagramModel.setZoomLevel(
                      diagramModel.getZoomLevel() + scrollDelta
                    );
                  }
                  const zoomFactor = diagramModel.getZoomLevel() / 100;
                  const boundingRect = event.currentTarget.getBoundingClientRect();
                  const clientWidth = boundingRect.width;
                  const clientHeight = boundingRect.height;
                  // compute difference between rect before and after scroll
                  const widthDiff =
                    clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                  const heightDiff =
                    clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                  // compute mouse coords relative to canvas
                  const clientX = event.clientX - boundingRect.left;
                  const clientY = event.clientY - boundingRect.top;
                  // compute width and height increment factor
                  const xFactor =
                    (clientX - diagramModel.getOffsetX()) /
                    oldZoomFactor /
                    clientWidth;
                  const yFactor =
                    (clientY - diagramModel.getOffsetY()) /
                    oldZoomFactor /
                    clientHeight;
                  diagramModel.setOffset(
                    diagramModel.getOffsetX() - widthDiff * xFactor,
                    diagramModel.getOffsetY() - heightDiff * yFactor
                  );
                  this.props.app.getDiagramEngine().enableRepaintEntities([]);
                  this.forceUpdate();
                }}
              >
                <RJD.DiagramWidget
                  deleteKeys={[]}
                  // smartRouting={true}
                  allowCanvasZoom={false}
                  // allowCanvasTranslation={false}
                  className="srd-demo-canvas"
                  diagramEngine={this.props.app.getDiagramEngine()}
                  allowLooseLinks={false}
                // maxNumberPointsPerLink={0}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
