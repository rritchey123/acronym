import server from 'express'
import httpModule from 'http'
import RoomTrackerService from './services/RoomTracker.js'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
const http = httpModule.createServer(server)
const io = new Server(http, {
    cors: {
        origin: [`http://localhost:3000`, 'https://admin.socket.io'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
})

// URL => https://admin.socket.io/#/
instrument(io, { auth: false, mode: 'development' })

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id)

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id)
    })

    socket.on('create-room', function (cb) {
        console.log('create-room FROM ' + socket.id)
        const roomTracker = RoomTrackerService.getInstance()
        const message = roomTracker.createRoom()
        cb(message)
    })

    socket.on('leave-room', function (payload, cb) {
        console.log('leave-room FROM ' + socket.id, 'PAYLOAD: ', payload)
        const { roomId } = payload

        socket.leave(roomId)

        const roomTracker = RoomTrackerService.getInstance()
        const message = roomTracker.leaveRoom(roomId, socket.id)

        cb(message)

        roomTracker.updatePlayers(socket, roomId)
    })

    socket.on('join-room', function (payload, cb) {
        console.log('join-room EVENT ' + socket.id, 'PAYLOAD: ', payload)
        const { roomId, playerName, playerType } = payload

        const roomTracker = RoomTrackerService.getInstance()
        const message = roomTracker.joinRoom(socket, roomId, {
            playerName,
            playerId: socket.id,
            playerType,
        })

        cb(message)

        roomTracker.updatePlayers(socket, roomId)
    })

    socket.on('start-game', function (payload) {
        console.log('start-game EVENT ' + socket.id, 'PAYLOAD: ', payload)
        const { roomId } = payload

        const roomTracker = RoomTrackerService.getInstance()
        const message = roomTracker.startGame(socket, roomId)

        // ! Emit to all !
        socket.emit('game-started', message)
        socket.in(roomId).emit('game-started', message)
    })

    socket.on('end-game', function (payload) {
        console.log('end-game EVENT ' + socket.id, 'PAYLOAD: ', payload)
        const { roomId } = payload

        const roomTracker = RoomTrackerService.getInstance()
        const message = roomTracker.endGame(roomId)

        socket.emit('game-ended', message)
        socket.in(roomId).emit('game-ended', message)
    })

    socket.on('submit-answer', function (payload) {
        console.log('submit-answer EVENT ' + socket.id, 'PAYLOAD: ', payload)
        const { roomId, answer } = payload

        const roomTracker = RoomTrackerService.getInstance()
        roomTracker.submitAnswer(socket, roomId, answer)
    })
})

// Start listening on 3030
http.listen(3030, function () {
    console.log('Server started!')
})
