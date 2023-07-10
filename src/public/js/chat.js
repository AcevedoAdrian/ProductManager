// INSTANCIA AL SOCKET Y GUARDADO EN LA CONSTANTE
const socket = io();
let user = "";
let chatbox = document.getElementById("chatbox");


Swal.fire({
  title: "Ingrese su nick",
  input: "text",
  icon: "success",
  text: "",
  inputValidator: (value) => !value.trim() && "Por favor, ingrese un nick",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  document.getElementById("username").innerHTML = user;
});

chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatbox.value,
      });
      chatbox.value = "";
    }
  }
});

socket.on("logs", (data) => {
  const divLog = document.getElementById("messageLogs");
  let messages = "";
  data.reverse().forEach((element) => {
    messages += `<p><i>${element.user}</i>: ${element.message}</p>`;
  });
  divLog.innerHTML = messages;
});
