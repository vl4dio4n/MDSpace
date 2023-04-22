const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models/User');
const { Thread } = require('../models/Thread');
const { Message } = require('../models/Message');
const { CustomError } = require('../utils/Error');
const { SearchUser } = require('../utils/SearchUser');
const { sequelize } = require('../db');
const { ContactGroup } = require('../utils/ContactGroup');
const { ContactThread } = require('../utils/ContactThread');
const { ContactMessage } = require('../utils/ContactMessage');
const { UserProfile } = require('../utils/UserProfile');
const { globals } = require('../global-variables');


class SearchUserService {
    static serverPassword = globals.serverPassword;

    static async searchUser(req, res, next){
        const searchString = req.query.data;
        try{
            const users = await User.findAll({
                attributes: ['username'],
                where: {
                    username: {
                        [Op.like]: `%${searchString}%`
                    }
                }
            });
            const response = users.map(user => new SearchUser(user.username, false));
            return res.json({error: undefined, content: response});
        } catch (err) {
            const error = new CustomError('DatabaseError', 'There was a problem searching the users. You should panic!');
            return res.json({error, content: undefined});
        }
    }

    static async getContacts(req, res, next){
        const sessionUser = req.session.user;
        try {
            const sessionUserId = (await User.findOne({
                attributes: ['id'],
                where: {
                    username: sessionUser.username
                }
            })).id;
            
            const groups = (await sequelize.query(`
                SELECT "Groups".id, "Groups".group_name 
                FROM "Groups"
                JOIN "UserGroups" ON "Groups".id = "UserGroups".group_id
                WHERE "UserGroups".user_id = ${sessionUserId};
            `))[0]
            .map(group => new ContactGroup(group.id, group.group_name))
            
            for(let i = 0; i < groups.length; i ++)
                if(!groups[i].groupName){
                    groups[i].groupName = (await sequelize.query(`
                        SELECT "Users".username 
                        FROM "Users"
                        JOIN "UserGroups" ON "UserGroups".user_id = "Users".id
                        WHERE "UserGroups".group_id = ${groups[i].groupId} and "UserGroups".user_id != ${sessionUserId};
                    `))[0][0].username;
                }

            for(let i = 0; i < groups.length; i ++){
                groups[i].threads = (await Thread.findAll({
                    attributes: ['thread_id', 'thread_name'],
                    where: {
                        group_id: groups[i].groupId
                    }
                })).map(thread => new ContactThread(thread.thread_id, thread.thread_name));
            }

            for(let group of groups){
                let unseenMessages = 0;
                for(let thread of group.threads){
                    let message = (await sequelize.query(`
                        SELECT "Messages".message_id, "Messages".sender_id, "Users".username, "Messages".content, "Messages".timestamp, "Messages".type
                        FROM "Messages"
                        JOIN "Users" ON "Users".id = "Messages".sender_id
                        WHERE "Messages".timestamp IN (SELECT max("timestamp") FROM "Messages" AS "Message" WHERE "Message"."thread_id" = ${thread.threadId});
                    `))[0];
                    if(message.length){
                        thread.lastMessage = new ContactMessage(message[0].message_id, message[0].sender_id, message[0].username, message[0].content, message[0].timestamp, message[0].type);
                    }

                    thread.unseenMessages = parseInt((await sequelize.query(`
                        SELECT COUNT(*) 
                        FROM "Messages"
                        JOIN "LastActivities" ON "LastActivities".thread_id = "Messages".thread_id
                        WHERE "LastActivities".timestamp < now() AND "Messages".thread_id = ${thread.threadId}; 
                    `))[0][0].count);

                    unseenMessages += thread.unseenMessages;
                }
                group.unseenMessages = unseenMessages;
            }

            return res.json({error: undefined, content: groups});
        } catch(err) {
            const error = new CustomError('DatabaseError', 'There was a problem getting the contacts. You should panic!');
            return res.json({error, content: undefined});
        }
    }

    static async getUserProfileFromDB(username){
        const user = (await sequelize.query(`
            SELECT u.username, u.email, u.description, 
                (SELECT MAX(timestamp) FROM "LastActivities" la WHERE la.user_id = u.id) AS "last_activity"
            FROM "Users" u
            WHERE u.username = '${username}';
        `))[0][0];
        return new UserProfile(user.username, user.email, user.description, user.last_activity, false);
    }

    static async getUserProfile(req, res, next){
        const username = req.query.data;
        
        try{
            const userProfile = await SearchUserService.getUserProfileFromDB(username);
            return res.json({ error: undefined, content: userProfile})
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem getting user's profile. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async editUserProfile(req, res, next){
        try {
            let username = req.body.username.trim();
            let email = req.body.email.trim();
            let password = req.body.password.trim();
            let newPassword = req.body.newPassword.trim();
            let description = req.body.description.trim();
            
            if(newPassword.length == 0){
                newPassword = password;
            }

            let encryptedPassword = crypto.scryptSync(password, SearchUserService.serverPassword, 64).toString("hex");
            let user = await User.findOne({ where: {
                password: encryptedPassword,
                username: username
            }});
            if(!user){
                const error = new CustomError('InvalidPassword', "Incorrect password. Try again.");
                return res.json({error, content: undefined});
            }

            let encryptedNewPassword = crypto.scryptSync(newPassword, SearchUserService.serverPassword, 64).toString("hex");
            await User.update({
                email: email,
                password: encryptedNewPassword,
                description: description
            }, {
                where: {username: username},
            });

            const updatedUser = await SearchUserService.getUserProfileFromDB(username);

            return res.json({ error: undefined, content: updatedUser});
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem updating user's profile. You should panic!");
            return res.json({error, content: undefined});
        }
    }
}

module.exports = { SearchUserService };