const socket = io("http://localhost:8000");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("nameInput");
const welcomeContainer = document.querySelector(".welcome-container");
const chatContainer = document.querySelector(".container");
const sendContainer = document.querySelector(".send");
const userDropdown = document.getElementById("userDropdown"); // Dropdown element

// Function to update the list of joined users in the dropdown menu
const updateJoinedUsers = (userList) => {
  userDropdown.innerHTML = ""; // Clear the dropdown list

  userList.forEach((user) => {
    const listItem = document.createElement("a");
    listItem.classList.add("dropdown-item");
    listItem.textContent = user;
    userDropdown.appendChild(listItem);
  });
};

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  if (name.trim() !== "") {
    // Hide the welcome container and show the chat container.
    welcomeContainer.style.display = "none";
    chatContainer.style.display = "block";
    sendContainer.style.display = "block";

    // Emit the 'new-user-joined' event with the entered name.
    socket.emit("new-user-joined", name);
    const usernameLabel = document.getElementById("usernameLabel");
    usernameLabel.textContent = name;
  }
});

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio1 = new Audio("sendTone.mp3");
var audio2 = new Audio("getTone.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "right") {
    audio1.play();
  }
  if (position == "left") {
    audio2.play();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

socket.on("user-joined", (name) => {
  append(`${name} Joined The Chat`, "centerDiv");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} Left The Chat`, "centerDiv");
});

// Listen for the list of connected users and update the dropdown menu
socket.on("connected-users", (userList) => {
  updateJoinedUsers(userList);
});
