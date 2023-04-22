const { sequelize } = require('../db');
const { ContactMessage } = require('../utils/ContactMessage');
const { CustomError } = require('../utils/Error');


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
}

module.exports = {ChatService};