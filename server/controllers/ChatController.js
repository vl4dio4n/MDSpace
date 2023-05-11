const { SocketEventsEnum } = require("../utils/SocketEventsEnum");
const { sequelize } = require('../db');
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const { LastActivity } = require("../models/LastActivity");
const { ContactMessage } = require("../utils/ContactMessage");
const { CustomError } = require('../utils/Error');


class ChatController {
    static io;
    static activeSockets = new Map();
    static activeUsers = new Map();
    static usersRooms = new Map();
    static usersThreads = new Map();

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

    static async updateLastActivity(username, newThreadId){
        const oldThreadId = ChatController.usersThreads.get(username);
        if(oldThreadId) {
            try {
                
                const userId = (await User.findOne({where: {username: username}})).id;
                const updateRes = await LastActivity.update(
                    { timestamp: new Date() },
                    { where: { user_id: userId, thread_id: oldThreadId } }
                );

                if(!updateRes[0]) {
                    const lastActivity = new LastActivity({ user_id: userId, thread_id: oldThreadId, timestamp: new Date() });
                    await lastActivity.save();
                }
    
            } catch (err) {
                const error = new CustomError('DatabaseError', 'There was a problem updating the last activity. You should panic!');
                console.log(error);
            }
        }

        if(newThreadId && newThreadId != 'null'){
            ChatController.usersThreads.set(username, newThreadId);
        }
    }

    static signInListener(socket){
        socket.on(SocketEventsEnum.SignIn, async (username) => {
            if(!ChatController.activeUsers.has(username)){
                ChatController.activeUsers.set(username, socket.id);
                ChatController.activeSockets.set(socket.id, username);
                ChatController.usersThreads.set(username, null);
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
        socket.on(eventName, async () => {
            const username = ChatController.activeSockets.get(socket.id);
            await ChatController.updateLastActivity(username);
            ChatController.activeUsers.delete(username);
            ChatController.activeSockets.delete(socket.id);
            ChatController.usersThreads.delete(username);
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