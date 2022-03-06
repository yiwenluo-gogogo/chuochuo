// background.
const socket = io("63.145.59.226:12345");      


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("In background.");
    //socket
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});