// When the button is clicked, inject setPageBackgroundColor into current page
connectServer.addEventListener("click", async () => {

  console.log("click Received!");
  chrome.runtime.sendMessage({
    from: 'popup',
    action: 'connect',
  });
});
