import * as server from 'express'
import * as httpModule from 'http'
import RoomTrackerService from './services/RoomTracker.js'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import { ClientToServerEvents, ServerToClientEvents } from '@shared/index.js'
const http = httpModule.createServer(server)
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    undefined,
    undefined
>(http, {
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
        try {
            roomTracker.playerDisconnected(socket)
        } catch (err) {
            console.error(`Error while disconnecting player: ${err}`)
        }
    })

    socket.on('create-room', function (payload, cb) {
        const { defaultRoundDuration } = payload
        try {
            const roomId = roomTracker.createRoom({ defaultRoundDuration })
            cb({ success: true, data: { roomId } })
        } catch (err) {
            console.error(`Error while creating room: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('leave-room', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.leaveRoom({ roomId, socket })
            cb({ success: true })
        } catch (err) {
            console.error(`Error while leaving room: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('join-room', function (payload, cb) {
        const { roomId, playerName, playerType } = payload
        const player = { id: socket.id, name: playerName, type: playerType }

        try {
            roomTracker.joinRoom({ socket, roomId, player })
            cb({ success: true })
        } catch (err) {
            console.error(`Error while joining room: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('start-game', function (payload, cb) {
        const { roomId } = payload

        try {
            roomTracker.startGame(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while starting game: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('submit-answer', function (payload, cb) {
        const { roomId, answer } = payload
        try {
            roomTracker.submitAnswer(socket, roomId, answer)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while submitting answer: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('submit-vote', function (payload, cb) {
        const { roomId, playerId } = payload
        try {
            roomTracker.submitVote(roomId, playerId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while submitting vote: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('review-scores', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.reviewScores(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while reviewing scores: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('start-next-round', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.startNextRound(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while starting next round: ${err}`)
            cb({ success: false, data: err })
        }
    })

    socket.on('suggest', function (payload, cb) {
        const { roomId, suggestionType, suggestion } = payload
        try {
            roomTracker.handleSuggestion(roomId, suggestionType, suggestion)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while starting next round: ${err}`)
            cb({ success: false, data: err })
        }
    })
})

// Start listening on 3030
http.listen(3030, function () {
    console.log('Server started!')
})
