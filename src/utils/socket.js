// simple class to handle sockets between users : user joins, disconnects, ... etc
/*
How to test : 

    - Create a frontend
    - When a user sends a msg to someone who commented on his request
        - The socket should be listening on the frontend on the request comment's section
        - When a user is selected to initate a chat 
    - When the user connects to the chat : /get-room-msgs (with params) when connected to pull the latest msgs
    
    Notes : 
        - Only certain users can create sockets, check the docs
*/

const Message = require('../models/Message')
const Comment = require('../models/Comment')
const Room = require('../models/Room')
const User = require('../models/User')

const addChatRoomToUsers = async (mainUser, otherUser) => {
    // flagging this user to be already add to a chat room
    mainUser.chats.push(chatRoomStatus.roomId)
    
    await mainUser.save()

    // the other part too
    otherUser.chats.push(chatRoomStatus.roomId)
    await otherUser.save()
}

class MainSocket {

    // handles the connection stats : disconnect, connect, join, leave, .... etc
    connection (client) {

        // TODO : listen on new msgs

        //console.log(`${client.user.name} connected`)
        // user joins from the frontend
        // disconnection
        client.on("disconnect", () => {
            // leave the user from the room/chat
            console.log(`${client.user.name} disconnected`)
        })

        // run one 
        client.once("new-chat", async ({ reqId, commentId, msg }) => {
            // check if the user is allowed to send a msg
            // getting the userId/reqId from the frontend

            // if the chat already initiated 

            // getting more info about the chats in the user chat list 
            // TODO :  change the chat in the user to look like this 
            const chatList = await User.getChats(client.user._id)
            const comment = await Comment.findById(commentId)

            // TODO : fix a potential bug : comment is deleted but chat is still going
            if (! comment)
                return

            const otherUser = await User.findById(comment.userId)

            // empty chatList ?
            if (chatList.length == 0) {
                // check if the user is commented
                const chatRoomStatus = await Room.startChatRoom(client.user._id, reqId, comment.userId)
                
                await addChatRoomToUsers(client.user, otherUser)
                // say hi
                client.to(chatRoomStatus.roomId).emit('msg', msg)

            }else {
                // search the chatlist for the user
                const userToSend = chatList.find(user => {
                    // cast to objectID
                    return user.user.equals(comment.userId)
                })

                console.log(userToSend)

                if (!userToSend){
                    const chatRoomStatus = await Room.startChatRoom(client.user._id, reqId, comment.userId)
                    await addChatRoomToUsers(client.user, otherUser)

                    client.to(chatRoomStatus.roomId).emit('msg', msg)
                }else {
                    // user exists, send a message directly
                    // get the chatRoom that user exists in it
                    client.to(userToSend._id).emit('msg', msg)
                }
            }
        })

        // joing the chat 
        client.on("sub", (roomId) => {
            client.join(roomId)
        })

        // leave
        client.on("leave", (roomId) => {
            client.leave(roomId)
        })

        // listening for messages
        client.on("new-msg", async ({roomId, msg }) => {
            client.to(roomId).emit('msg', msg)
        })
    }
}

module.exports = new MainSocket()