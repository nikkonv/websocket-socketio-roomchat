const socket = io("http://localhost:3000");

const message_form = document.getElementById("send-container");
const message_input = document.getElementById("message-input");
const message_container = document.getElementById("message-container");
const users_connected = document.getElementById("users-connected");
const name = prompt("¿Cuál es tu nombre?");

appendMessage("Te has unido al chat");
socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} se ha conectado`);
});
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} se ha desconectado`);
});

message_form.addEventListener("submit", (e) => {
  // avoid loose previous message (avoid reload page)
  e.preventDefault();

  const message = message_input.value;
  if (message) {
    // avoid send blank messages
    appendMessage(`Tú: ${message}`);
    socket.emit("send-chat-message", message);
    message_input.value = "";
  }
});

function appendMessage(message) {
  const date = new Date();
  const messageElem = document.createElement("p");
  messageElem.innerText = `[${date.getHours()}:${date.getMinutes()}] ${message}`;
  // container overflow height - css height <= scroll position + 1
  // if the scroll is at 1 px from bottom this is true
  const isScrolledToBottom =
    message_container.scrollHeight - message_container.clientHeight <=
    message_container.scrollTop + 1;
  message_container.append(messageElem);
  if (isScrolledToBottom) {
    message_container.scrollTop =
      message_container.scrollHeight - message_container.clientHeight;
  }
}
