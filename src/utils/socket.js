// simple class to handle sockets between users : user joins, disconnects, ... etc
/*
How to test : 

    - Create a frontend
    - When the user connects to the chat : /get-room-msgs (with params) when connected to pull the latest msgs
    - When a user send a msg to the other party this api is called : /create-msg/roomId
        - The msg is created and stored in the db, then the socket emits
    
    Notes : 
        - The sockets are wrapped inside a secure api that requires the user to be loggedin
        - Only certain users can create sockets, check the docs

*/
class MainSocket {

    // the 2 users communicating
    party = []

    // handles the connection stats : disconnect, connect, join, leave, .... etc
    connection (client) {

        // TODO : listen on new msgs

        // user joins from the frontend
        client.on("joins", (userId) => {

            // add the user + socketId
            this.addUserToParty(userId, client.id)
        })

        // disconnection
        client.on("disconnect", () => {
            this.removeUserFromParty()
        })

    }

    removeUserFromParty (){
        this.party = this.party.filter((user) => user.socketId !== client.id)
    }

    addUserToParty (userId, socketId) {
        this.party.push({
            userId,
            socketId
        })
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