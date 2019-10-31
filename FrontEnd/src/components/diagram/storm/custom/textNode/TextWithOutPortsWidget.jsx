import * as React from "react";
import { PortWidget } from "storm-react-diagrams";
import { connect } from "react-redux";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as CopySVG } from "../../../../../assets/selectForWidget/copy.svg";
import { ReactComponent as DeleteSVG } from "../../../../../assets/selectForWidget/delete.svg";
import {
  saveDiagramThenShowOrHideSettingsModal,
  saveDiagramThenShowOrHideNotesModal
} from "../../../../../store/actions/projects";
import { cloneSelected, deleteNode } from "../funcsForCustomNodeWidget";
import './TextWithOutPortsWidget.css'

const Select = ({ show, children }) => {
  const showHideClassName = show
    ? "select-modal-node-widget display-block"
    : "select-modal-node-widget display-none";

  return (
    <div className={showHideClassName}>
      <section 
        className="select-horizontally-without-ports" 
      >
        {children}
      </section>
    </div>
  );
};

class TextWithOutPortsWidget extends React.Component {
  state = {
    show: false,
    handleGridTwo: false,
    text: "",
  };

  showModal = () => {
    this.setState({
      show: true,
      handleGrid: this.props.diagram && this.props.diagram.handleGrid
    });
  }

  hideModal = () => {
    this.setState({ 
      show: false, 
      handleGridTwo: false 
    });
  };

  mouseMove = () => {
    this.state.handleGrid && this.setState({ handleGridTwo: true })
  }

 handleChangeText = e => {
    e.target.style.height = 'inherit';
    e.target.style.width = 'inherit';
    this.setState({
      text: e.target.value,
      height: e.target.scrollHeight,
      width: e.target.scrollWidth,
    }, () => {
      (this.props.node.setName &&
        this.props.node.setName(this.state.text));
      (this.props.node.setHeight &&
        this.props.node.setHeight(this.state.height));
      (this.props.node.setWidth &&
        this.props.node.setWidth(this.state.width))
    });
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.width = `${e.target.scrollWidth}px`;
  }

  render() {
    return (
      <>
        <div
          style={{
            position: "relative",
            zIndex: 10,
          }}
          onMouseEnter={
            !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) &&
            this.showModal
          }
          onMouseLeave={this.hideModal}
          onMouseMove={
            !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) &&
            this.mouseMove
          }
        > 
          {
            this.state.handleGridTwo ?
            
            <>
              <div className='left-line' />
              <div className='right-line' />
              <div className='top-line' />
              <div className='bottom-line' />
            </> : null
          }

          <textarea
            className='node-panel-textarea-without-ports'
            style={{ 
              height:
                this.props.node && 
                this.props.node.extras.heightd === undefined ? 

                this.props.node && 
                50 : 

                this.props.node && 
                this.props.node.extras.heightd,

              width:
                this.props.node && 
                this.props.node.extras.widthd === undefined ? 

                this.props.node && 
                195 : 

                this.props.node && 
                this.props.node.extras.widthd,
            }}
            placeholder="text"
            type="text"
            value={
              this.state.text === '' ?  

                this.props.node && 
                this.props.node.extras.named === undefined ? 

                this.props.node && 
                // this.props.work.showSettingsWidgetModel.type : 
                '' : 

                this.props.node && 
                this.props.node.extras.named

              : this.state.text
            }
            onChange={this.handleChangeText}
          />

          <ClickOutside
            onClickOutside={() => {
              this.setState({ show: false });
            }}
            onMouseEnter={this.showModal}
          >
            <Select show={this.state.show}>
              <button
                className="btn-select-widget"
                onClick={() => cloneSelected(
                  this.props.diagram.funnelName,
                  this.props.diagram.funnelNotes,
                  this.props.engine,
                  this.props.saveDiagramThenShowOrHideSettingsModal,
                  this.props.funnelId,
                  this.props.node,
                )}
                title={"Copy"}
              >
                <CopySVG />
              </button>
              <button
                className="btn-select-widget"
                onClick={() => deleteNode(
                  this.props.engine, 
                  this.props.funnelId, 
                  this.props.node.id
                )}
                title={"Delete"}
              >
                <DeleteSVG />
              </button>
            </Select>
          </ClickOutside>

          <div style={{ display: 'none' }} >
            <PortWidget name="top" node={this.props.node} />
            <PortWidget name="bottom" node={this.props.node} />
            <PortWidget name="left" node={this.props.node} />
            <PortWidget name="right" node={this.props.node} />
            <PortWidget name="clickOnLink" node={this.props.node} />
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
    diagram: state.projects[`diagram${state.router.location.pathname.substring(9)}`],
    showSettingsWidgetBoolean: state.projects.showSettingsWidgetBoolean,
    showSettingsWidgetModel: state.projects.showSettingsWidgetModel,

    showNotesWidgetBoolean: state.projects.showNotesWidgetBoolean,
    showNotesWidgetModel: state.projects.showNotesWidgetModel,

    funnelId: state.router.location.pathname.substring(9),
    svgList: state.projects.svgList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveDiagramThenShowOrHideSettingsModal: (
      id,
      state,
      file,
      boolean,
      model,
      engine
    ) =>
      dispatch(
        saveDiagramThenShowOrHideSettingsModal(
          id,
          state,
          file,
          boolean,
          model,
          engine
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
)(TextWithOutPortsWidget);
