import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
const {Canvas} = require('canvas');

const app = express();

app.use(cors());
app.use(express.json());
const api_key = "ja2mczkz2wf7";
const api_secret =
  "z4g65pwh2m3bxjv9pqpxdyd8kap4abkfdr22qyy3setu63gxxsk8nrr5d9nwbn8b";
const serverClient = StreamChat.getInstance(api_key, api_secret);
app.get("/",(req,res)=>{
  res.json({hello:"hello"})
})
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = password
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = password
     

    if (passwordMatch) {
      res.status(200).json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      })
      // res.json({
      //   token,
      //   firstName: users[0].firstName,
      //   lastName: users[0].lastName,
      //   username,
      //   userId: users[0].id,
      // });
    }
  } catch (error) {
    res.json("this is error",error);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
