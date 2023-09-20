// INSTANCIA AL SOCKET Y GUARDADO EN LA CONSTANTE
const socket = io();
let user = '';
const chatbox = document.getElementById('chatbox');

Swal.fire({
  title: 'Ingrese su nick',
  input: 'text',
  icon: 'success',
  text: '',
  inputValidator: (value) => !value.trim() && 'Por favor, ingrese un nick',
  allowOutsideClick: false
}).then((result) => {
  user = result.value;
  document.getElementById('username').innerHTML = user;
  socket.emit('controller', user);
});

chatbox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatbox.value.trim().length > 0) {
      const data = { user, message: chatbox.value };
      socket.emit('crearMessage', data);
      chatbox.value = '';
    }
  }
});

socket.on('cargarMensaje', (messages) => {
  render(messages);
});
const render = (messeges) => {
  const divLog = document.getElementById('messageLogs');
  let listMessage = '';
  messeges.reverse().forEach((message) => {
    listMessage += `<p><i>${message.user}</i>: ${message.message}</p>`;
  });
  divLog.innerHTML = listMessage;
};
