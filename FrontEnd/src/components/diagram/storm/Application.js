import * as RJD from "storm-react-diagrams";

//import custom link, port and factory
import { NodeFactory } from "./custom/NodeFactory";
import { PortFactory } from "./custom/PortFactory";
import { AdvancedLinkFactory } from "./custom/customLink/customLink";

// import the custom models
import { CustomPortModel } from "./custom/CustomPortModel";
import { CustomNodeModel } from "./custom/CustomNodeModel";
import BigNodeWidget from "./custom/bigNode/BigNodeWidget";
import SmallNodeWidget from "./custom/smallNode/SmallNodeWidget";
import TextNodeWidget from "./custom/textNode/TextWithPortsWidget";
import API_URL from '../../../config'
import TextWithOutPortsWidget from "./custom/textNode/TextWithOutPortsWidget";

export default class Application {
  constructor(props, svg) {

    this.engine = new RJD.DiagramEngine();
    this.engine.installDefaultFactories();
    this.engine.registerLinkFactory(new AdvancedLinkFactory());

    this.allElements = []

    this.elementsPages = []
    this.elementsTraffic = []
    this.elementsEmailMarketing = []
    this.elementsEvents = []
    this.elementsText = []

    if (svg) {

      let allPages = this.getValues(svg, 'Pages')
      let allTraffic = this.getValues(svg, 'Traffic')
      let allEmailMarketing = this.getValues(svg, 'EmailMarketing')
      let allEvents = this.getValues(svg, 'Events')

      allPages.forEach((item) => (
        this.elementsPages.push(
          {
            name: item.name,
            port: CustomPortModel,
            widget: BigNodeWidget,
            nodeModel: CustomNodeModel,
            svg: API_URL + item.url,
          }
        )
      ))

      allTraffic.forEach((item) => (
        this.elementsTraffic.push(
          {
            name: item.name,
            port: CustomPortModel,
            widget: SmallNodeWidget,
            nodeModel: CustomNodeModel,
            svg: API_URL + item.url,
          }
        )
      ))

      allEmailMarketing.forEach((item) => (
        this.elementsEmailMarketing.push(
          {
            name: item.name,
            port: CustomPortModel,
            widget: SmallNodeWidget,
            nodeModel: CustomNodeModel,
            svg: API_URL + item.url,
          }
        )
      ))

      allEvents.forEach((item) => (
        this.elementsEvents.push(
          {
            name: item.name,
            port: CustomPortModel,
            widget: SmallNodeWidget,
            nodeModel: CustomNodeModel,
            svg: API_URL + item.url,
          }
        )
      ))

      this.elementsText.push({
        name: 'Text Area',
        port: CustomPortModel,
        widget: TextWithOutPortsWidget,
        nodeModel: CustomNodeModel,
      })

      this.elementsText.push({
        name: 'Text Panel',
        port: CustomPortModel,
        widget: TextNodeWidget,
        nodeModel: CustomNodeModel,
      })

      this.allElements = this.allElements.concat(
        this.elementsPages,
        this.elementsTraffic,
        this.elementsEmailMarketing,
        this.elementsEvents,
        this.elementsText,
      );

      this.createElements(this.allElements, this.engine)

      if (props) {
        const oldProps = JSON.parse(props)

        // console.log('oldProps', oldProps)

        oldProps.nodes.map(node => {
          const typeOfNode = node.ports[0].type
          if(node.type === 'Text With Ports'){
            node.type = 'Text Panel'
          }
          if(node.type === 'Text Without Ports'){
            node.type = 'Text Area'
          }
          node.ports.map(port => {
            // console.log('port.type', port.type)
            if (port.type === undefined) {
              port.type = typeOfNode
            }
            if(port.type === 'Text With Ports'){
              port.type = 'Text Panel'
            }
            if(port.type === 'Text Without Ports'){
              port.type = 'Text Area'
            }
          })
        })
        try {
          this.deSerialization(this.engine, JSON.stringify(oldProps))
        }
        catch (e) {
          console.log(e)
        }
      }

    }

  }

  getValues(array, value) {
    var obj = array.filter((arr, i) => {
      return arr.title === value ? arr.data : null;
    });
    return obj[0].data;
  }


  createElements(configElements, engine) {
    return configElements.forEach(item => {
      engine.registerPortFactory(new PortFactory(
        item.name,
        () => new item.port(item.name)
      ));
      engine.registerNodeFactory(new NodeFactory(
        item.name,
        item.widget,
        item.nodeModel,
        item.svg,
      ));
    })
  }

  getDiagramEngine() {
    return this.engine;
  }

  serialization(activeModel) {
    return JSON.stringify(activeModel.serializeDiagram());
  }

  deSerialization(engine, str) {
    const model2 = new RJD.DiagramModel();
    // model2.setGridSize(10);
    model2.addListener({
      // nodesUpdated: e => console.log("nodesUpdated", e),
      // linksUpdated: e => console.log("linksUpdated", e),
      // zoomUpdated: e => console.log("zoomUpdated", e),
      // gridUpdated: e => console.log("gridUpdated", e),
      // offsetUpdated: e => console.log("offsetUpdated", e),
      // entityRemoved: e => console.log("entityRemoved", e),
      // selectionChanged: e => console.log("selectionChanged", e),
    });
    model2.deSerializeDiagram(JSON.parse(str), engine);
    engine.setDiagramModel(model2);
    return model2;
  }
}
