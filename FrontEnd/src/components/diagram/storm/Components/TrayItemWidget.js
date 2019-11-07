import * as React from "react";
import ReactSVG from 'react-svg';

export class TrayBigItemWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props)
    return (
      <div className='tray-item-body'>
        <div className='tray-item-wrapper'>
          <div
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
            }}
          >
            <div style={{ width: '100%' }}>
              <ReactSVG
                src={this.props.icon}
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 91px; height: 122px;')
                }}
              />
            </div>
          </div>
        </div>
        {this.props.name}
      </div>
    );
  }
}

export class TraySmallItemWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props)
    return (
      <div className='tray-item-body'>
        <div className='tray-item-wrapper'>
          <div
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
            }}
          >
            <div style={{ width: '100%' }}>
              <ReactSVG
                src={this.props.icon}
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 51px; height: 51px;')
                }}
              />
            </div>
          </div>
        </div>
        {this.props.name}
      </div>
    );
  }
}

export class TrayTextItemWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props)
    return (
      <div className='tray-item-body'>
        <div className='tray-item-wrapper'>
          <div
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
            }}
          >
            <div style={{ width: '100%' }}>
              <ReactSVG
                src={this.props.icon}
                beforeInjection={svg => {
                  svg.setAttribute('style', 'width: 51px; height: 51px;')
                }}
              />
            </div>
          </div>
        </div>
        {this.props.name}
      </div>
    );
  }
}

export class TrayTemplatesItemWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props)
    return (
      <div className='tray-item-body'>
        <div className='tray-item-wrapper'>
          <div
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData("storm-diagram-templates", JSON.stringify(this.props));
            }}
          >
            <div style={{ width: '100%' }}>
              <ReactSVG
                src={this.props.icon}
                beforeInjection={svg => {
                  // svg.setAttribute('style', 'width: 51px; height: 51px; background: rgb(33, 41, 57);')
                  svg.setAttribute('style', 'width: 51px; height: 51px; ')
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              this.props.delete()
            }}
            style={{
              position: "absolute",
              top: -6,
              right: -10,
              border: 0,
              cursor: "pointer",
              margin: "inherit",
              padding: "0px 4px 2px 4px",
              borderRadius: "35%",
              fontSize: 14,
              backgroundColor: "#ffabab"
            }}
            title={"Delete Template"}
          >
            x
          </button>
        </div>
        <div 
          className='tray-item-name'
          title={this.props.name}
        >
          {this.props.name}
        </div>
      </div>
    );
  }
}




