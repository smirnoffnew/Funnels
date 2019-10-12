import * as _ from "lodash";
import { PortModel } from "storm-react-diagrams";
import { AdvancedLinkModel } from "./customLink/customLink";


export class CustomPortModel extends PortModel {

	constructor(name, pos = "top") {
		super(pos, name);
		this.position = pos;
	}

	canLinkToPort(port) {
		if (port instanceof CustomPortModel) {
			// console.log('this', this)
			if(this.name.includes('conversion')){
				return false
			}
		}
		return true;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data, engine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel() {
		return new AdvancedLinkModel();
	}
}