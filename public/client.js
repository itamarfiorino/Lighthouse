var canvas  = document.getElementById('drawing');
var context = canvas.getContext('2d');
context.strokeStyle = "#fff";
context.lineWidth = 6;
function setColor(){
  var styleStr = document.getElementById("myColor").value;
  context.strokeStyle = styleStr;
  changeSize();
}
function setSize(size){
  context.lineWidth = size;
  setColor();
}
//create socket connection
document.addEventListener("DOMContentLoaded", function() {
  var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  };


  var width   = window.innerWidth;
  var height  = window.innerHeight;
  var socket = io.connect();
  canvas.width = width;
  canvas.height = height;
  canvas.onmousedown = function(e){
    mouse.click = true;
  };
  canvas.onmouseup = function(e){
    mouse.click = false;
  };
  canvas.onmousemove = function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.pos.x = (e.clientX - rect.left) / width;
    mouse.pos.y = (e.clientY - rect.top) / height;
    mouse.move = true;
  };
  socket.on('draw_line', function (data) {
    console.log(JSON.stringify(data));
    var line = data.line;
    context.beginPath();
    context.lineCap="round";
    context.strokeStyle = data.color;
    context.lineWidth=data.size;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });
  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], color: context.strokeStyle , size:context.lineWidth});
      mouse.move = false;
    }
    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 1);
  }
  mainLoop();
});
