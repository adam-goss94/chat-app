const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
let userName = '';

loginForm.addEventListener('submit', (event) => {
  login(event);
});

addMessageForm.addEventListener('submit', (event) => {
  sendMessage(event);
});

const login = () => {
  event.preventDefault();

  if (userNameInput.value === '') {
    alert('Name field cannot be empty!')
  }
  else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const sendMessage = e => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }

}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author == userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);

}