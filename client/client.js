// npm i socket.io-client
// npm i snowpack
// type = "module"
//client import (utilizes es6 module import)
//differs from server import (utilizes node module type import)

//use emit to send data from the client to the server, you can
//name the event anything you want
//this "emit" method sends information to server
//you can pass in as much information as you want
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

//custom events should be named the same between server and client
//event naming should consider the client viewpoint

//this is the connect event which is triggered when client connects to server
//this "on" method listens to events from the server
socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id}`);
});

//each time we emit, we must listen...for both server and client
socket.on("receive-message", message => {
  console.log(`message received: ${message} `);
});

//every socket is in a room that is the same as their id
const messageToRoom = "roommmiiie";
//const room = socket.id; in case of direct message

socket.emit("sender-not-included-message", messageToRoom);

const sendMsgButton = document.querySelector("#send-msg");
const sendMsgAllButton = document.querySelector("#send-msg-all");
const joinRoomButton = document.querySelector("#join-room");
const input = document.querySelector("input");
//room can be anything! "Test"
//connect to socket.id in case of direct message
let inputValue;

sendMsgButton.addEventListener("click", () => {
  socket.emit("send-message-to-room", messageToRoom, inputValue);
});
input.addEventListener("change", e => {
  inputValue = input.value;
});
joinRoomButton.addEventListener("click", () => {
  console.log(inputValue);
  //we can pass in callbacks...this is an emit callback
  //the can be anonymous or defined
  //emit callback NEEDS to come last
  socket.emit("join-room", inputValue, message => {
    displayMessage(message);
  });
});

sendMsgAllButton.addEventListener("click", () => {
  socket.emit("send-message", "to everyone!!!");
});

//using function so we can have our callback differ between server and client
//and have different outputs between different clients
function displayMessage(message) {
  const div = document.createElement("div");
  div.innerText = message;
  document.body.appendChild(div);
}
