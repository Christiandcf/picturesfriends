var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); // socket.io
users = []; // Constains Users for chat
connections = []; // Number of sockets

// Routing
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// this allows me to go to my resources
app.use("/public", express.static(__dirname + '/public'));



io.on('connection', function(socket) {

    // Push connection
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });


    /*
    * Rooms
    */
    socket.on('statup', function(room){
      socket.room = room;
      socket.join(room);
    })

    socket.on('join', function(room){
      socket.leave(socket.room);
      socket.join(room);
      socket.room = room;
      console.log("room joining: " + socket.room + " id: " + socket.id);
    });

    /*
    * Canvas
    */


    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
      console.log('room is: ' + socket.room);
       // send line to all clients
       io.to(socket.room).emit('draw_line', { line: data.line });
    });

    socket.on('reset', function(data){
      io.to(socket.room).emit('reset', data);
    });

    socket.on('winning', function(data){
      io.to(socket.room).emit('winning', socket.id);
    });


    /*
     * Word checking
     */
    // Gets the picked word for every socket to have it in display
    socket.on('generated', function(word) {
        console.log('word: ' + word + 'room: ' + socket.room);
        io.to(socket.room).emit('generated', word);
    });

    // checks if answers is legit
    socket.on('answered', function(word) {
        console.log('answer: ' + word + 'room: ' + socket.room);
        io.to(socket.room).emit('answered', word, socket.id);
    });


    // Hides the drawer btn
    socket.on('hideDraw', function(data){
      io.to(socket.room).emit('hideDraw', data);
    })

    // Show canvas
    socket.on('showCanvas', function(data){
      io.to(socket.room).emit('showCanvas');
    });


});

http.listen(4000, function() {
    console.log('listening on *:4000');
});
