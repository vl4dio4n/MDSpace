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
    static usersCalls = new Map();

    static init(io){
        ChatController.io = io;
    }

    static isUserOnline(username){
        return ChatController.activeUsers.has(username);
    }

    static leaveCall(socket, username){
        if(ChatController.usersCalls.has(username)){
            socket.leave(ChatController.usersRooms.get(username));
            ChatController.usersCalls.delete(username);
        }
    }

    static leaveRooms(socket, username){
        if(ChatController.usersRooms.has(username)){
            socket.to(Array.from(ChatController.usersRooms.get(username))).emit(SocketEventsEnum.UserStatus, {username: username, status: false})
            ChatController.usersRooms.get(username).forEach(room => {
                socket.leave(room);
            });
            ChatController.usersRooms.delete(username);
        }
        ChatController.leaveCall(socket, username);
    }

    static leaveRoom(username, room){
        const socketId = ChatController.activeUsers.get(username);
        const socket = ChatController.io.sockets.sockets.get(socketId);
        socket.leave(room);
        ChatController.usersRooms.get(username).delete(room);
    }

    static leaveRoomEmitter(username){
        const socketId = ChatController.activeUsers.get(username);
        const socket = ChatController.io.sockets.sockets.get(socketId);
        socket.emit(SocketEventsEnum.LeaveGroup);
    }

    static joinRoom(socket, username, groupId){
        socket.join(groupId);
        if(!ChatController.usersRooms.has(username))
            ChatController.usersRooms.set(username, new Set());
        ChatController.usersRooms.get(username).add(groupId);
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

        if(newThreadId != 'null'){
            ChatController.usersThreads.set(username, newThreadId);
        }
    }

    static async updateLastActivityEnd(req, res, next) {
        const username = req.body.username;
        await ChatController.updateLastActivity(username);
        return res.json({ error: undefined, content: true });
    }

    static signInListener(socket){
        socket.on(SocketEventsEnum.SignIn, async (username) => {
            if(!ChatController.activeUsers.has(username)){
                ChatController.activeUsers.set(username, socket.id);
                ChatController.activeSockets.set(socket.id, username);
                ChatController.usersThreads.set(username, undefined);
            }

            const groups = (await sequelize.query(`
                SELECT ug.group_id 
                FROM "UserGroups" ug
                JOIN "Users" u ON u.id = ug.user_id
                WHERE u.username = '${username}';
            `))[0].map(group => ChatController.joinRoom(socket, username, group.group_id));

            if(ChatController.usersRooms.has(username))
                socket.to(Array.from(ChatController.usersRooms.get(username))).emit(SocketEventsEnum.UserStatus, {username: username, status: true})
        
            console.log(ChatController.activeUsers);    
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

    static callMessageListener(socket) {
        socket.on(SocketEventsEnum.NewCallMessage, async (newMessage) => {
            console.log(newMessage);
            ChatController.io.to(newMessage.roomId).emit(SocketEventsEnum.NewCallMessage, newMessage);
        })
    }

    static userTypingListener(socket) {
        socket.on(SocketEventsEnum.UserTyping, (userTyping) => {
            socket.to(Array.from(ChatController.usersRooms.get(userTyping.username))).emit(SocketEventsEnum.UserTyping, userTyping);
        })
    } 

    static addThread(groupId){
        ChatController.io.to(groupId).emit(SocketEventsEnum.ThreadCreated);
    }

    static addGroupMembers(groupId, members){

        members.forEach((member) => {
            const socketId = ChatController.activeUsers.get(member);
            if(socketId){
                const socket = ChatController.io.sockets.sockets.get(socketId);
                ChatController.joinRoom(socket, member, groupId);
                socket.emit(SocketEventsEnum.UserAddedToGroup);
            }
        })
    }

    static addGroupMembersListener(socket) {
        socket.on(SocketEventsEnum.AddGroupMembers, (groupId, members) => {
            ChatController.addGroupMembers(groupId, members);
        })
    }


    static joinCallListener(socket) {
        socket.on(SocketEventsEnum.JoinCall, (username, roomId) => {
            ChatController.usersCalls.set(username, roomId);
            socket.join(roomId);
        })
    }

    static leaveCallListener(socket) {
        socket.on(SocketEventsEnum.LeaveCall, (username) => {
            ChatController.leaveCall(socket, username);
        });
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
          ChatController.addGroupMembersListener(socket);
          ChatController.joinCallListener(socket);
          ChatController.leaveCallListener(socket);
          ChatController.callMessageListener(socket);
          ChatController.disconnectListener(socket, 'disconnect');              
        })
    }
}

module.exports = { ChatController }