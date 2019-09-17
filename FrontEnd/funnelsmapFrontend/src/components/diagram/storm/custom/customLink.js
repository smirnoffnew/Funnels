import * as React from "react";
import {
  DefaultPortModel,
  DefaultLinkModel,
  DefaultLinkFactory,
} from "storm-react-diagrams";

export class AdvancedLinkModel extends DefaultLinkModel {
  constructor() {
    super("advanced");
    this.width = 2;
  }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel() {
    return new AdvancedLinkModel();
  }
}

export class AdvancedLinkSegment extends React.Component {
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

      //       this.circleDelete1.setAttribute("cx", point.x - 10);
      // this.circleDelete1.setAttribute("cy", point.y - 10);

      //       this.circleDelete2.setAttribute("cx", point.x);
      // this.circleDelete2.setAttribute("cy", point.y);
      
      //       this.circleDelete3.setAttribute("cx", point.x - 80);
      // this.circleDelete3.setAttribute("cy", point.y - 850);
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
    var evtName = (typeof (type) === "string") ? "key" + type : "keydown";
    var event = document.createEvent("HTMLEvents");
    event.initEvent(evtName, true, false);
    event.keyCode = keyCode;
    document.dispatchEvent(event);
  }

  render() {
    const { path, model, selected } = this.props;

    // console.log(this.state.buttonVisible)
    return (
      <>
        <path
          ref={ref => this.path = ref}
          strokeWidth={model.width}
          stroke={selected ? `rgba(	97, 102, 110, 1)` : `rgba(	97, 102, 110, 0.5)`}
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
          fill="orange"
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
            //     {/* <ellipse 
            //       // transform="rotate(-45, 57, 55)"
            //       transform="translate(-30,0)"
            //       // transform="skewX(45)"
            //       fill="red"

            //       rx="3" 
            //       ry="21" 

            //       // cx="55" 
            //       // cy="150" 

            //       ref={ref => this.circleDelete2 = ref}
            //       onMouseEnter={this.onMouseEnter}
            //       onMouseLeave={this.onMouseLeave}
            //     /> */}
            //     <ellipse 
            //       // transform="rotate(45, 187, 55)"
            //       // transform="translate(10,0)"
            //       // transform="skewX(-45)"
            //       transform="rotate(45)"
            //       fill="red"

            //       rx="3" 
            //       ry="21" 
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

        <circle ref={ref => this.circleTarget = ref} r="6" fill="#fd8f21" />
        <circle ref={ref => this.circleTarget2 = ref} r="2" fill="#fff" />

      </>
    );
  }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "advanced";
  }

  getNewInstance(initialConfig) {
    return new AdvancedLinkModel();
  }

  getDirection(source, target) {
    const difX = source.x - target.x
    const difY = source.y - target.y
    const isHorisontal = Math.abs(difX) > Math.abs(difY);

    return isHorisontal ? difX > 0 : difY > 0;
  }

  generateLinkSegment(model, widget, selected, path) {
    return (
        <g>
          <AdvancedLinkSegment
            engine={widget.props.diagramEngine}
            model={model}
            path={path}
            selected={selected}
            inversed={
              model.sourcePort && model.targetPort ?
                this.getDirection(model.sourcePort, model.targetPort)
                : null
            }
          />
        </g>
    );
  }
}



