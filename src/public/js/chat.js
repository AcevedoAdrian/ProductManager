// INSTANCIA AL SOCKET Y GUARDADO EN LA CONSTANTE
const socket = io();
socket.emit("message", "Hola");

Swal.fire({
  title: "Ingrese su nick",
  input: "text",
  icon: "success",
  text: "",
  inputValidator: (value) => !value.trim() && "Por favor, ingrese un nick",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log("user: ", user);
  socket = io();
  document.getElementById("username").innerHTML = user;
});
