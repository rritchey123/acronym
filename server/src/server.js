const server = require('express')();
const http = require('http').createServer(server);


// Enable requests coming in from the front end?
const io = require('socket.io')(http, {
  "cors": {
    "origin": `http://localhost:${3000}`
  }
})


io.on('connection', function (socket) {
  console.log('A user connected: ' + socket.id);

  socket.on('create-something', function (e) {
    console.log('GOT A create-something EVENT!!!' + socket.id);
    console.log(e)
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected: ' + socket.id);
  });
});

// Start listening on 3030
http.listen(3030, function () {
  console.log('Server started!');
});