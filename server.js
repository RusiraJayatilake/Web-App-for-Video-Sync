const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
// const {v4: uuidv4} = require('uuid');

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


//socket.io
let clients = [];

io.on('connection', (socket) => {
  clients.push(socket);

  socket.on('playEvent', function(data){
    console.log(data);
    // Broadcast the data to all connected clients except the sender
    io.emit('playEvent', data);
  });

  socket.on('disconnect', () => {
    clients = clients.filter(client => client != socket);
    console.log("Client disconnected");
  });

  console.log("client connected to the server");

});


// port listening
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//created random url 
// app.get("/", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

// app.get('/:video', (req, res) => {
//   res.render('index', {videoID: req.param.video});
// });





