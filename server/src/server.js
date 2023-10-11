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

  socket.on('disconnect', function () {
    console.log('A user disconnected: ' + socket.id);
  });

  socket.on('create-room', function (payload) {
    const { playerName } = payload
    console.log('create-room FROM ' + socket.id, "PAYLOAD: ", payload);

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.createRoom(playerName, socket.id)

    socket.emit("room-created", message)
  });

  socket.on('leave-room', function (payload) {
    console.log('leave-room FROM ' + socket.id, "PAYLOAD: ", payload);
    const { roomId } = payload

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.leaveRoom(roomId, socket.id)

    socket.emit("room-left", message)
  });

  socket.on('join-room', function (payload) {
    console.log('join-room EVENT ' + socket.id, "PAYLOAD: ", payload);
    const { roomId, playerName } = payload

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.joinRoom(roomId, { playerName, playerId: socket.id })

    socket.emit("room-joined", message)
  });



});

// Start listening on 3030
http.listen(3030, function () {
  console.log('Server started!');
});