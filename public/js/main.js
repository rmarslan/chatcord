const socket = io();

const chatMessages = document.querySelector(".chat-messages");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("usersRoomInfo", (info) => {
  console.log(info);
  updateRoomName(info.room);
  renderUsersList(info.users);
});

function updateRoomName(room) {
  const roomEl = document.getElementById("room-name");
  roomEl.innerHTML = room;
}

function renderUsersList(users) {
  const usersEl = document.getElementById("users");
  usersEl.innerHTML = `
    ${users.map((user) => `<li>${user.username}</>`).join("")}
  `;
}

socket.emit("joinRoom", { username, room });

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  socket.emit("chatMessage", msg);
});
