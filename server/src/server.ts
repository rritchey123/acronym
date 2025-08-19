import express from 'express'
import httpModule from 'http'
import path from 'path'
import RoomTrackerService from './services/RoomTracker.js'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import {
    ClientToServerEvents,
    PlayerStatus,
    ServerToClientEvents,
} from '../../shared/types'

const app = express()
const http = httpModule.createServer(app)
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    undefined,
    undefined
>(http, {
    cors: {
        origin: ['https://admin.socket.io'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
})

const PORT = process.env.PORT || 3000

// Serve static files from the "public" directory
app.use(express.static('../clientV2/dist'))

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile('../clientV2/dist/index.html', { root: '../clientV2/dist' })
})

// URL => https://admin.socket.io/#/
instrument(io, { auth: false, mode: 'development' })

const roomTracker = new RoomTrackerService({ io })

io.on('connection', function (socket) {
    console.log('Connected: ' + socket.id)

    socket.on('disconnect', function () {
        try {
            roomTracker.playerDisconnected(socket)
        } catch (err) {
            console.error(`Error while disconnecting player: ${err}`)
        }
    })

    socket.on('create-room', function (cb) {
        try {
            const roomId = roomTracker.createRoom()
            cb({ success: true, data: { roomId } })
        } catch (err) {
            console.error(`Error while creating room: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('leave-room', function (payload, cb) {
        const { roomId, playerId } = payload
        try {
            roomTracker.leaveRoom({ roomId, playerId, socket })
            cb({ success: true })
        } catch (err) {
            console.error(`Error while leaving room: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('join-room', function (payload, cb) {
        const { roomId, playerName, playerType } = payload
        const player = {
            id: socket.id,
            socketId: socket.id,
            name: playerName,
            type: playerType,
            status: PlayerStatus.CONNECTED,
        }

        try {
            roomTracker.joinRoom({ socket, roomId, player })
            cb({ success: true })
        } catch (err) {
            console.error(`Error while joining room: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('start-game', function (payload, cb) {
        const { roomId } = payload

        try {
            roomTracker.startGame(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while starting game: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('submit-answer', function (payload, cb) {
        const { roomId, playerId, answer } = payload
        try {
            roomTracker.submitAnswer({ roomId, playerId, answer })
            cb({ success: true })
        } catch (err) {
            console.error(`Error while submitting answer: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('submit-vote', function (payload, cb) {
        const { roomId, playerId } = payload
        try {
            roomTracker.submitVote(roomId, playerId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while submitting vote: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('review-game-scores', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.reviewGameScores(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while reviewing scores: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('start-next-round', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.startNextRound(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while starting next round: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('suggest', function (payload, cb) {
        const { roomId, suggestionType, suggestion } = payload
        try {
            roomTracker.handleSuggestion(roomId, suggestionType, suggestion)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while suggesting ${suggestionType}: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('update-game-rules', function (payload, cb) {
        const { roomId, defaultRoundDuration, scoreLimit } = payload
        try {
            roomTracker.handleUpdateGameRules(
                roomId,
                defaultRoundDuration,
                scoreLimit
            )
            cb({ success: true })
        } catch (err) {
            console.error(`Error while updating game rules: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('add-time', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.addTime(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while adding time: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('review-round-scores', function (payload, cb) {
        const { roomId } = payload
        try {
            roomTracker.reviewRoundScores(roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while reviewing round scores: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })

    socket.on('reconnect', function ({ roomId, playerId }, cb) {
        try {
            roomTracker.reconnect(socket, playerId, roomId)
            cb({ success: true })
        } catch (err) {
            console.error(`Error while trying to reconnect user: ${err}`)
            cb({ success: false, data: `${err}` })
        }
    })
})

// Start listening on 3000
http.listen(PORT, function () {
    console.log('Server started!')
})
