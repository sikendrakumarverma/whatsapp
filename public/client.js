// connection with backend socket server
// const socket = io('http://localhost:8080');
const socket = io('https://whatsapp2-one.vercel.app');
var name;

var chats = document.querySelector('.chats');
var usersList = document.querySelector('.users-list');
var usersCount = document.querySelector('.users-count');
var userMsg = document.querySelector('#user-msg');
var userSend = document.querySelector('#user-send');

// Audio that will play on sendinging message
var audio = new Audio('ting.mp3');

// Ask new user name for joining
do {
    name = prompt('Please enter your name: ');
} while (!name);

// send an event to backend with user name
socket.emit('new-user-joined', name);

// it will called when new user joined
socket.on('user-connected', (joinedUser) => {
    userJoinLeft(joinedUser, 'joined');
});

// function for uer join or left chat
function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat</p>`
    div.innerHTML = content;
    chats.appendChild(div);
}
// it will called when user left
socket.on('user-disconnected', (userLeft) => {
    userJoinLeft(userLeft, 'left');
});

// for updating users list and users count
socket.on('user-list', (allUsers) => {
    usersList.innerHTML = '';
    usersArr = Object.values(allUsers);
    for (let i = 0; i < usersArr.length; i++) {
        let p = document.createElement('p');
        p.innerHTML = usersArr[i];
        usersList.appendChild(p);
    }
    usersCount.innerHTML = usersArr.length;
});

// for sending messages by click
userSend.addEventListener('click', (e) => {
    let data = {
        user: name,
        msg: userMsg.value.trim()
    };
    if (userMsg.value != '') {
        appendMessage(data, 'outgoing');
        // sending an event for backend
        socket.emit('message', data);
        audio.play();
        userMsg.value = "";
        scrollToBottom();
    }
});

// for sending messages by pressing Enter key
userMsg.addEventListener('keyup', (e) => {
    let data = {
        user: name,
        msg: userMsg.value.trim()
    };
    if (userMsg.value != '') {
        if (e.key === 'Enter') {
            appendMessage(data, 'outgoing');
            // sending an event for backend
            socket.emit('message', data);
            audio.play();
            userMsg.value = "";
            scrollToBottom();
        }
    }
});

// Adding sending or recieving data in div
function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let contents = `
  <h5>${data.user}</h5>
  <p>${data.msg}</p>
  `;
    div.innerHTML = contents;
    chats.appendChild(div);
}

// recieving message from backend
socket.on('message', (data) => {
    appendMessage(data, 'incoming');
    scrollToBottom();
});

// for scrolling
function scrollToBottom() {
    chats.scrollTop = chats.scrollHeight
}