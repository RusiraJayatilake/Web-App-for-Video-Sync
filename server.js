const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 2000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.render('index');
});


io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('play', () => {
    socket.broadcast.emit('play');
  });

  socket.on('pause', () => {
    socket.broadcast.emit('pause');
  });

  socket.on('seek', (time) => {
    socket.broadcast.emit('seek', time);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
  
});


// port listening
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







