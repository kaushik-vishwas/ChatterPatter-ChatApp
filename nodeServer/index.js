const io = require("socket.io")(8000, {
  cors: {
    origin: "http://127.0.0.1:5500", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);

    // Send the list of connected users to all clients, including the new one
    io.emit("connected-users", Object.values(users));
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("left", disconnectedUser);

    // Send the updated list of connected users to all clients
    io.emit("connected-users", Object.values(users));
  });
});
