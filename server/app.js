const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');

const { pool } = require('./db') 
const { User } = require('./models/User');
const { Session } = require('./models/Session')
const { authRoutes } = require('./routes/AuthenticationRoutes');


async function getData() {
    try {
        const res = await pool.query(`SELECT * FROM "Users"`);
        console.log(res.rows)
    } catch (error) {
        console.error(error)
    }
}

getData();

const app = express();

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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(authRoutes);


app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id)
    res.send("Salut")
})

app.listen(5000, console.log("Server is running on http://localhost:5000"));
