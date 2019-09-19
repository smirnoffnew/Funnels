function searchCurretnNodeAndUrl(Nodes, nodeId) {
  if (Nodes) {
    if (Nodes.find(el => el.nodeId === nodeId)) {
      const countUrl = Nodes.find(el => el.nodeId === nodeId).counterUrl || 0;
      const countNode = Nodes.find(el => el.nodeId === nodeId).counterNode || 0;
      return {
        countUrl,
        countNode
      }
    }
  }
  return {
    countUrl: 0,
    countNode: 0
  }
}

function allClicksCount(links, nodes, value = 0, targetId) {
  if (links && Array.isArray(links) && targetId) {
    const newLinks = links.filter(el => el.target !== targetId);
    const newTargetId = links.find(el => el.target === targetId) && links.find(el => el.target === targetId)['source']
    const newValue = (nodes.find(el => el.nodeId === targetId) && nodes.find(el => el.nodeId === targetId).counterUrl) ? (nodes.find(el => el.nodeId === targetId).counterUrl + value) : value
    //    console.log("newLinks", newLinks);
    //    console.log("nodes", nodes);
    //    console.log("newValue", newValue);
    //    console.log("newTargetId", newTargetId)
    return allClicksCount(newLinks, nodes, newValue, newTargetId)
  } else {
    return value
  }
}

export function getConversion(Nodes, links, nodeId) {
  let Conversion = "0%"
  if (Nodes && Nodes[0] && links !== " ") {
    // console.log("Nodes", Nodes);
    // console.log("Links", links);
    // console.log("nodeId", nodeId)
    const clickCount = allClicksCount(links, Nodes, 0, nodeId)

    // const ourlinks = links.filter(element => nodeId === element.target)
    // console.log("OurLinks", ourlinks)
    // const counterUrlmass = Nodes.map(element => {
    //     if (ourlinks.find(elem => elem.source === element.nodeId)) {
    //         return element.counterUrl
    //     }
    //     return 0
    // })
    // const clickCount = ourlinks.map(el =>allClicksCount(links, Nodes, 0,el.targetId ) )
    // console.log("val", clickCount)
    // const currentCounterUrl = searchCurretnNodeAndUrl(Nodes, nodeId).countUrl
    // const clickCount = counterUrlmass.reduce((accumulator, currentValue) => accumulator + currentValue) + currentCounterUrl;
    let Conversion = clickCount ? ((searchCurretnNodeAndUrl(Nodes, nodeId).countNode / clickCount) * 100) : 0;
    return Conversion && Conversion.toFixed(2) + "%"
  }
  return Conversion
}


export function getNotificationTime(notificationTime) {
  let notificationDate = notificationTime
  let currentDate = Date.now()
  let timeDiffInMilli = currentDate - notificationDate;
  let numOfSec = Math.floor((timeDiffInMilli) / (1000))// Sec
  let numOfMin = Math.round(((timeDiffInMilli % 86400000) % 3600000) / 60000); // Minutes
  let numOfHour = Math.floor((timeDiffInMilli % 86400000) / 3600000); // Hours
  let numOfDays = Math.floor(timeDiffInMilli / 86400000); // Days

  if (numOfDays !== 0) {
    return numOfDays + " days ago"
  }
  else if (numOfHour !== 0) {
    return numOfHour + " hour ago"
  }
  else if (numOfMin !== 0) {
    return numOfMin + " min ago"
  }
  else if (numOfSec === 0) {
    return "just now"
  }
  else if (numOfSec !== 0) {
    return numOfSec + " sec ago"
  }
}

export function debounced(delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }
}


export function keyMonitor(key, fnOnDown, fnOnUp) {
  document.onkeydown = function checkKeycode(event) {
    if (event.key === key) {
      fnOnDown(event.key)
    }
    // console.log("keycode: ",  event)
  }

  document.onkeyup = function checkKeycode(event) {
    if (event.key === key) {
      fnOnUp("")
    }
  }
}

export function openLinkOnNewTab(link, event) {
  event && event()
  window.open(link, '_newtab')
}

export function followOnImageError(alt, startOrEnd) {
  const listener = (e) => {
    if (e.target.nodeName === 'IMG' && e.target.alt === alt) { e.target.src = 'https://www.searchpng.com/wp-content/uploads/2019/02/User-Icon-PNG-715x715.png'; }
  }
  if (startOrEnd === 'start') {
    document.addEventListener('error', listener, true);
  }
  if (startOrEnd === 'end') {
    document.removeEventListener('error', listener)
  }
}