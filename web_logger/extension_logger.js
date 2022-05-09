// var SERVER_ADDRESS = "ws://3.129.19.116:8765/sync"
var SERVER_ADDRESS = "ws://63.145.59.226:8765/"

window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket(SERVER_ADDRESS);
  console.log(websocket);

  document.querySelector(".pause").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "pause", action: "pause", userEmail: "yiwen@gmail.com" }));
  });

  document.querySelector(".play").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "play", action: "play", userEmail: "yiwen@gmail.com" }));
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
        document.querySelector(".log").textContent = `${event.userEmail}` + " played video"
        break;
      case "pause":
        document.querySelector(".log").textContent = `${event.userEmail}` + " paused video"
        break;
      case "users":
        const users = `${event.count} user${event.count == 1 ? "" : "s"}`;
        document.querySelector(".users").textContent = users;
        const user_list = `${event.user_list}`;
        document.querySelector(".user_email_list").textContent = user_list;
        break;
      default:
        console.error("unsupported event", event);
    }
  };
});