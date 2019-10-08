import React from 'react';
import './AdvancedConversion.css'
import { PortWidget } from "storm-react-diagrams";
import { isEmpty } from '../../utils';

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

const getAdvancedConversion = (
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
                if(counterUTMFrom === 0 || counterUTMFrom === 0){
                  return 'none'
                }
                const advancedConversion = (counterPageTo / counterUTMFrom) * 100

                return advancedConversion.toFixed(2) + "%"
              }
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
        <div 
          style={{
            cursor: 'pointer',
            marginRight: 5
          }} 
          title='delete'
          onClick={() => {
          node.extras.conversionsContainer.splice(index, 1)
          document.getElementById("diagram-layer").click();
        }}>X</div>
        {conversionName}
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
        right: -16,
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
