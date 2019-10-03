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