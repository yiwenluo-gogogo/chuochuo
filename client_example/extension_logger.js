window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket("ws://63.145.59.226:8765/");
  console.log("websocket connected")
  document.querySelector(".pause").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "pause", action: "pause", user_email: "abc@gmail.com" }));
  });

  document.querySelector(".play").addEventListener("click", () => {
    websocket.send(JSON.stringify({ type: "play", action: "play", user_email: "abc@gmail.com" }));
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
        document.querySelector(".log").textContent = `${event.user_email}` + " played video"
        break;
      case "pause":
        document.querySelector(".log").textContent = `${event.user_email}` + " paused video"
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