import React from "react";
import {
  DefaultPortModel,
  DefaultLinkModel,
  DefaultLinkFactory,
} from "storm-react-diagrams";
import AdvancedLinkSegment from './AdvancedLinkSegment'

export class AdvancedLinkModel extends DefaultLinkModel {
  constructor(name) {
    super("advanced");
    this.width = 2;
    this.label = name
  }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel() {
    return new AdvancedLinkModel();
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



