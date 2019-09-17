import * as _ from "lodash";
import { PointModel } from "storm-react-diagrams";
import randomString from "random-string";
import { CustomNodeModel } from "./CustomNodeModel";
import { AdvancedLinkModel } from "./customLink";
import { API } from '../../../../store/actions/instance'


const simulateKey = (keyCode, type) => {
  var evtName = typeof type === "string" ? "key" + type : "keydown";
  var event = document.createEvent("HTMLEvents");
  event.initEvent(evtName, true, false);
  event.keyCode = keyCode;
  document.dispatchEvent(event);
}

export const deleteNode = (funnelId, nodeId) => {
  simulateKey(46, "up");
  API.delete(`funnel/node/delete/${nodeId}/${funnelId}`).then(() => console.log())
};

export const deleteAllLinks = engine => {

  _.forEach(engine.getDiagramModel().getSelectedItems(), item => {
    if (item instanceof PointModel) {
      // console.log("delete", engine)
      item.parent.remove();
    }
  });
  // document.getElementById("diagram-layer").click();
};

export const serializationInWidget = activeModel => {
  return JSON.stringify(activeModel.serializeDiagram());
}

export const cloneSelected = (
  funnelName,
  funnelNotes,
  engine,
  saveDiagramThenShowOrHideSettingsModal,
  funnelId,
  node
) => {
  let offset = { x: 100, y: 100 };
  let model = engine.getDiagramModel();
  let itemMap = {};
  _.forEach(model.getSelectedItems(), item => {
    let newItem = item.clone(itemMap);
    // offset the nodes slightly
    if (newItem instanceof CustomNodeModel) {
      newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
      model.addNode(newItem);
    } else if (newItem instanceof AdvancedLinkModel) {
      // offset the link points
      newItem.getPoints().forEach(p => {
        p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
      });
      model.addLink(newItem);
    }
    newItem.selected = false;
  });
  // document.getElementById("diagram-layer").click();

  // save for handle rename another item itself
  const name = randomString({ length: 10 });
  const file = new File(["test"], name, {
    type: "image/png"
  });
  saveDiagramThenShowOrHideSettingsModal(
    funnelId,
    {
      snackMsg: "next",
      converted: serializationInWidget(engine.getDiagramModel()),
      funnelName,
      funnelNotes,
    },
    file,
    false,
    node,
    engine.getDiagramModel()
  );
};

export const showRightModal = (
  funnelName,
  funnelNotes,
  showRightModal,
  funnelId,
  engine,
  node,
  typeOfNode,
) => {
  const name = randomString({ length: 10 });
  const file = new File(["test"], name, {
    type: "image/png"
  });
  showRightModal(
    funnelId,
    {
      snackMsg: "next",
      converted: serializationInWidget(engine.getDiagramModel()),
      funnelName,
      funnelNotes,
    },
    file,
    true,
    node,
    engine.getDiagramModel(),
    typeOfNode,
  );
};