const { SocketEventsEnum } = require("../utils/SocketEventsEnum");
const { sequelize } = require('../db');
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const { ContactMessage } = require("../utils/ContactMessage");


class ChatController {
    static io;
    static activeSockets = new Map();
    static activeUsers = new Map();
    static usersRooms = new Map();

    static init(io){
        ChatController.io = io;
    }

    static isUserOnline(username){
        return ChatController.activeUsers.has(username);
    }

    static leaveRooms(socket, username){
        if(ChatController.usersRooms.has(username)){
            socket.to(Array.from(ChatController.usersRooms.get(username))).emit(SocketEventsEnum.UserStatus, {username: username, status: false})
            ChatController.usersRooms.forEach(room => {
                socket.leave(room);
            });
            ChatController.usersRooms.delete(username);
        }
    }

    static signInListener(socket){
        socket.on(SocketEventsEnum.SignIn, async (username) => {
            if(!ChatController.activeUsers.has(username)){
                ChatController.activeUsers.set(username, socket.id);
                ChatController.activeSockets.set(socket.id, username);
            }

            const groups = (await sequelize.query(`
                SELECT ug.group_id 
                FROM "UserGroups" ug
                JOIN "Users" u ON u.id = ug.user_id
                WHERE u.username = '${username}';
            `))[0].map(group => {
                socket.join(group.group_id);
                if(!ChatController.usersRooms.has(username))
                    ChatController.usersRooms.set(username, new Set());
                ChatController.usersRooms.get(username).add(group.group_id);
            })

            if(ChatController.usersRooms.has(username))
                socket.to(Array.from(ChatController.usersRooms.get(username))).emit(SocketEventsEnum.UserStatus, {username: username, status: true})
        });
    }

    static newMessageListener(socket) {
        socket.on(SocketEventsEnum.NewMessage, async (newMessage) => {
            
            try{
                const username = ChatController.activeSockets.get(socket.id); 
                const userId = (await User.findOne({where: {username: username}})).id;

                const message = new Message({
                    thread_id: newMessage.threadId,
                    group_id: newMessage.groupId,
                    sender_id: userId,
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    type: newMessage.type
                });
                await message.save();
                
                const messageToSend = new ContactMessage(message.message_id, message.thread_id, message.group_id, message.sender_id, username, message.content, message.timestamp, message.type);
                ChatController.io.to(Array.from(ChatController.usersRooms.get(username))).emit(SocketEventsEnum.NewMessage, messageToSend);

            } catch (err){
                const error = new CustomError('DatabaseError', 'There was a problem saving the message. You should panic!');
                console.log(error);
            }
            
        })
    }

    static userTypingListener(socket) {
        socket.on(SocketEventsEnum.UserTyping, (userTyping) => {
            socket.to(Array.from(ChatController.usersRooms.get(userTyping.username))).emit(SocketEventsEnum.UserTyping, userTyping);
        })
    } 


    static disconnectListener(socket, eventName){
        socket.on(eventName, () => {
            const username = ChatController.activeSockets.get(socket.id);
            ChatController.activeUsers.delete(username);
            ChatController.activeSockets.delete(socket.id);
            ChatController.leaveRooms(socket, username);
        });
    }

    static run() {
        ChatController.io.on("connection", (socket) => {
          ChatController.signInListener(socket);
          ChatController.newMessageListener(socket);
          ChatController.userTypingListener(socket);
          ChatController.disconnectListener(socket, SocketEventsEnum.SignOut);
          ChatController.disconnectListener(socket, 'disconnect');              
        })
    }
}

module.exports = { ChatController }