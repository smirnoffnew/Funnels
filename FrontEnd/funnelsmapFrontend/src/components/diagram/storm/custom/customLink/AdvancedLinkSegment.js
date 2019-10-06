import React from "react";
import { connect } from 'react-redux'

class AdvancedLinkSegment extends React.Component {
  constructor(props) {
    super(props);
    this.progress = props.inversed ? 100 : 0;

    this.state = {
      buttonVisible: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.circle.setAttribute("opacity", 0)

    this.callback = () => {
      if (!this.circleTarget || !this.pathForHover) {
        return;
      }
      let progress;

      if (this.props.inversed) {
        progress = 0;
      } else {
        progress = 100;
      }

      let pointTarget = this.pathForHover.getPointAtLength(
        Number.parseInt((this.pathForHover.getTotalLength() * (progress / 100.0)).toFixed())
      );
      this.circleTarget.setAttribute("cx", pointTarget.x);
      this.circleTarget.setAttribute("cy", pointTarget.y);

      this.circleTarget2.setAttribute("cx", pointTarget.x);
      this.circleTarget2.setAttribute("cy", pointTarget.y);

      if (this.mounted) {
        requestAnimationFrame(this.callback);
      }
    };
    requestAnimationFrame(this.callback);
  }

  show = () => this.circle.setAttribute("opacity", 1);
  hide = () => this.circle.setAttribute("opacity", 0);

  componentWillUnmount() {
    this.mounted = false;
  }

  onMouseEnter = () => {
    this.show()
    const length = this.pathForHover.getTotalLength(),
      step = 4 * 100 / length; // Move 100px for 1000ms

    this.progress = this.props.inversed ? 100 : 0; // reset progress

    this.animation = requestAnimationFrame(() => {
      this.animateCircle(length, step)
    });

    this.setState({
      buttonVisible: true
    }, () => {
      let point = this.pathForHover.getPointAtLength(
        Number.parseInt((length / 2).toFixed())
      );

      this.circleDelete.setAttribute("cx", point.x - 10);
      this.circleDelete.setAttribute("cy", point.y - 10);
    })
  }

  onMouseLeave = () => {
    this.hide()
    cancelAnimationFrame(this.animation);

    this.setState({
      buttonVisible: false
    })
  }

  animateCircle = (length, step) => {
    const { inversed } = this.props;

    if (this.pathForHover && this.circle) {
      if (inversed) {
        this.progress -= step;
        if (this.progress < 0) {
          this.progress = 100;
        }
      } else {
        this.progress += step;
        if (this.progress > 100) {
          this.progress = 0;
        }
      }

      let point = this.pathForHover.getPointAtLength(
        Number.parseInt((length * (this.progress / 100.0)).toFixed())
      );

      this.circle.setAttribute("cx", "" + point.x);
      this.circle.setAttribute("cy", "" + point.y);

      this.animation = requestAnimationFrame(() => {
        this.animateCircle(length, step);
      });
    }
  }

  simulateKey(keyCode, type) {
    const evtName = (typeof (type) === "string") ? "key" + type : "keydown";
    const event = document.createEvent("HTMLEvents");
    event.initEvent(evtName, true, false);
    event.keyCode = keyCode;
    document.dispatchEvent(event);
    document.getElementById("diagram-layer").click();
  }

  render() {
    const { path, model, /*selected*/ } = this.props;

    if(this.props.hideConversionLinkBoolean){
      if(
        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion1' ||

        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion2' ||

        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion3'

      ){
        this.props.model.width = 2
      }
      else {
        this.props.model.width = 0
      }
    }
    else {
      if(
        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion1' ||

        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion2' ||

        (this.props.model.targetPort && 
        this.props.model.targetPort.position && 
        this.props.model.targetPort.position) === 'conversion3'

      ){
        this.props.model.width = 0
      }
      else {
        this.props.model.width = 2
      }
    }


    return (
      <>
        <path
          ref={ref => this.path = ref}
          strokeWidth={model.width}
          // stroke={selected ? `rgba(	97, 102, 110, 1)` : `rgba(	97, 102, 110, 0.5)`}

          stroke={this.props.hideConversionLinkBoolean ? 'blue' : 'rgba(97, 102, 110, 0.7)'}
          strokeDasharray="5,5"
          d={path}
        />

        <path
          ref={ref => this.pathForHover = ref}
          strokeWidth={model.width * 20}
          strokeOpacity='0'
          d={path}

          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />

        <circle
          ref={ref => this.circle = ref}
          r={3}
          fill={this.props.hideConversionLinkBoolean ? 'blue' : '#fd8f21'}
        />

        {
          this.state.buttonVisible ?

            // <svg>
            //     <circle 
            //       fill="#333"
            //       r="20" 

            //       // cx="122" 
            //       // cy="125"

            //       ref={ref => this.circleDelete1 = ref}
            //       onMouseEnter={this.onMouseEnter}
            //       onMouseLeave={this.onMouseLeave}
            //     />
            //     <ellipse 
            //       transform="rotate(-45, 57, 55)"
            //       fill="red"

            //       // rx="3" 
            //       // ry="21" 

            //       // cx="55" 
            //       // cy="150" 

            //       ref={ref => this.circleDelete2 = ref}
            //       onMouseEnter={this.onMouseEnter}
            //       onMouseLeave={this.onMouseLeave}
            //     />
            //     <ellipse 
            //       transform="rotate(45, 187, 55)"
            //       fill="red"

            //       // rx="3" 
            //       // ry="21" 
            //       // cx="190"
            //       // cy="150" 

            //       ref={ref => this.circleDelete3 = ref}
            //       onMouseEnter={this.onMouseEnter}
            //       onMouseLeave={this.onMouseLeave}
            //     />
            // </svg>


            <circle
              className={'circle-delete'}
              onClick={() => this.simulateKey(46, "up")}
              r={8}
              fill="red"

              ref={ref => this.circleDelete = ref}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
            />
            :
            null
        }

        <circle 
          ref={ref => this.circleTarget = ref} 
          r={6}
          fill={this.props.hideConversionLinkBoolean ? 'blue' : '#fd8f21'} 
        />
        <circle 
          ref={ref => this.circleTarget2 = ref} 
          r={2}
          fill="#fff" 
        />

      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    hideConversionLinkBoolean: state.conversion.hideConversionLinkBoolean
  };
}

export default connect(
  mapStateToProps
)(AdvancedLinkSegment)