// simple class to handle sockets between users : user joins, disconnects, ... etc
class MainSocket {

    // the 2 users communicating
    party = []

    // handles the connection stats : disconnect, connect, join, leave, .... etc
    connection (client) {

       // TODO : user leaves 
        // ...

    }

    joinUser (room, userJoinId) {

        // getting the user info
        const userSocket = this.party.filter(user => {
            return user.userId === userJoinId
        })

        userSocket.map((user) => {
            const socketConnection = global.io.sockets.connected(user.socketId)

            if (socketConnection)
                socketConnection.join(room)
        })
    }

}

module.exports = new MainSocket()