const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const { Group } = require("./Group");
const { Thread } = require("./Thread");
const { User } = require("./User");

class Message extends Model {}

Message.init({
    message_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    thread_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Thread,
            key: 'thread_id'
        }
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("text"),
        defaultValue: "text"
    }
}, {
    sequelize,
    tableName: 'Messages',
    timestamps: false
})

module.exports = { Message }