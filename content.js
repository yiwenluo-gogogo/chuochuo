 // const socket = io("http://63.145.59.226:8080");

 const socket = io('http://63.145.59.226:8080', {
     transports: ['polling', 'flashsocket']
});

 //socket
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});      

 chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");
      console.log(firstHref);
      console.log("Start the extension.");



    }
  }
);