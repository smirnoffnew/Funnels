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

export const getAdvancedConversion = (
  nameOfAdvancedConversion,
  conversionInfoForAllNodes,
  node
 ) => {
  try{
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
                const counterPageTo = getCounterNode(
                  conversionInfoForAllNodes,
                  node.id
                )
                if(counterUTMFrom === 0 || counterPageTo === 0){
                  console.log('object')
                  return counterPageTo + '/0%'
                }
                const advancedConversion = (counterPageTo / counterUTMFrom) * 100

                return counterPageTo + '/' + advancedConversion.toFixed(2) + "%"
              }
              console.log('object')
              return null
            }
            if (item.from.type === 'pageVisited') {
              if (item.to.type === nameOfAdvancedConversion) {
                const counterPageFrom = getCounterNode(
                  conversionInfoForAllNodes,
                  item.from.id
                )
                const counterPageTo = getCounterNode(
                  conversionInfoForAllNodes,
                  node.id
                )
                const advancedConversion = counterPageFrom - counterPageTo

                return advancedConversion
              }
              console.log('object')
              return null
            }
          }
          console.log('object')
          return null
        })
    }
  } catch (e) {
    console.log('error', e)
  }
}

const AdvancedConversion = ({ conversionName, index, node, advancedConversion, conversionInfoForAllNodes }) => {
  // const showHideClassName = show ? "modal display-block" : "modal display-none";

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
          _.forEach(node.ports[conversionName.toLowerCase()].links, item => {
            if (item instanceof AdvancedLinkModel) {
              item.remove()
            }
          });
          document.getElementById("diagram-layer").click();
        }}>X</div>
      </div>
      <div className='bottom-anal'>
        {
          node.ports[conversionName.toLowerCase()] && 
          node.ports[conversionName.toLowerCase()].links && 
          !isEmpty(node.ports[conversionName.toLowerCase()].links) ?
            getAdvancedConversion(
              conversionName,
              conversionInfoForAllNodes,
              node
            ) :
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
        name={conversionName.toLowerCase()} 
        node={node} 
      />
    </div>
  </div>
  );
};

export default AdvancedConversion;
