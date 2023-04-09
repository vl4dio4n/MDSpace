const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  try {
    const r = await axios.put(
        'https://api.chatengine.io/users/',
        // create a new user, daca nu exista
        {username : username, secret: username, first_name: username},
        {headers: {"private-key" : "ec718060-802c-4740-9a82-5da6d8b5184f"}}
    )
    return res.status(r.status).json(r.data)
  } catch (e) {
    return res.status(e.response.status).json(e.response.data)
  } 
});

app.listen(3001);