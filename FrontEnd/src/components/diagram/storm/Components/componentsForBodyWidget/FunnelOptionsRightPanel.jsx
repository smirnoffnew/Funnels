import * as React from "react";
import domtoimage from "dom-to-image";
import randomString from "random-string";
import ModalFunnelWidget from "../../../../common/ModalFunnelWidget";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as MenuWidgetSVG } from "../../../../../assets/menu-widget.svg";

export default class FunnelNotesRightPanel extends React.Component {
  state = {
    showMenu: false,
    funnelName: (this.props.work.diagram && this.props.work.diagram.funnelName) || '',
    handleGrid: (this.props.work.diagram && this.props.work.diagram.handleGrid) || false,
  };

  showMenu = () =>
    this.setState({
      showMenu: true,
      showNotes: false,
      funnelName: (this.props.work.diagram && this.props.work.diagram.funnelName) || '',
      handleGrid: (this.props.work.diagram && this.props.work.diagram.handleGrid) || false,
    });
  hideMenu = () => {
    this.setState({ showMenu: false });
  }

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  handleChangeCheckbox = () => {
    this.setState(prev => ({handleGrid: !prev.handleGrid}), () => {
      let name = randomString({ length: 10 });
      var file = new File([], name, { type: "image/svg" });
      this.saveDiagramHandle(file);
    })
  }
  
  saveDiagramHandle = file =>
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.app.getDiagramEngine().getDiagramModel()
        )
      },
      () => {
        this.props.work.saveDiagram(this.props.work.funnelId, this.state, file);
      }
    );

  render() {
    return (
      <>
        {this.props.work.pathname.includes("diagram") ? (
          <>
            <button
              className="diagram-header-menu-button"
              onClick={this.showMenu}
              // style={{ background: this.state.showMenu ? "#ecf1f2" : "#fff" }}
            >
              <MenuWidgetSVG />
            </button>
          </>
        ) : null}

        <ClickOutside
          onClickOutside={() => {
            this.setState({ showMenu: false });
          }}
        >
          <ModalFunnelWidget
            show={this.state.showMenu}
            handleClose={this.hideMenu}
            style={{
              position: "absolute",
              top: 65
            }}
          >
            <label className="label-create-widget-settings">
              Funnel Options
            </label>
            <div style={{ padding: 15 }}>
              <label htmlFor="FunnelName" className="label-input">
                Funnel Name
              </label>
              <input
                id="FunnelName"
                placeholder="Funnel Name"
                type="text"
                value={this.state.funnelName}
                onChange={this.handleChange}
                name="funnelName"
              />
              {this.props.work.changeFunnelNameMessage && (
                <div className={`input-group`}>
                  {this.props.work.changeFunnelNameMessage}
                </div>
              )}
              <label 
                htmlFor="CheckBox" 
                className="container-checkbox"
              >
                Show Grid
                <input
                  id='CheckBox'
                  type="radio"
                  checked={this.state.handleGrid}
                  onClick={this.handleChangeCheckbox}
                  onChange={()=>{}}
                />
                <span className="checkmark"></span>
              </label> 
              <button
                className="btn btn-1 create-project-button-in-modal"
                style={{ display: "block" }}
                onClick={() => {
                  let diagram = document.getElementById("diagram-layer");
                  domtoimage
                    .toBlob(diagram)
                    .then(data => {
                      let name = randomString({ length: 10 });
                      var file = new File([data], name, { type: "image/svg" });
                      this.saveDiagramHandle(file);
                      this.props.work.changeFunnelName(
                        this.props.work.funnelId,
                        this.state.funnelName
                      );
                    })
                    .catch(function(error) {
                      console.error("oops, something went wrong!", error);
                    });
                }}
              >
                Save
              </button>
            </div>
          </ModalFunnelWidget>
        </ClickOutside>
      </>
    );
  }
}
