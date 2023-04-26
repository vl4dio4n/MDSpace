const { sequelize } = require('../db');
const { Group } = require('../models/Group');
const { User } = require('../models/User');
const { UserGroup } = require('../models/UserGroup');
const { ContactMessage } = require('../utils/ContactMessage');
const { CustomError } = require('../utils/Error');
const { GroupInfo } = require('../utils/GroupInfo');
const { GroupMember } = require('../utils/GroupMember');


class ChatService {
    static async getMessages(req, res, next){
        const threadId = req.query.threadId;
        try {
            let messages = (await sequelize.query(`
                SELECT "Messages".message_id, "Messages".sender_id, "Users".username, "Messages".content, "Messages".timestamp, "Messages".type
                FROM "Messages" 
                JOIN "Users" ON "Users".id = "Messages".sender_id
                WHERE "Messages".thread_id = ${threadId}
                ORDER BY timestamp;
            `))[0].map(message => new ContactMessage(message.message_id, message.sender_id, message.username, message.content, message.timestamp, message.type));
        
            return res.json({error: undefined, content: messages});
        } catch (err){
            const error = new CustomError('DatabaseError', 'There was a problem fetching the messages. You should panic!');
            return res.json({error, content: undefined});
        }
    }

    static async getGroupInfoFromDB(groupId){
        const group = await Group.findOne({ where: { id: groupId }});
        const groupInfo = new GroupInfo(group.id, group.group_name, group.description, group.group_name ? 'group' : 'user', []);
            groupInfo.members = (await sequelize.query(`
                SELECT u.username, ug.role 
                FROM "UserGroups" ug
                JOIN "Users" u ON u.id = ug.user_id
                WHERE ug.group_id = ${groupId};            
            `))[0].map(user => new GroupMember(user.username, user.role));
        return groupInfo;
    }

    static async getGroupInfo(req, res, next){
        const groupId = req.query.groupId;
        try {
            const groupInfo = await ChatService.getGroupInfoFromDB(groupId);
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

            const updatedGroup = await ChatService.getGroupInfoFromDB(groupId);
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
            ChatService.updateUserRole(username, groupId, 'admin');
            
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
            ChatService.updateUserRole(username, groupId, 'member');

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
}

module.exports = {ChatService};