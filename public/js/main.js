const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")
const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


socket.emit('joinChatRoom', {username, room})

//  On Message handler from server
socket.on('message', data => {
    outputMessage(data)

    //  Scroll to bottom
    chatMessage.scrollTop = chatMessage.scrollHeight
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//  On Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //  Get msg content
    const msg = e.target.elements.msg.value;

    //  send msg to server
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//  Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsersInRoom(users)
})

//  Set Room Name
function outputRoomName(room) {
    roomName.innerText = room
}

//  Set Users in room
function outputUsersInRoom(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}