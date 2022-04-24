window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket("ws://63.145.59.226:8765/");
  console.log("websocket connected")
  document.querySelector(".pause").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "pause", action: "pause" }));
  });

  document.querySelector(".play").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "play", action: "play" }));
  });

  document.querySelector(".jump").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "jump", action: "jump", timestamp: document.querySelector('.ts').value }));
  });
  document.querySelector(".rewind").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "rewind", action: "rewind", time: 30 }));
  });

  websocket.onmessage = ({ data }) => {
    const event = JSON.parse(data);
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