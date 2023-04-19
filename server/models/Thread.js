const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const { Group } = require("./Group");

class Thread extends Model {}

Thread.init({
    thread_id: {
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
    thread_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "general"
    }
}, {
    sequelize,
    tableName: 'Threads',
    timestamps: false
})

module.exports = { Thread };