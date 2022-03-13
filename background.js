var msg = "abc";
let status = "disconnect";
let websocket = null;


chrome.action.onClicked.addListener(function(tab) {
  console.log("Start sync watch session.");
  initSockets(tab);
  // chrome.tabs.sendMessage(
  //   tab.id, {
  //     from: "background",
  //     data: msg}, function(responseFromContent) {
  //   receiveFromWebpage(tab.id, responseFromContent);
  // });
});


function initSockets(tab) {
  console.log("Init sockets.");
  websocket = new WebSocket("ws://67.148.60.222:8765/");
  // websocket.send(JSON.stringify({ action: "abc" }));

  websocket.onmessage = ({ event }) => {
    chrome.tabs.sendMessage(tab.id, {
      from: 'background',
      data: event,
    });
    console.log("socket on: " + event.type);
  };

}


// Set the right icon in the given tab id, depending on that tab's active state.
function receiveFromWebpage(tabId, responseFromContent) {
  console.log("tabId is");
  console.log(tabId);
  console.log(responseFromContent);
}

// Receive vidoe event from user
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.from) {
    case 'content': {
      broadcast(msg.data, sender.tab);
      break;
    }
  }
});

function broadcast(event, senderTab) {
  console.log("Received new event: " + event.type + "from: " + senderTab.url);
  websocket.send(JSON.stringify(event));
}