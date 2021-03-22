const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);// decrypt message on local host js.
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
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
  const cipheredIt = ( message,encoder)=>{ 
    var cipher=""; 
  
    // This loop ciphered the message. 
    // Spaces, special characters and numbers remain same. 
    for (var i=0; i<message.length; i++) 
    { 
        var asciiNum1 =message[i].charCodeAt();
        if (asciiNum1 >=97 && asciiNum1 <=122) 
        { 
            var pos = asciiNum1 - 97; 
            cipher += encoder[pos];
        } 
        else if (asciiNum1 >=65 && asciiNum1 <=90) 
        { 
            var pos = asciiNum1 - 65; 
            cipher += encoder[pos]; 
        } 
        else
        { 
            cipher += message[i]; 
        } 
    } 
    return cipher; 
  }
  const key="computer";
  const key1=(find_unique_characters(key));
  const encoder= (ceasar(key1));
  const mss = (cipheredIt(msg,encoder));
  socket.emit('chatMessage', mss);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
