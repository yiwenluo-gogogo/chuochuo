var msg = "abc"

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("Start sync watch session.")
  chrome.tabs.sendMessage(
    tab.id, {
      from: "background",
      data: msg}, function(responseFromContent) {
    receiveFromWebpage(tab.id, responseFromContent);
  });
});


// Set the right icon in the given tab id, depending on that tab's active state.
function receiveFromWebpage(tabId, responseFromContent) {
  console.log("tabId is")
  console.log(tabId)
  console.log(responseFromContent)
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.from) {
    case 'content': {
      broadcast(msg.data, sender.tab);
      break;
    }
  }
});

function broadcast(event, senderTab) {
  console.log("Received new event: " + event + "from: " + senderTab);
}