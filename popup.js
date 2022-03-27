// When the button is clicked, inject setPageBackgroundColor into current page
connectServer.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log("click Received!");
  sendMessageInRuntime({
    from: 'popup',
    action: 'connect',
    tab_id: tab.id,
  });
});


function sendMessageInRuntime(msg) {
  try {
    console.log("Sending msg")
    chrome.runtime.sendMessage(msg);
  } catch (err) {
    console.log("Err in sendMessageInRuntime: " + err)
    throw new Error(err);
  }
}