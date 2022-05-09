var msg = "abc";
let status = "disconnect";
let websocket = null;
var SERVER_ADDRESS = "ws://3.129.19.116:8765/sync"
var user_email = "";
// var SERVER_ADDRESS = "ws://localhost:8765/sync"

chrome.identity.getProfileUserInfo(function(userInfo) {
  user_email = userInfo.email;
});

function StartWatchParty() {
  chrome.alarms.create("ws health check", {delayInMinutes: 1, periodInMinutes: 1})

  console.log("Init sockets.");
  websocket = new WebSocket(SERVER_ADDRESS);
  chrome.notifications.create('NOTFICATION_ID', {
      type: 'basic',
      iconUrl: 'images/zelda32.png',
      title: 'notification title',
      message: 'notification message'
  })
  websocket.onmessage = ({ data }) => {
    event = JSON.parse(data);
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
      console.log("reconnecting!");
      websocket = new WebSocket(SERVER_ADDRESS);
      console.log("web socket connected")
    }
  }
}

function broadcast(event, senderTab) {
  event["userEmail"] = user_email;
  console.log("Received new event: " + event.type + " from: " + senderTab.url);
  console.log(event);
  try {
    websocket.send(JSON.stringify(event));
  } catch (err) {
    console.log("reconnecting!");
    websocket = new WebSocket(SERVER_ADDRESS);
  }
}