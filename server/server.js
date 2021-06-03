/*
How Socket io works?

**Makes a connection between server and client and has the connection
persist

**Socket io utilizes 
websockets and reduces the amount of requests to the server by establishing
one stable connection. Web sockets dont normally do this

npm i socket.io
*/

//server is on port 3000, so server's socket will be on port 3000
const io = require("socket.io")(3000, {
  //so client can be allowed access to server
  cors: {
    origin: ["http://localhost:8080"],
  },
});

//runs every time a client connects to our server
//server gives a socket to the client
io.on("connection", socket => {
  //print out client's socket id that connected
  //this is just a random id
  console.log(socket.id);
  //server listens to client, client triggers this event
  socket.on("send-message", message => {
    //io.emit will send a message to ALL clients connected
    //including the client who made the request in the first place
    io.emit("receive-message", message);

    console.log(message);
  });

  socket.on("send-message-to-room", (message, room) => {
    //if no room...this would be if your using inputValues to obtain room
    if (room === "") {
      //send message to everyone except sender
      //socket.broadcast.emit will send a message to ALL clients connected
      //EXCEPT the client who made the request in the first place
      socket.broadcast.emit("receive-message", message);
    } else {
      //everyone in room gets message except the sender!
      //.to does the broadcoast portion!
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("join-room", (room, displayMessage) => {
    //join method to connect to user with socket.id
    //socket.id == room
    //or we can join a room like "Test"
    //doesnt have to be socket.id!
    if (room === "") return;
    socket.join(room);
    console.log(`Join successful at room: ${room}`);
    //passing down message to client
    //this is due to emit callback! we can use methods from client
    //due to client emitting the function (can be any name here)

    //great use case for emit callback: successes client would want to know
    //or when a message was sent...long processing
    displayMessage(`Joined ${room}`);
  });
});
