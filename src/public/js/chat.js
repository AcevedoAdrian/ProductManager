// INSTANCIA AL SOCKET Y GUARDADO EN LA CONSTANTE
const socket = io();
let user = '';
const chatbox = document.getElementById('chatbox');

socket.on('logs', (data) => {
  console.log([data]);
  const divLog = document.getElementById('messageLogs');
  let messages = '';
  data.reverse().forEach((element) => {
    messages += `<p><i>${element.user}</i>: ${element.message}</p>`;
  });
  divLog.innerHTML = messages;
});

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
});

chatbox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatbox.value.trim().length > 0) {
      const data = { user, message: chatbox.value };

      fetch('/chat', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json'
        }
      });

      socket.emit('message', {
        user,
        message: chatbox.value
      });
      chatbox.value = '';
    }
  }
});
