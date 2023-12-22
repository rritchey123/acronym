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

  socket.on('create-room', function (cb) {
    console.log('create-room FROM ' + socket.id);
    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.createRoom()
    cb(message)
  });

  socket.on('leave-room', function (payload, cb) {
    console.log('leave-room FROM ' + socket.id, "PAYLOAD: ", payload);
    const { roomId } = payload

    socket.leave(roomId)

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.leaveRoom(roomId, socket.id)

    cb(message)

    roomTracker.updatePlayers(socket, roomId)
  });

  socket.on('join-room', function (payload, cb) {
    console.log('join-room EVENT ' + socket.id, "PAYLOAD: ", payload);
    const { roomId, playerName, playerType } = payload

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.joinRoom(socket, roomId, { playerName, playerId: socket.id, playerType })

    cb(message)

    roomTracker.updatePlayers(socket, roomId)
  });

  socket.on('start-game', function (payload) {
    console.log('start-game EVENT ' + socket.id, "PAYLOAD: ", payload);
    const { roomId } = payload

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.startGame(roomId)

    // ! Emit to all !
    socket.emit("game-started", message)
    socket.in(roomId).emit("game-started", message)
  })

  socket.on('end-game', function (payload) {
    console.log('end-game EVENT ' + socket.id, "PAYLOAD: ", payload);
    const { roomId } = payload

    const roomTracker = RoomTrackerService.getInstance()
    const message = roomTracker.endGame(roomId)

    socket.emit("game-ended", message)
    socket.in(roomId).emit("game-ended", message)
  })


});

// Start listening on 3030
http.listen(3030, function () {
  console.log('Server started!');
});