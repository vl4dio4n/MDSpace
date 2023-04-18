const { Pool } = require("pg");
const { Sequelize } = require('sequelize') 

const pool = new Pool({
    user: 'vl4dio4n',
    database: 'AllFriends',
    password: 'Elena1973',
    port: 5432,
    host: 'localhost'
})


const sequelize = new Sequelize('AllFriends', 'vl4dio4n', 'Elena1973', {
    host: "localhost",
    dialect: "postgres"
});

module.exports = { pool, sequelize }
