var msg = "abc";
let status = "disconnect";
let websocket = null;


function initSockets(tab_id) {
  console.log("Init sockets.");
  websocket = new WebSocket("ws://67.148.60.222:8765/");

  websocket.onmessage = ({ data }) => {
    event = JSON.parse(data);
    console.log(event)
    chrome.tabs.sendMessage(tab_id, {
      from: 'background',
      data: event,
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
      initSockets(msg.tab_id);
      console.log("popup action complete");
      break;
    }
  }
});

function broadcast(event, senderTab) {
  console.log("Received new event: " + event.type + " from: " + senderTab.url);
  websocket.send(JSON.stringify(event));
}