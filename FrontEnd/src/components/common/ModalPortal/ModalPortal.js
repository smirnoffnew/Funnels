import React from 'react';
import ReactDOM from 'react-dom';
import './ModalPortal.css'
import { connect } from "react-redux";
import ModalPortalBody from './ModalPortalBody';

class ModalPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');

    this.el.style.position = 'absolute';
    this.el.style.display = 'flex';
    this.el.style.flexDirection = 'column-reverse';
    this.el.style.bottom = '3%';
    this.el.style.right = '3%';
    this.el.style.alignItems = 'flex-end';
    this.el.style.height = '190px';
    this.el.style.overflow = 'hidden';

    this.portal = document.getElementById('app');
  }

  componentDidMount() {
    this.portal.appendChild(this.el);
  }

  componentWillUnmount() {
    this.portal.removeChild(this.el);
  }

  render() {
    return this.props.tosterList.length > 0 && this.props.tosterList.map((toster, index) => {
      return ReactDOM.createPortal(
        <ModalPortalBody 
          key={index}
          data={toster.data} 
          id={toster.id} 
          dispatch={this.props.dispatch}
        />,
        this.el,
      );
    })
  }
}

function mapStateToProps(state) {
  return {
    tosterList: state.toster.tosterList,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: item => dispatch(item)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalPortal);
