const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const { User } = require("./User");
const { Thread } = require("./Thread");
const { Group } = require("./Group");


class LastActivity extends Model {}

LastActivity.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    thread_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Thread,
            key: 'thread_id'
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'LastActivities',
    timestamps: false
})

module.exports = { LastActivity }