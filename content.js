let nodes = [];
let recieved = false;
let recievedEvent;
let loading = false;


init();

const observer = new MutationObserver(() => {
  init();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});


function init() {
  const nodesCollection = document.getElementsByTagName('video');
  addListeners(nodesCollection);
  nodes = Array.from(nodesCollection);
}

function addListeners(nodesCollection) {
  const eventTypes = ['playing', 'pause', 'jump'];
  for (let i = 0; i < nodesCollection.length; i++) {
    for (let j = 0; j < eventTypes.length; j++) {
      nodesCollection[i].addEventListener(eventTypes[j], onEvent, true);
    }
  }
}

function onEvent(event) {
  console.log("On event " + event.type);
  if (recieved) {
    console.log("received")
    if (recievedEvent === 'play') {
      if (event.type === 'progress') {
        recieved = false;
      } else if (event.type === 'playing') recieved = false;
    } else if (recievedEvent === 'pause') {
      if (event.type === 'jump') recieved = false;
    } else if (recievedEvent === event.type) recieved = false;
  } else if (event.type === 'jump') {
    if (event.target.paused) broadcast(event);
  } else broadcast(event);
}

function broadcast(event) {
  const eventSend = {
    location: iframeFullIndex(window),
    type: event.type,
    element: nodes.indexOf(event.target),
    currentTime: event.target.currentTime,
    playbackRate: event.target.playbackRate,
  };
  if (eventSend.type === 'progress') eventSend.type = 'pause';
  else if (eventSend.type === 'playing') eventSend.type = 'play';
  sendMessageInRuntime({
    from: 'content',
    data: eventSend,
  });
  console.log("broadcast: " +  eventSend.type);
}

function sendMessageInRuntime(msg) {
  try {
    chrome.runtime.sendMessage(msg);
  } catch (err) {
    console.log("Err in sendMessageInRuntime: " + err)
    throw new Error(err);
  }
}

function iframeFullIndex(win) {
  // eslint-disable-next-line no-param-reassign
  win = win || window;
  if (iframeIndex(win) < 0) {
    return '-1';
  }
  return `${iframeFullIndex(win.parent)}${iframeIndex(win)}`;
}

function iframeIndex(win) {
  // eslint-disable-next-line no-param-reassign
  win = win || window;
  if (win.parent !== win) {
    for (let i = 0; i < win.parent.frames.length; i++) {
      if (win.parent.frames[i] === win) {
        return i;
      }
    }
    throw Error('In a frame, but could not find myself');
  } else {
    return -1;
  }
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("in content")
  if (msg.from === 'background') {
      fireEvent(msg.data);
      console.log("received:" + msg.data);
      sendResponse(false);
    
  }
});


function fireEvent(event) {
  recieved = true;
  recievedEvent = event.type;

  switch (event.type) {
    case 'play': {
      nodes[event.element].currentTime = event.currentTime;
      nodes[event.element].play().catch(errorOnEvent);
      break;
    }
    case 'pause': {
      nodes[event.element].pause();
      nodes[event.element].currentTime = event.currentTime;
      break;
    }
    case 'jump': {
      nodes[event.element].currentTime = event.currentTime;
      break;
    }
  }
}

function errorOnEvent(err) {
  if (err.name === 'NotAllowedError') {
    sendMessageInRuntime({
      from: 'errorOnEvent',
    });
  }
}