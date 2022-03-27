var msg = "abc";
let status = "disconnect";
let websocket = null;


function StartWatchParty() {
  chrome.alarms.create("ws health check", {delayInMinutes: 1, periodInMinutes: 1})

  console.log("Init sockets.");
  websocket = new WebSocket("ws://67.148.60.222:8765/");
  chrome.notifications.create('NOTFICATION_ID', {
      type: 'basic',
      iconUrl: 'images/zelda32.png',
      title: 'notification title',
      message: 'notification message'
  })
  websocket.onmessage = ({ data }) => {
    event = JSON.parse(data);
    console.log(event)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        from: 'background',
        data: event,
      });
    });
    console.log("socket on: " + event.type);
  };
  console.log("Init sockets complete");
}

// Receive vidoe event from user
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.from) {
    case 'content': {
      broadcast(msg.data, sender.tab);
      break;
    }
    case 'popup': {
      console.log("popup action start");
      StartWatchParty();
      console.log("popup action complete");
      break;
    }
  }
});

chrome.alarms.onAlarm.addListener(checkWebSocket);

function checkWebSocket(alarm) {
  if (alarm == "ws health check") {
    try {
      websocket.send("I am alive!");
      console.log("I am alive!");
    } catch (err) {
      websocket = new WebSocket("ws://67.148.60.222:8765/");
    }
  }
}

function broadcast(event, senderTab) {
  console.log("Received new event: " + event.type + " from: " + senderTab.url);
  try {
    websocket.send(JSON.stringify(event));
  } catch (err) {
    console.log("reconnecting!");
    websocket = new WebSocket("ws://67.148.60.222:8765/");
  }
}