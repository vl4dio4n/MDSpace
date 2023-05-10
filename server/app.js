const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');

const { pool, sequelize } = require('./db');
const { Session } = require('./models/Session');
const { User } = require('./models/User');
const { Group } = require('./models/Group');
const { UserGroup } = require('./models/UserGroup'); 
const { Thread } = require('./models/Thread'); 
const { Message } = require('./models/Message');
const { LastActivity } = require('./models/LastActivity');

const { authRoutes } = require('./routes/AuthenticationRoutes');
const { usersRoutes } = require('./routes/UsersRoutes');
const { groupsRoutes } = require('./routes/GroupsRoutes');
const { ChatController } = require("./controllers/ChatController");

sequelize.sync();


// async function getData() {
//     try {
//         const res = await pool.query(`SELECT * FROM "Users"`);
//         console.log(res.rows)
//     } catch (error) {
//         console.error(error)
//     }
// }

// getData();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {origin: '*'}
});


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: Session.getTableName()
    }),
    secret: "WhiteSharksEatCookies",
    resave: false,
    saveUninitialized: false
}))


app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "HEAD", "OPTIONS"],
    credentials: true
}));

ChatController.init(io);
ChatController.run();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authRoutes);
app.use(usersRoutes);
app.use(groupsRoutes);



// io.on('connection', socket => {
//     console.log('New WS Connection...');
//     socket.emit('message', 'Welcome to allFriends!');
// });


// app.get("/", (req, res) => {
//     req.session.isAuth = true;
//     console.log(req.session);
//     console.log(req.session.id)
//     res.send("Salut")
// })

server.listen(5000, console.log("Server is running on http://localhost:5000"));
