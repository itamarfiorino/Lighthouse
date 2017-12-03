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

var line_history = {};
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/about', function (req, res) {
  res.sendFile(__dirname + '/public/about.html');
});
io.on('connection', function(socket){
  console.log("Connection " + socket.id);
  console.log("History: " + JSON.stringify(line_history));
  for(var s in line_history)
    for (var i in line_history[s]) {
      if(i%2==1){
        socket.emit('draw_line', { line: line_history[s][i], color: line_history[s][i-1], size:s} );
      }
    }
  socket.on('draw_line', function (data) {
    try{line_history[data.size].push(data.color);}catch(err){
      line_history[data.size] = [data.color];
    }
    console.log(line_history[data.size]);
    line_history[data.size].push(data.line);
    io.emit('draw_line', { line: data.line , color: data.color, size:data.size});
  });
});
