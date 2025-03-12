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

const roomTracker = new RoomTrackerService({ io })

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id)

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id)
    })

    socket.on('create-room', function (cb) {
        const message = roomTracker.createRoom()
        cb(message)
    })

    socket.on('leave-room', function (payload, cb) {
        const { roomId } = payload

        const message = roomTracker.leaveRoom(roomId, socket)

        cb(message)

        roomTracker.updatePlayers(socket, roomId)
    })

    socket.on('join-room', function (payload, cb) {
        const { roomId, playerName, playerType } = payload

        const message = roomTracker.joinRoom(socket, roomId, {
            playerName,
            playerId: socket.id,
            playerType,
        })

        cb(message)

        roomTracker.updatePlayers(socket, roomId)
    })

    socket.on('start-game', function (payload) {
        const { roomId } = payload

        const message = roomTracker.startGame(socket, roomId)

        io.in(roomId).emit('game-started', message)
    })

    socket.on('end-game', function (payload) {
        const { roomId } = payload

        const message = roomTracker.endGame(roomId)

        io.in(roomId).emit('game-ended', message)
    })

    socket.on('submit-answer', function (payload) {
        const { roomId, answer } = payload

        roomTracker.submitAnswer(socket, roomId, answer)
    })

    socket.on('submit-vote', function (payload) {
        const { roomId, playerId } = payload
        console.log(payload)
        roomTracker.submitVote(roomId, playerId)
    })
})

// Start listening on 3030
http.listen(3030, function () {
    console.log('Server started!')
})
