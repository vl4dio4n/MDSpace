const { sequelize } = require('../db');
const { Group } = require('../models/Group');
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

    static async getGroupInfo(req, res, next){
        const groupId = req.query.groupId;
        try {
            let group = await Group.findOne({ where: { id: groupId }});
            let groupInfo = new GroupInfo(group.id, group.group_name, group.description, group.group_name ? 'group' : 'user', []);
            groupInfo.members = (await sequelize.query(`
                SELECT u.username, ug.role 
                FROM "UserGroups" ug
                JOIN "Users" u ON u.id = ug.user_id
                WHERE ug.group_id = ${groupId};            
            `))[0].map(user => new GroupMember(user.username, user.role));
            
            console.log(groupInfo);

            return res.json({ error: undefined, content: groupInfo });
        } catch (err) {
            const error = new CustomError('DatabaseError', "There was a problem fetching group's info. You should panic!");
            return res.json({error, content: undefined});
        } 
    }
}

module.exports = {ChatService};