const path = require("path");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const { joinRoom, findUser, removeUser, getUsers } = require("./users");
const formatMessage = require("./formatMessage");

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.NODE_ENV || 3000;
server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}...`);
});

const botName = "chatCord Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinRoom(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Welocme to chatCord"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} join the chat`)
      );
    io.to(user.room).emit("usersRoomInfo", {
      users: getUsers(user.room),
      room: user.room,
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user)
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} leave the chat`)
        );
    io.to(user.room).emit("usersRoomInfo", {
      users: getUsers(user.room),
      room: user.room,
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = findUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});
