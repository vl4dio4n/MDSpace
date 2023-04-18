const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");

class Session extends Model {}

Session.init({
    sid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    sess: {
        type: DataTypes.JSON
    },
    expire: {
        type: DataTypes.DATE(6)
    }
}, {
    sequelize,
    modelName: 'Session',
    timestamps: false
});

Session.sync();

module.exports = { Session }