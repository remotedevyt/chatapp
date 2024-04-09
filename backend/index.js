const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const { addChat,getChats } = require('./utils/chat');
app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:5173"]
  }
});

var socketUsers = [];
io.on("connection", (socket) => {
  console.log("socket connected for user : ",socket.handshake.headers.userid);
  socket.join('room'+socket.handshake.headers.userid);
  socketUsers.push(socket.handshake.headers.userid);
  setTimeout(()=>{
    io.emit("USERS",socketUsers);
  },1000);
  

  socket.on("disconnect", async () => {
    console.log("user disconnected",socket.handshake.headers.userid);
    socketUsers = socketUsers.filter((user) => {
      return user !== socket.handshake.headers.userid
    })
    setTimeout(()=>{
      io.emit("USERS",socketUsers);
    },1000);
  });

  socket.on("SENDMSG", (e)=>{
    socket.to('room'+e.receiver).emit("MSG",e);
    // save in db
    addChat(e);
  });
});



app.get('/', (req, res) => {
  res.send('Hello World!')
});

const auth = require('./routes/auth');
app.use('/auth',auth);

app.post('/chats', async (req,res) => {
  let userchats = await getChats({"sender":req.body.sender,"receiver":req.body.receiver});
  res.json({"chats":userchats});
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})