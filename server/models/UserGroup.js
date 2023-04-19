const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const { User } = require("./User");
const { Group } = require("./Group");

class UserGroup extends Model {}

UserGroup.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Group,
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM("member", "admin"),
        defaultValue: "member"
    }
}, {
    sequelize,
    tableName: 'UserGroups',
    timestamps: false
})

module.exports = { UserGroup }