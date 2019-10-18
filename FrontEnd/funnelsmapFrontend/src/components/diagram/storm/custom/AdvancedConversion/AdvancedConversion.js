import React from 'react';
import { PortWidget } from "storm-react-diagrams";
import * as _ from "lodash";
import { isEmpty } from '../../utils';
import './AdvancedConversion.css'
import { AdvancedLinkModel } from '../customLink/customLink';


const getCounterUrl = (array, value) => {
  const obj =
    array &&
    array.filter((arr, i) => {
      return arr.nodeId === value ? arr.counterUrl : null;
    });
  return obj[0] && obj[0].counterUrl && obj[0].counterUrl
    ? obj[0].counterUrl
    : 0;
}

const getCounterNode = (array, value) => {
  const obj =
    array &&
    array.filter((arr, i) => {
      return arr.nodeId === value ? arr.counterNode : null;
    });
  return obj[0] && obj[0].counterNode && obj[0].counterNode
    ? obj[0].counterNode
    : 0;
}

const getConversions = (
  nameOfAdvancedConversion,
  conversionInfoForAllNodes,
  node,
  allNodes
) => {
  try {
    if (conversionInfoForAllNodes) {
      return node.extras.conversions &&
        node.extras.conversions.map(item => {
          if (item.to.id === node.id) {
            if (item.from.type === 'utm') {
              if (item.to.type === nameOfAdvancedConversion) {
                const counterUTMFrom = getCounterUrl(
                  conversionInfoForAllNodes,
                  item.from.id
                )

                let portId
                item.from.portId !== undefined ? 
                portId = item.from.portId :
                allNodes.map(elem => {
                  if (item.from.id === elem.id) {
                    elem.ports.map(el => {
                      if(el.name === "clickOnLink"){
                        portId = el.id
                      }
                    })
                  } 
                })

                return {
                  count: counterUTMFrom,
                  portId
                }
              }
              return null
            }
            if (item.from.type === 'pageVisited') {
              if (item.to.type === nameOfAdvancedConversion) {
                const counterPageFrom = getCounterNode(
                  conversionInfoForAllNodes,
                  item.from.id
                )

                let portId
                item.from.portId !== undefined ? 
                portId = item.from.portId :
                allNodes.map(elem => {
                  if (item.from.id === elem.id) {
                    elem.ports.map(el => {
                      if(el.name === "activeOnPage"){
                        portId = el.id
                      }
                    })
                  } 
                })

                return {
                  count: counterPageFrom,
                  portId
                }
              }
              return null
            }
          }
          return null
        })
    }
  } catch (e) {
    console.log('error', e)
  }
}

export const getAdvancedConversion = (
  conversionName,
  conversionInfoForAllNodes,
  node,
  allNodes
) => {
  let fd = getConversions(
    conversionName,
    conversionInfoForAllNodes,
    node,
    allNodes
  )
  if (fd) {
    fd = fd.filter(x => {
      return x !== undefined && x !== null;
    });
    const sourcePortsArr = node.ports[conversionName].links &&
      Object.values(node.ports[conversionName].links).map(item => {
        return item.sourcePort.id
      });
    const result = fd.filter(u => sourcePortsArr.includes(u.portId));
    const uniqueArray = result.filter((thing, index) => {
      return index === result.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(thing);
      });
    });
    const initialValue = 0;
    const total = uniqueArray.reduce(
      (acc, curr) => acc + curr.count,
      initialValue
    );
    if (conversionInfoForAllNodes) {
      const counterPageTo = getCounterNode(
        conversionInfoForAllNodes,
        node.id
      )
      const advancedConversion = (counterPageTo / total) * 100
      if (total === 0) {
        return counterPageTo + '/0%'
      }

      return counterPageTo + '/' + advancedConversion.toFixed(2) + "%"
    }
  }
}

const AdvancedConversion = ({
  hideConversionLinkBoolean,
  conversionName,
  index,
  node,
  advancedConversion,
  conversionInfoForAllNodes,
  allNodes,
}) => {

  return (
    <div className='advanced-conversion-block'>
      <div className='conversion-wrapper'>
        <div
          className='top-anal'
          style={{
            display: 'flex'
          }}
        >
          {conversionName.replace('conversion', 'Conversion ')}

          <div
            className='conversion-delete'
            style={{
              display: hideConversionLinkBoolean ? 'block' : 'none',
            }}
            title='delete'
            onClick={() => {
              node.extras.conversionsContainer.splice(index, 1)

              node.extras.conversions &&
                node.extras.conversions.forEach((item, index) => {
                  if (
                    item.to.id === node.id &&
                    item.to.type === conversionName
                  ) {
                    node.extras.conversions.splice(
                      index,
                      1
                    )
                  }
                })
              _.forEach(node.ports[conversionName].links, item => {
                if (item instanceof AdvancedLinkModel) {
                  item.remove()
                }
              });
              document.getElementById("diagram-layer").click();
            }}>X</div>
        </div>
        <div
          className='bottom-anal'
        >
          {
            node.ports[conversionName] &&
              node.ports[conversionName].links &&
              !isEmpty(node.ports[conversionName].links) ?
              getAdvancedConversion(
                conversionName,
                conversionInfoForAllNodes,
                node,
                allNodes
              )
              :
              node.extras.conversions &&
              node.extras.conversions.forEach((item, index) => {
                if (
                  item.to.id === node.id &&
                  item.to.type === conversionName
                ) {
                  node.extras.conversions.splice(
                    index,
                    1
                  )
                }
              })
          }
        </div>
      </div>
      <div
        className='conversion-port'
        style={{
          left: -16,
          position: 'absolute',
          zIndex: 100,
          opacity: hideConversionLinkBoolean ? 1 : 0,
        }}
        onMouseUp={() => {
          node.setConversions &&
            node.setConversions(
              {
                from: advancedConversion,
                to: {
                  id: node.id,
                  type: conversionName
                }
              }
            )
        }}
      >
        <PortWidget
          name={conversionName}
          node={node}
        />
      </div>
    </div>
  );
}

export default AdvancedConversion;