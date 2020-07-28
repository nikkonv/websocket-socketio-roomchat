const io = require("socket.io")(3000);
const live = require("live-server");

const params = {
  port: 5555,
  file: "index.html",
};

live.start(params);

// npm run dev

users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    const address = socket.request.connection._peername;
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
    console.log(
      "Server says: the IP " +
        address.address +
        " with the PORT " +
        address.port +
        " was assigned to '" +
        name +
        "'"
    );
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
  socket.emit(users);
});
