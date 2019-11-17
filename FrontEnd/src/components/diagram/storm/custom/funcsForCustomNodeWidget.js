import * as _ from "lodash";
import { PointModel } from "storm-react-diagrams";
import randomString from "random-string";
import { CustomNodeModel } from "./CustomNodeModel";
import { AdvancedLinkModel } from "./customLink/customLink";
import { API } from '../../../../store/actions/instance'

export const deleteNode = (engine, funnelId, updateModel) => {

  _.forEach(engine.getDiagramModel().getSelectedItems(), item => {
    if (item instanceof CustomNodeModel) {
      // API.delete(`funnel/node/delete/${item.id}/${funnelId}`).then(() => console.log())
      item.remove()
    }
    if (item instanceof PointModel) {
      item.remove()
    }
  });

  setTimeout(() => {
    updateModel(
      serializationInWidget(engine.getDiagramModel()),
      funnelId,
    )
  })

};

export const deleteLink = (engine, funnelId, updateModel)  => {
  _.forEach(engine.getDiagramModel().getSelectedItems(), item => {
    if (item instanceof AdvancedLinkModel) {
      item.remove()
    }
  });

  setTimeout(() => {
    updateModel(
      serializationInWidget(engine.getDiagramModel()),
      funnelId,
    )
  })
  // document.getElementById("diagram-layer").click();
};

export const deleteAllLinks = (engine, funnelId, updateModel) => {
  _.forEach(engine.getDiagramModel().getSelectedItems(), item => {
    if (item instanceof PointModel) {
      // console.log("delete", engine)
      item.parent.remove();
    }
  });
  
  setTimeout(() => {
    updateModel(
      serializationInWidget(engine.getDiagramModel()),
      funnelId,
    )
  })
  // document.getElementById("diagram-layer").click();
};

export const serializationInWidget = activeModel => {
  return JSON.stringify(activeModel.serializeDiagram());
}

// const deSerialization = (engine, str) => {
//   const model2 = new RJD.DiagramModel();
//   model2.deSerializeDiagram(JSON.parse(str), engine);
//   // engine.setDiagramModel(model2);
//   return model2;
// }

export const cloneSelected = (
  engine,
  funnelId,
  updateModel
) => {
  try {
    let offset = { x: 100, y: 100 };
    let model = engine.getDiagramModel();
    let itemMap = {};
    _.forEach(model.getSelectedItems(), item => {
      let newItem = item.clone(itemMap);
      item.selected = false;
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
      newItem.selected = true;
    });

    setTimeout(() => {
      updateModel(
        serializationInWidget(engine.getDiagramModel()),
        funnelId,
      )
    })

  }
  catch(e){
    console.log('error', e.message)
  }
};

export const showRightModal = (

  node,
  funnelName,
  funnelNotes,
  saveDiagramThenShowOrHideModal,
  funnelId,
  engine,
  updateModel,
  typeOfNode,
  
) => {
  saveDiagramThenShowOrHideModal(
    updateModel,

    engine.getDiagramModel(),
    node,
    
    funnelId,
    {
      snackMsg: "next",
      converted: serializationInWidget(engine.getDiagramModel()),
      funnelName,
      funnelNotes,
    },
    true,
    
    typeOfNode,
  );
};