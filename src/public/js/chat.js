// INSTANCIA AL SOCKET Y GUARDADO EN LA CONSTANTE
const socket = io();

const chatbox = document.getElementById('chatbox');
chatbox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatbox.value.trim().length > 0) {
      const data = { user: document.getElementById('username').innerText, message: chatbox.value };
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
