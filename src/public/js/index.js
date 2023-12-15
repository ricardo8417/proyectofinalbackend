const socket = io();
const chatbox = document.getElementById("chatbox");
let user = sessionStorage.getItem("user") || "";

if (!user) {
  Swal.fire({
    title: "Bienvenido",
    input: "email",
    text: "Agregue su mail",
    inputValidator: (value) => {
      return !value.trim() && "plase. Write a username";
    },
    allowOutsideClick: false,
  }).then(async (result) => {
    user = result.value;
    sessionStorage.setItem("user", user);
    console.log(user);
    socket.emit("new-user", { user });
  });
} else {
  console.log(user);
}

chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const message = chatbox.value.trim();
    if (message.length > 0) {
      socket.emit("message", {
        user,
        message,
      });
      chatbox.value = "";
    }
  }
});

socket.on("logs", (data) => {
  console.log(data);
  const divlogs = document.getElementById("logs");
  let messages = "";
  data.forEach((message) => {
    console.log(message);
    messages =
      `<p class="text-light"> <i> ${message.user}</i>: ${message.message}</p>` +
      messages;
  });
  divlogs.innerHTML = messages;
});
