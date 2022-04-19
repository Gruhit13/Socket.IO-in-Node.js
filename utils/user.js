const users = []

//  Add a user to the room
function userJoin(id, username, room) {
    const user = {id, username, room}

    users.push(user)

    return user
}

//  Get the user based on id
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

//  User leave
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1 ){
        return users.splice(index, 1)[0]
    }
}

//  Get users in one room
function getUsersInRoom(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getUsersInRoom
}