import * as React from "react";
import ReactSVG from "react-svg";
import * as RJD from "storm-react-diagrams";
import domtoimage from "dom-to-image";
import * as _ from "lodash";
import randomString from "random-string";
import { TrayWidget } from "./TrayWidget";
import { TrayBigItemWidget, TraySmallItemWidget, TrayTextItemWidget, TrayTemplatesItemWidget } from "./TrayItemWidget";
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

import ArrowZoom from "../../../../assets/zoom/arrow.svg";
import LupaZoom from "../../../../assets/zoom/lupa.svg";

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
import FunnelCommentsRightPanel from "./componentsForBodyWidget/FunnelCommentsRightPanel";
import { keyMonitor } from "../utils";
import MobileDevice from "./componentsForBodyWidget/MobileDevice";
import { serializationInWidget, deleteNode, cloneSelected } from "../custom/funcsForCustomNodeWidget";
import { AdvancedLinkModel } from "../custom/customLink/customLink";
import Modal from "../../../common/Modal/Modal";

import FunnelTemplate from "../../../../assets/highlighting/template.svg";
import CopySVG from "../../../../assets/highlighting/copy.svg";
import DeleteSVG from "../../../../assets/highlighting/delete.svg";
import UndoRedo from "./UndoRedo";
import ShareFunnelModal from "./componentsForBodyWidget/ShareFunnelModal";

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

