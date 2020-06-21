const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  })

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('join', (userName) => { 
        console.log('New user has just joined: ' + socket.id);
        users.push({author: userName, id: socket.id});
        socket.broadcast.emit('message', {author: 'ChatBot', content: `${userName} has joined to the conversation!`});
        console.log('users: ', users);
    });

    socket.on('message', (message) => {
        //console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        users = users.filter(user => {
            socket.broadcast.emit('message', {author: 'ChatBot', content: `${user.author} has left the conversation!`});
            user.id !== socket.id
        });
        console.log('users: ', users);
      });

    
    console.log('I\'ve added a listener on message event \n');   
});
