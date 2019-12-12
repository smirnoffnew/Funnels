import React from "react";

class ModalPortalBody extends React.Component {
  componentDidMount = () => {
    setTimeout(() => {
      this.props.dispatch({
        type: "DELETE_TOSTER",
        payload: {
          id: this.props.id
        }
      })
    }, 2000);
  }

  componentDidUpdate = () => {
    setTimeout(() => {
      this.props.dispatch({
        type: "DELETE_TOSTER",
        payload: {
          id: this.props.id
        }
      })
    }, 2000);
  }

  render() {
    return (
      <div className={"toster display-block"}>
        <div className="toster-main">
          <button className="close-toster" onClick={() =>
            this.props.dispatch({
              type: "DELETE_TOSTER",
              payload: {
                id: this.props.id
              }
            })}>X</button>
          {this.props.data}
        </div>
      </div>
    );
  }
};

export default ModalPortalBody;