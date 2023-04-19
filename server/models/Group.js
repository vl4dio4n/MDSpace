const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");

class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'Groups',
    timestamps: false
})

module.exports = { Group }