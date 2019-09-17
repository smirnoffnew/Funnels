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

