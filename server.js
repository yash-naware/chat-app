const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Admin';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  function find_unique_characters( string ){
    var unique='';
    for(var i=0; i<string.length; i++){
        if(unique.indexOf(string[i])==-1){
            unique += string[i];
        }
    }
    return unique;
}

const ceasar = (str)=>{  
    var solved ="";
    for(var i=0;i<str.length;i++){ 
        var asciiNum =str[i].charCodeAt();
        if(asciiNum >= 97 && asciiNum <= 122){
            solved += String.fromCharCode(asciiNum);   
        }
        else if(asciiNum >= 65 && asciiNum <= 90){
            solved += String.fromCharCode(asciiNum);
        }
       
       
    }
    var arr1 = 26;     
    var arr = new Array(arr1).fill(0); 
    for (var j=0; j<26; j++) 
    { 
        if(arr[j] == 0) 
        { 
            arr[j]=1; 
            solved+=String.fromCharCode(j + 97); 
            //console.log(encoded)
        } 
    }  
    var solved1=(find_unique_characters(solved));   
    return solved1;
    
  }

  const decriptit = ( message2,encoder)=>{ 
    let  enc = new Map();
    for(j=0;j<encoder.length;j++){
       // var num =encoder[j].charCodeAt();
        enc.set(encoder[j],j);  
    }
    //console.log(enc);
    var plaintext = "abcdefghijklmnopqrstuvwxyz";
    var decipher=""; 
    for (var i=0; i<message2.length; i++) 
    {
        var asciiNum2 = message2[i].charCodeAt(); 
        //console.log(asciiNum2);
        if (message2[i] >='a' && message2[i] <='z') 
        { 
            var pos =enc.get(message2[i]); 
            //console.log(pos);

            decipher += plaintext[pos]; 
            //console.log(decipher);
        } 
        else if(message2[i] >= 65 && message2[i]<= 90) 
        { 
            var pos = enc[message2[i]];   
            decipher += plaintext[pos]; 
        } 
        else
        { 
            decipher +=message2[i]; 
        } 
    } 
    return decipher;


  }

  // Listen for chatMessage
  socket.on('chatMessage', mss => {
    const user = getCurrentUser(socket.id);
    console.log(mss) //encrypt message on console.
    const key="computer";
    const key1=(find_unique_characters(key));
    const encoder= (ceasar(key1));
    const mg =(decriptit(mss,encoder));
    io.to(user.room).emit('message', formatMessage(user.username, mg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
