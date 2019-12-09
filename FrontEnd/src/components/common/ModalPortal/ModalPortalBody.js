import React from "react";

class ModalPortalBody extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.toster.style.transform = 'scale(1)';
      this.toster.style.opacity = '1';
    }, 500);

    setTimeout(() => {
      this.props.dispatch({
        type: "DELETE_TOSTER",
        payload: {
          id: this.state.id
        }
      })
    }, 5000);
  }

  render() {



    return (
      <div className={"toster display-block"}>
        <div className="toster-main" ref={ref => this.toster = ref} >
          <button className="close-toster" onClick={() =>
            this.props.dispatch({
              type: "DELETE_TOSTER",
              payload: {
                id: this.state.id
              }
            })}>X</button>
          {this.props.data}
        </div>
      </div>
    );
  }
};

export default ModalPortalBody;