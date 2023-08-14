const server = require('express')();
const http = require('http').createServer(server);

const RoomTrackerService = require('./services/RoomTracker.js')


// Enable requests coming in from the front end?
const io = require('socket.io')(http, {
  "cors": {
    "origin": `http://localhost:${3000}`
  }
})


io.on('connection', function (socket) {
  console.log('A user connected: ' + socket.id);

  socket.on('create-room', function (payload) {
    console.log('create-room FROM ' + socket.id, "PAYLOAD: ", payload);

    const roomTracker = RoomTrackerService.getInstance()
    const roomId = roomTracker.createRoom()

    socket.emit("room-created", roomId)
  });

  socket.on('join-room', function (payload) {
    console.log('RECEIVED join-room EVENT ' + socket.id);
    console.log(payload)
  });


  socket.on('disconnect', function () {
    console.log('A user disconnected: ' + socket.id);
  });
});

// Start listening on 3030
http.listen(3030, function () {
  console.log('Server started!');
});