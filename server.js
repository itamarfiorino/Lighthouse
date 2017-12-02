var express = require('express');
var socket = require('socket.io');

//setup
var app = express();
var server = app.listen(8080, function(){
  console.log("Server Running on 8080");
});


//static
app.use(express.static('public'));


//sockets
var io = socket(server);

var line_history = [];
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html');
});
io.on('connection', function(socket){
  console.log("Connection " + socket.id);
  for (var i in line_history) {
    socket.emit('draw_line', { line: line_history[i] } );
  }
  socket.on('draw_line', function (data) {
    line_history.push(data.line);
    io.emit('draw_line', { line: data.line });
  });
});