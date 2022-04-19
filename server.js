const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const { userJoin, getCurrentUser, userLeave, getUsersInRoom } = require('./utils/user')

const app = express()   //  create an express Application
const server = http.createServer(app)   //  Pass it to constructor of http server
const io = socketio(server)     //  pass the server instance to socketio 

app.use(express.static(path.join(__dirname, "public")))

const botName = "ChatCord Bot"

//  Run this event only when a new connection in obtained
io.on('connection', socket => {
    
    socket.on('joinChatRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        //  This 'emit' emits data to a single client which is current user
        socket.emit('message', formatMessage(botName, "Welcome to ChatCord!"))
    
        //  Broadcast when a user connect. Emits data to all other client except current client
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the room.`))
        
        io.to(user.room)
        .emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })
    
    //  Listen to chatMessage as we need to broadcast it to other user
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    
    // Calls when a user disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        
        if(user){
            //  this 'emit' calls all client, current as well as other.
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected`))
            
            io.to(user.room)
            .emit('roomUsers', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})