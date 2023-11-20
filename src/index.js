import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

app.use(cors());
app.use(express.json());
const api_key = "msyqt539twqg";
const api_secret =
  "74gkp9qr9njchng42f23vp7k2htyr7ack7kh8cff7y54p2yy2une4kqadgpxs5du";
const serverClient = StreamChat.getInstance(api_key, api_secret);
app.get("/",async (req,res)=>{
  const { users } = await serverClient.queryUsers({});
  res.json({length:users.length,hello:users})

})
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    console.log("userrrr",{ token, userId, firstName, lastName, username, hashedPassword });
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("req.body.username",req.body.username);
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({});
    console.log("users",users);
    // if (users.length === 0) ;
    users.forEach(async(user)=>{
      console.log("user.name",user.name);
      console.log("username",username);
      if(user.name===username){
        const token = serverClient.createToken(user.id);
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (passwordMatch) {
          console.log("iazhgdjh");
          res.status(200).json({
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            username,
            userId: user.id,
          })
        }else{
          return res.json({ message: "User not found" })
        }
      }
    })

    

   
  } catch (error) {
    res.status(400).json(error)  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
