const { sequelize } = require('../db');
const { Group } = require('../models/Group');
const { Thread } = require('../models/Thread');
const { User } = require('../models/User');
const { UserGroup } = require('../models/UserGroup');
const { ContactMessage } = require('../utils/ContactMessage');
const { CustomError } = require('../utils/Error');
const { GroupInfo } = require('../utils/GroupInfo');
const { GroupMember } = require('../utils/GroupMember');
const { ChatController } = require('./ChatController');


class GroupsController {
    static async getMessages(req, res, next){
        const threadId = req.query.threadId;
        try {
            const groupId =  (await Thread.findOne({where: { thread_id: threadId }})).group_id;
            
            let messages = (await sequelize.query(`
                SELECT "Messages".message_id, "Messages".sender_id, "Users".username, "Messages".content, "Messages".timestamp, "Messages".type
                FROM "Messages" 
                JOIN "Users" ON "Users".id = "Messages".sender_id
                WHERE "Messages".thread_id = ${threadId}
                ORDER BY timestamp;
            `))[0].map(message => new ContactMessage(message.message_id, threadId, groupId, message.sender_id, message.username, message.content, message.timestamp, message.type));
        
            return res.json({error: undefined, content: messages});
        } catch (err){
            const error = new CustomError('DatabaseError', 'There was a problem fetching the messages. You should panic!');
            return res.json({error, content: undefined});
        }
    }

    static async getGroupInfoFromDB(groupId, sessionUser){
        const group = await Group.findOne({ where: { id: groupId }});
        
        const groupInfo = new GroupInfo(group.id, group.group_name, group.description, group.group_name ? 'group' : 'user', [], false);
            groupInfo.members = (await sequelize.query(`
                SELECT u.username, ug.role 
                FROM "UserGroups" ug
                JOIN "Users" u ON u.id = ug.user_id
                WHERE ug.group_id = ${groupId};            
            `))[0].map(user => {
                if(!group.group_name && user.username != sessionUser.username && ChatController.isUserOnline(user.username)){
                        groupInfo.isOnline = true;
                }
                return new GroupMember(user.username, user.role)
            });
                
        return groupInfo;
    }

    static async getGroupInfo(req, res, next){
        const groupId = req.query.groupId;
        try {
            const groupInfo = await GroupsController.getGroupInfoFromDB(groupId, req.session.user);
            return res.json({ error: undefined, content: groupInfo });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem fetching group's info. You should panic!");
            return res.json({error, content: undefined});
        } 
    }

    static async editGroupProfile(req, res, next){
        try {
            let groupId = req.body.groupId;
            let groupName = req.body.groupName;
            let description = req.body.description;

            await Group.update({
                group_name: groupName,
                description: description
            }, {
                where: {id: groupId}
            });

            const updatedGroup = await GroupsController.getGroupInfoFromDB(groupId, req.session.user);
            return res.json({ error: undefined, content: updatedGroup });

        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem updating group's profile. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async updateUserRole(username, groupId, role){
        const userId = (await User.findOne({where: {username: username}})).id;

        await UserGroup.update({
            role: role
        }, {
            where: {
                user_id: userId,
                group_id: groupId
            }
        });
    }

    static async promoteGroupMember(req, res, next){
        try {
            const username = req.body.username;
            const groupId = req.body.groupId;
            GroupsController.updateUserRole(username, groupId, 'admin');
            
            return res.json({ error: undefined, content: true });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem promoting the user. You should panic!");
            return res.json({error, content: undefined});
        }
    }


    static async demoteGroupMember(req, res, next){
        try {
            const username = req.body.username;
            const groupId = req.body.groupId;
            GroupsController.updateUserRole(username, groupId, 'member');

            return res.json({ error: undefined, content: true });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem demoting the user. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async kickGroupMember(req, res, next){
        // don't forget to close the channel  

        try {
            const username = req.body.username;
            const groupId = req.body.groupId;

            const userId = (await User.findOne({where: {username: username}})).id;

            await UserGroup.destroy({where: {user_id: userId, group_id: groupId}});
            return res.json({ error: undefined, content: true });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem kicking the user. You should panic!");
            return res.json({error, content: undefined});
        }    
    }

    static async addUserGroup(groupId, username, role){
        let userId =  (await User.findOne({where: {username: username}})).id;
        let userGroup = new UserGroup({user_id: userId, group_id: groupId, role: role});
        await userGroup.save();
    }

    static async createGroup(req, res, next){
        try {
            let groupName = req.body.groupName.trim();
            let description = req.body.description.trim();
            let members = req.body.members;

            let group = new Group({group_name: groupName, description: description});
            await group.save();

            await GroupsController.addUserGroup(group.id, req.session.user.username, 'admin');
            members.forEach(async (member) => {
                await GroupsController.addUserGroup(group.id, member, 'member');
            });
            
            let thread = new Thread({thread_name: 'general', group_id: group.id});
            await thread.save();

            return res.json({error: undefined, content: true});
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem creating the group. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async addUsers(req, res, next){
        try {
            let members = req.body;
            let groupId = parseInt(members[0]);
            members.splice(0, 1);
            members.forEach(async (member) => {
                await GroupsController.addUserGroup(groupId, member, 'member');
            });

            return res.json({error: undefined, content: true});
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem adding the users. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async createThread(req, res, next) {
        try {
            let threadName = req.body.threadName;
            let groupId = req.body.groupId;

            let thread = new Thread({thread_name: threadName, group_id: groupId});
            await thread.save();

            return res.json({error: undefined, content: true});
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem creating the thread. You should panic!");
            return res.json({error, content: undefined});
        }
    }

    static async leaveGroup(req, res, next) {
        try {
            const groupId = req.body.groupId;
            const userId = (await User.findOne({where: {username: req.session.user.username}})).id;

            await UserGroup.destroy({where: {user_id: userId, group_id: groupId}});
            return res.json({ error: undefined, content: true });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem leaving the group. You should panic!");
            return res.json({error, content: undefined});
        }
    }
}

module.exports = { GroupsController };