const SelectZoom = ({ show, children, style }) => {
  const showHideClassName = show
    ? "select display-block"
    : "select display-none";
  return (
    <div className={showHideClassName}>
      <section
        className="select-zoom-main-body-widget"
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
    showZoomSelect: false,
    inverseZoom: false,
    allowCanvasZoom: true,
    toggleAnalytics: false,
    conversionIsView: false,
    showTemplateButtons: false,
    selectZoom: [
      '25', '33', '50', '75', '100', '150', '200', '300', '400', 'plus', 'minus', 'auto'
    ]
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.work.diagram)
      return {
        allTemplatesItems: prevState.allTemplatesItems && prevState.allTemplatesItems.length > 0 ? prevState.allTemplatesItems :
          (nextProps.work.diagram && nextProps.work.diagram.allTemplatesItems) || [],
      };
    else return null
  }

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
      show: true,
      allTemplatesItems: this.state.allTemplatesItems.length > 0 ? this.state.allTemplatesItems :
        (this.props.work.diagram && this.props.work.diagram.allTemplatesItems) || []
    });
  }

  handleToggleAnalytics = () => {
    this.setState(prev => {
      return {
        toggleAnalytics: !prev.toggleAnalytics,
      }
    }, () => {
      this.props.work.showAnalyticsBoolean(this.state.toggleAnalytics)


      if (this.props.addCollaborators) {
        this.props.work.getConversionInfoForAllNodesForRecipiensCollaborator(
          this.props.work.funnelId,
          this.props.tokenCollaborator
        )
      }
      else {
        this.props.work.getConversionInfoForAllNodes(this.props.work.funnelId)
      }

      this.props.work.permissionForCollaborator.includes("Edit") &&
        !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) &&
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
      this.setState({
        conversionIsView: false
      }, () => {
        this.changeConverseLinksVisible(this.state.conversionIsView)
      })
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
          icon={item.url}
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
          icon={item.url}
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
          icon={TextArea}
        />,
        <TrayTextItemWidget
          key='2'
          model={{ type: 'Text Panel' }}
          name='Text Panel'
          icon={TextPanel}
        />
      ]
    )
  }

  createTemplatesItemsWidget() {
    return this.state.allTemplatesItems.map((item, key) => (
      <TrayTemplatesItemWidget
        key={key}
        model={{ data: item.data }}
        name={item.name}
        // icon={TemplatesButton}
        icon={FunnelTemplate}
        delete={() => this.removeTemplate(key)}
      />
    ))
  }

  showTemplateItemName = () => {
    if (this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems().length > 1) {
      this.setState({
        templateItemName: '',
        showTemplateItemName: true,
      });
    }
    else {
      console.log('select more elements!')
    }
  }
  hideTemplateItemName = () => this.setState({
    templateItemName: '',
    showTemplateItemName: false,
  });

  showSelect = () => this.setState({ showSelect: true });
  hideSelect = () => this.setState({ showSelect: false });

  showZoomSelect = () => this.setState({ showZoomSelect: true });
  hideZoomSelect = () => this.setState({ showZoomSelect: false });

  scaleTo = value => {
    if (value === 'auto') {
      this.props.app.getDiagramEngine().zoomToFit();
      document.getElementById("diagram-layer").click();

      this.setState({
        scale: this.props.app.getDiagramEngine().getDiagramModel().zoom
      })
    }
    else if (value === 'plus') {
      this.props.app.getDiagramEngine().getDiagramModel().zoom =
        this.props.app.getDiagramEngine().getDiagramModel().zoom + 5;
      document.getElementById("diagram-layer").click();

      this.setState({
        scale: this.props.app.getDiagramEngine().getDiagramModel().zoom
      })
    }
    else if (value === 'minus') {
      this.props.app.getDiagramEngine().getDiagramModel().zoom =
        this.props.app.getDiagramEngine().getDiagramModel().zoom - 5;
      document.getElementById("diagram-layer").click();

      this.setState({
        scale: this.props.app.getDiagramEngine().getDiagramModel().zoom
      })
    }
    else {
      this.props.app.getDiagramEngine().getDiagramModel().zoom = +value;
      document.getElementById("diagram-layer").click();
    }
  }

  altPlusPlus = (e) => {
    if (e.keyCode === 187 | e.keyCode === 107 && e.altKey) {
      this.props.app.getDiagramEngine().getDiagramModel().zoom =
        this.props.app.getDiagramEngine().getDiagramModel().zoom + 5;
      document.getElementById("diagram-layer").click();
    }
  }

  altPlusMinus = e => {
    if (e.keyCode === 189 || e.keyCode === 109 && e.altKey) {
      this.props.app.getDiagramEngine().getDiagramModel().zoom =
        this.props.app.getDiagramEngine().getDiagramModel().zoom - 5;
      document.getElementById("diagram-layer").click();
    }
  }

  altPlusZero = e => {
    if (e.keyCode === 48 || e.keyCode === 96 && e.altKey) {
      this.props.app.getDiagramEngine().zoomToFit();
      document.getElementById("diagram-layer").click();
    }
  }

  altPlusOne = e => {
    if (e.keyCode === 49 || e.keyCode === 97 && e.altKey) {
      this.props.app.getDiagramEngine().getDiagramModel().zoom = 100
      document.getElementById("diagram-layer").click();
    }
  }

  altPlusTwo = e => {
    if (e.keyCode === 50 || e.keyCode === 98 && e.altKey) {
      this.props.app.getDiagramEngine().getDiagramModel().zoom = 200
      document.getElementById("diagram-layer").click();
    }
  }


  componentDidMount() {
    keyMonitor('Alt', this.props.work.changeKeyDown, this.props.work.changeKeyDown);

    document.addEventListener('keydown', this.altPlusPlus);
    document.addEventListener('keydown', this.altPlusMinus);
    document.addEventListener('keydown', this.altPlusZero);
    document.addEventListener('keydown', this.altPlusOne);
    document.addEventListener('keydown', this.altPlusTwo);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.altPlusPlus);
    document.removeEventListener('keydown', this.altPlusMinus);
    document.removeEventListener('keydown', this.altPlusZero);
    document.removeEventListener('keydown', this.altPlusOne);
    document.removeEventListener('keydown', this.altPlusTwo);
  }

  changeConverseLinksVisible = boolean => {
    this.props.work.hideConversionLink(boolean)
    this.props.work.permissionForCollaborator.includes("Edit") &&
      !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) &&
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
        })


    document.getElementById("diagram-layer").click();
    this.forceUpdate();
  }


  addTemplate = () => {
    if (this.state.allTemplatesItems.length === 0) {
      this.setState({
        allTemplatesItems: [{
          name: this.state.templateItemName,
          data: serializationInWidget(this.props.app.getDiagramEngine().getDiagramModel())
        }],
        showTemplateButtons: false
      }, () => this.hideTemplateItemName())
    }
    if (this.state.allTemplatesItems.length >= 1) {
      this.setState({
        allTemplatesItems: [...this.state.allTemplatesItems, {
          name: this.state.templateItemName,
          data: serializationInWidget(this.props.app.getDiagramEngine().getDiagramModel())
        }],
        showTemplateButtons: false
      }, () => this.hideTemplateItemName())
    }
  };

  removeTemplate = index => {
    this.state.allTemplatesItems.splice(index, 1)
    document.getElementById("tray").click();
  };


  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  debounce(f, ms, leading) {
    let timer = null;
    return function (...args) {
      const onComplete = () => {
        f.apply(this, args);
        timer = null;
      }
      if (timer === null && leading) f.apply(this, args);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(onComplete, ms);
    };
  }

  showToolElement = this.debounce(e => {
    if (this.props.work.permissionForCollaborator.includes("Edit"))
      if (e.shiftKey) {
        this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems().length > 1 ?
          this.setState({
            showTemplateButtons: true,
          })
          :
          this.setState({
            showTemplateButtons: false
          })
      }

  }, 50, true);

  selectContains = select => {
    switch (select) {
      case '25':
        return (
          <>
            <p>25%</p>
            <p></p>
          </>
        )
      case '33':
        return (
          <>
            <p>33%</p>
            <p></p>
          </>
        )
      case '50':
        return (
          <>
            <p>50%</p>
            <p></p>
          </>
        )
      case '75':
        return (
          <>
            <p>75%</p>
            <p></p>
          </>
        )
      case '100':
        return (
          <>
            <p>100%</p>
            <p>Alt + 1</p>
          </>
        )
      case '150':
        return (
          <>
            <p>150%</p>
            <p></p>
          </>
        )
      case '200':
        return (
          <>
            <p>200%</p>
            <p>Alt + 2</p>
          </>
        )
      case '300':
        return (
          <>
            <p>300%</p>
            <p></p>
          </>
        )
      case '400':
        return (
          <>
            <p>400%</p>
            <p></p>
          </>
        )
      case 'plus':
        return (
          <>
            <p>Zoom In</p>
            <p>Alt + +</p>
          </>
        )
      case 'minus':
        return (
          <>
            <p>Zoom Out</p>
            <p>Alt + -</p>
          </>
        )
      case 'auto':
        return (
          <>
            <p>Zoom to Fit</p>
            <p>Alt + 0</p>
          </>
        )
      default:
        return select
    }
  }

  render() {
    this.props.work.permissionForCollaborator.includes("Edit") ?
      this.props.app.getDiagramEngine().getDiagramModel().setLocked(false)
      :
      this.props.app.getDiagramEngine().getDiagramModel().setLocked(true)

    // if(e.shiftKey)


    return (
      <>

        <Modal
          show={this.state.showTemplateItemName}
          handleClose={this.hideTemplateItemName}
        >
          <label className="label-create">Tempalate Name</label>
          <label htmlFor="templateItemName" className="label-input">
            Tempalate Name
          </label>
          <input
            // className="created-link-wrapper"
            value={this.state.templateItemName}
            name='templateItemName'
            onChange={e => this.handleChange(e)}
            type='text'
          />

          <div className="delete-modal-btn-wrapper">
            <button
              className="btn btn-1 btn-delete-modal"
              onClick={() => this.addTemplate()}
            >
              Add
              </button>
            <button
              className="btn btn-1 btn-delete-modal"
              onClick={this.hideTemplateItemName}
            >
              Exit
            </button>
          </div>
        </Modal>

        {
          (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) &&
          <MobileDevice app={this.props.app} />
        }


        {
          this.props.work.permissionForCollaborator.includes("Edit") ?

            (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ?

              document.getElementById('diagram') &&
                document.getElementsByClassName('srd-diagram')[0] &&
                document.getElementsByClassName('diagram-header-button-save')[0] &&
                document.getElementsByClassName('diagram-header-menu-button')[1] &&
                document.getElementsByClassName('diagram-header-menu-button')[2] &&
                document.getElementsByClassName('panel-buttons')[0] &&
                document.getElementsByClassName('zoom-wrapper')[0] &&
                document.getElementsByClassName('zoom-buttons-wrapper')[0]  ?
                (
                  document.getElementById('diagram').style.height = '100vh',
                  document.getElementsByClassName('srd-diagram')[0].style.overflow = 'scroll',
                  document.getElementsByClassName('diagram-header-button-save')[0].style.display = 'none',
                  document.getElementsByClassName('diagram-header-menu-button')[1].style.display = 'none',
                  document.getElementsByClassName('diagram-header-menu-button')[2].style.display = 'none',
                  document.getElementsByClassName('panel-buttons')[0].style.display = 'none',
                  document.getElementsByClassName('zoom-wrapper')[0].style.display = 'none',
                  document.getElementsByClassName('zoom-buttons-wrapper')[0].style.display = 'none',
                  null
                )
                : null : null

            :

            (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ?

              document.getElementById('diagram') &&
                document.getElementsByClassName('srd-diagram')[0] &&
                document.getElementsByClassName('zoom-wrapper')[0] && 
                document.getElementsByClassName('zoom-buttons-wrapper')[0] ?
                (
                  document.getElementById('diagram').style.height = '100vh',
                  document.getElementsByClassName('srd-diagram')[0].style.overflow = 'scroll',
                  document.getElementsByClassName('zoom-wrapper')[0].style.display = 'none',
                  document.getElementsByClassName('zoom-buttons-wrapper')[0].style.display = 'none',
                  null
                )
                : null : null
        }

        <SettingsNodeRightPanel work={this.props.work} app={this.props.app} />
        <NotesNodeRightPanel work={this.props.work} app={this.props.app} />

        {/* <div className="message-diagram">
          {this.props.work.message && this.props.work.message}
        </div> */}
        <div className="body">
          <div className="header">
            <SaveBeforeExitModal work={this.props.work} app={this.props.app} />

            <UndoRedo />

            <ClickOutside
              onClickOutside={() => {
                this.setState({ showTemplateButtons: false });
              }}
            >
              {
                this.state.showTemplateButtons &&


                <div className='btn-select-template-wrapper'>
                  <button
                    className="btn-select-template"
                    title={"Create Template"}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "transparent",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      onClick={() => this.showTemplateItemName()}
                    />
                    <ReactSVG
                      src={FunnelTemplate}
                    />
                  </button>

                  <button
                    className="btn-select-template"
                    title={"Delete"}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "transparent",
                        position: "absolute",
                        left: 50,
                        top: 0,
                      }}
                      onClick={() => {
                        deleteNode(
                          this.props.app.getDiagramEngine(),
                          this.props.work.funnelId,
                          this.props.work.updateModel
                        )

                        this.setState({
                          showTemplateButtons: false
                        })
                      }}
                    />
                    <ReactSVG
                      src={DeleteSVG}
                    />
                  </button>

                  <button
                    className="btn-select-template"
                    title={"Copy"}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "transparent",
                        position: "absolute",
                        left: 100,
                        top: 0,
                      }}
                      onClick={() => {
                        cloneSelected(
                          this.props.app.getDiagramEngine(),
                          this.props.work.funnelId,
                          this.props.work.updateModel,
                        )

                        this.setState({
                          showTemplateButtons: false
                        })
                      }}
                    />
                    <ReactSVG
                      src={CopySVG}
                    />
                  </button>

                </div>

              }
            </ClickOutside>

            <div className="title">
              {this.props.work.diagram && this.props.work.diagram.funnelName}
            </div>

            <ClickOutside
              onClickOutside={() => {
                this.setState({ showZoomSelect: false });
              }}
            >
              <SelectZoom 
                show={this.state.showZoomSelect}
                style={{
                  right:  
                  this.props.work.permissionForCollaborator.includes("Edit") ? 345 : 
                  this.props.addCollaborators ? 510 : 10 
                }}
              >

                {
                  this.state.selectZoom.map((select,index) => {
                    return (
                      <button
                        key={index}
                        className="button-select-zoom"
                        onClick={() => this.scaleTo(select)}
                      >
                        {this.selectContains(select)}
                      </button>
                    )
                  })
                }

              </SelectZoom>
            </ClickOutside>

            <div
              onClick={() => this.handleToggleAnalytics()}
              className='analytics-button'
              title='Analytics'
              style={{
                right: this.props.addCollaborators && 512
              }}
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
                  this.props.work.permissionForCollaborator.includes("Edit") ?
                    !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ? <EditSVG /> : null
                    : null
                  : ""
              }
            </div>

            {this.props.work.pathname.includes("diagram") ? (
              <>
                {
                  this.props.work.permissionForCollaborator.includes("Edit") ?
                    <>

                      <>
                        <div className="zoom-wrapper">
                          <ReactSVG
                            src={LupaZoom}
                            alt=""
                          />
                          <div
                            className="zoom-count"
                            onClick={this.showZoomSelect}
                          >
                            {this.props.app
                              .getDiagramEngine()
                              .getDiagramModel()
                              .zoom.toFixed(0)}
                            %
                          </div>
                          <ReactSVG
                            src={ArrowZoom}
                            alt=""
                            beforeInjection={svg => {
                              svg.setAttribute("style", "display: flex; padding-top: 10px;");
                            }}
                          />
                        </div>

                        <div className="zoom-buttons-wrapper">
                          <button
                            className="zoom-button-plus"
                            onClick={() => this.scaleTo('plus')}
                            title='Zoom In'
                          >
                            +
                          </button>
                          <button
                            className="zoom-button-minus"
                            onClick={() => this.scaleTo('minus')}
                            title='Zoom Out'
                          >
                            -
                          </button>
                        </div>
                      </>

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

                      {
                        !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ?
                          <div className="diagram-header-instruction-buttons">
                            <ShareFunnelModal
                              work={this.props.work}
                              app={this.props.app}
                            />
                          </div>
                          : null
                      }

                      <FunnelOptionsRightPanel
                        work={this.props.work}
                        app={this.props.app}
                      />
                    </>
                    :
                    <>

                      <div className="zoom-wrapper">
                        <ReactSVG
                          src={LupaZoom}
                          alt=""
                        />
                        <div
                          className="zoom-count"
                          onClick={this.showZoomSelect}
                        >
                          {this.props.app
                            .getDiagramEngine()
                            .getDiagramModel()
                            .zoom.toFixed(0)}
                          %
                          </div>
                        <ReactSVG
                          src={ArrowZoom}
                          alt=""
                          beforeInjection={svg => {
                            svg.setAttribute("style", "display: flex; padding-top: 10px;");
                          }}
                        />
                      </div>

                      <div className="zoom-buttons-wrapper">
                        <button
                          className="zoom-button-plus"
                          onClick={() => this.scaleTo('plus')}
                          title='Zoom In'
                        >
                          +
                          </button>
                        <button
                          className="zoom-button-minus"
                          onClick={() => this.scaleTo('minus')}
                          title='Zoom Out'
                        >
                          -
                          </button>
                      </div>


                    </>
                }

              </>
            ) : (
                <>
                  {
                    this.props.work.permissionForCollaborator.includes("Edit") ?
                      <>
                        <>
                          <div className="zoom-wrapper">
                            <ReactSVG
                              src={LupaZoom}
                              alt=""
                            />
                            <div
                              className="zoom-count"
                              onClick={this.showZoomSelect}
                            >
                              {this.props.app
                                .getDiagramEngine()
                                .getDiagramModel()
                                .zoom.toFixed(0)}
                              %
                          </div>
                            <ReactSVG
                              src={ArrowZoom}
                              alt=""
                              beforeInjection={svg => {
                                svg.setAttribute("style", "display: flex; padding-top: 10px;");
                              }}
                            />
                          </div>

                          <div className="zoom-buttons-wrapper">
                            <button
                              className="zoom-button-plus"
                              onClick={() => this.scaleTo('plus')}
                              title='Zoom In'
                            >
                              +
                          </button>
                            <button
                              className="zoom-button-minus"
                              onClick={() => this.scaleTo('minus')}
                              title='Zoom Out'
                            >
                              -
                          </button>
                          </div>
                        </>

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
                      </>
                      :

                      <>
                        <div className="zoom-wrapper">
                          <ReactSVG
                            src={LupaZoom}
                            alt=""
                          />
                          <div
                            className="zoom-count"
                            onClick={this.showZoomSelect}
                          >
                            {this.props.app
                              .getDiagramEngine()
                              .getDiagramModel()
                              .zoom.toFixed(0)}
                            %
                        </div>
                          <ReactSVG
                            src={ArrowZoom}
                            alt=""
                            beforeInjection={svg => {
                              svg.setAttribute("style", "display: flex; padding-top: 10px;");
                            }}
                          />
                        </div>

                        <div className="zoom-buttons-wrapper">
                          <button
                            className="zoom-button-plus"
                            onClick={() => this.scaleTo('plus')}
                            title='Zoom In'
                          >
                            +
                        </button>
                          <button
                            className="zoom-button-minus"
                            onClick={() => this.scaleTo('minus')}
                            title='Zoom Out'
                          >
                            -
                        </button>
                        </div>
                      </>
                  }
                </>
              )}


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
              this.props.work.permissionForCollaborator.includes("Edit") &&
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
                <TrayWidget show={this.state.show && !this.state.showTemplateItemName}>
                  {this.createTemplatesItemsWidget()}
                </TrayWidget>
              </ClickOutside>
            ) : null}

            <div id="diagram" ref={ref => this.diagramReff = ref}>
              <div
                id="diagram-layer"
                ref={ref => this.diagramRef = ref}
                onDrop={event => {
                  try {
                    if (event.dataTransfer.getData("storm-diagram-templates")) {
                      const data = JSON.parse(
                        event.dataTransfer.getData("storm-diagram-templates")
                      );

                      const points = this.props.app
                        .getDiagramEngine()
                        .getRelativeMousePoint(event);

                      const model2 = new RJD.DiagramModel();
                      model2.deSerializeDiagram(JSON.parse(data.model.data), this.props.app
                        .getDiagramEngine());

                      let model = this.props.app
                        .getDiagramEngine().getDiagramModel();
                      let itemMap = {};
                      _.forEach(model2.getSelectedItems(), item => {
                        let newItem = item.clone(itemMap);
                        // offset the nodes slightly

                        if (newItem instanceof CustomNodeModel) {
                          newItem.setPosition(newItem.x + points.x, newItem.y + points.y);
                          model.addNode(newItem);
                        } else if (newItem instanceof AdvancedLinkModel) {
                          // offset the link points
                          newItem.getPoints().forEach(p => {
                            p.updateLocation({ x: p.getX() + points.x, y: p.getY() + points.y });
                          });
                          model.addLink(newItem);
                        }

                        newItem.selected = true;

                      });
                    }
                    else {
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
                    }
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

                onMouseMove={e => {
                  e.persist()
                  this.showToolElement(e)
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
                  actionStoppedFiring={(e) => {
                    setTimeout(() => {
                      this.props.work.updateModel(
                        this.props.app.serialization(this.props.app.getDiagramEngine().getDiagramModel()),
                        this.props.work.funnelId
                      )
                    })
                  }}

                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
