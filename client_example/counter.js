// var SERVER_ADDRESS = "ws://3.129.19.116:8765/sync"
var SERVER_ADDRESS = "ws://63.145.59.226:8765/"

window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket(SERVER_ADDRESS);
  console.log(websocket);

  document.querySelector(".pause").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "pause", type: "pause" }));
  });

  document.querySelector(".play").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "play", type: "play" }));
  });

  document.querySelector(".jump").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "jump", type: "jump", timestamp: document.querySelector('.ts').value }));
  });
  document.querySelector(".rewind").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "rewind", type: "rewind", time: 30 }));
  });

  websocket.onmessage = ({ data }) => {
    console.log("data");
    console.log(data);
    const event = JSON.parse(data);
    console.log(event);
    console.log(event.type);
    switch (event.type) {
      case "jump":
        document.querySelector(".value").textContent = event.value;
        break;
      case "rewind":
        document.querySelector(".value").textContent = event.value;
        break;
      case "play":
        document.querySelector(".log").textContent = "Someone played video"
        break;
      case "pause":
        document.querySelector(".log").textContent = "Someone paused video"
        break;
      case "users":
        const users = `${event.count} user${event.count == 1 ? "" : "s"}`;
        document.querySelector(".users").textContent = users;
        break;
      default:
        console.error("unsupported event", event);
    }
  };
});