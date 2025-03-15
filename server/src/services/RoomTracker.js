import { getRandomAcronym, getRandomPrompt } from './Database.js'

const SCORE_LIMIT = 10

export default class RoomTrackerService {
    constructor({ io }) {
        this._rooms = {}
        this.io = io
    }

    static getInstance() {
        if (!this._instance) this._instance = new RoomTrackerService()
        return this._instance
    }

    // Helpers
    _generateId() {
        return (Math.random() + 1).toString(36).substring(7)
    }
    _checkIfRoomExists(roomId) {
        if (this._rooms[roomId])
            throw new Error(`Room ${roomId} does not exist.`)
    }
    getRooms() {
        return this._rooms
    }

    // Room operations
    createRoom() {
        let id = this._generateId()
        while (this._rooms[id]) {
            id = this._generateId()
        }

        this._rooms[id] = {
            players: [],
            state: 'waiting',
            acronym: null,
            prompt: null,
            votes: {},
            round: 1,
            scores: {},
            isGameOver: false,
        }

        return { success: true, reason: '', data: { roomId: id } }
    }
    getRoomDetails(roomId) {
        //this._checkIfRoomExists(roomId)
        return this._rooms[roomId]
    }
    deleteRoom(roomId) {
        //this._checkIfRoomExists(roomId)
        delete this._rooms[roomId]
    }

    // Player operations
    joinRoom(socket, roomId, playerDetails) {
        const { playerId, playerName, playerType } = playerDetails
        const roomDetails = this.getRoomDetails(roomId)

        if (!roomDetails)
            return {
                success: false,
                reason: `Room ${roomId} does not exist.`,
                data: {},
            }

        if (roomDetails.state !== 'waiting')
            return {
                success: false,
                reason: `Room ${roomId} has already started`,
                data: {},
            }

        if (roomDetails.players.find((i) => i.id === playerId))
            return {
                success: false,
                reason: `Player with id ${playerId} already in room.`,
            }
        if (roomDetails.players.find((i) => i.name === playerName))
            return {
                success: false,
                reason: `Player with name ${playerName} already in room.`,
            }

        const playerObj = {
            id: playerId,
            name: playerName,
            type: playerType,
        }
        roomDetails.players.push(playerObj)

        socket.join(roomId)

        return {
            success: true,
            reason: '',
            data: { roomId, players: roomDetails.players, ...playerObj },
        }
    }

    leaveRoom(roomId, socket, onDisconnect = false) {
        const roomDetails = this.getRoomDetails(roomId)
        const playerId = socket.id

        if (!onDisconnect) socket.leave(roomId)

        if (!roomDetails)
            return {
                success: false,
                reason: `Room ${roomId} does not exist.`,
                data: {},
            }

        if (!roomDetails.players.find((i) => i.id === playerId))
            return {
                success: false,
                reason: `Player with id ${playerId} does not exist.`,
            }
        roomDetails.players = roomDetails.players.filter(
            (i) => i.id !== playerId
        )

        if (roomDetails.players.length === 0) this.deleteRoom(roomId)

        return { success: true, reason: '', data: {} }
    }

    // Game operation
    startGame(socket, roomId) {
        const room = this.getRoomDetails(roomId)
        room.state = 'playing'
        room.acronym = getRandomAcronym()
        room.prompt = getRandomPrompt()
        room.round = 1

        this.updatePlayers(socket, roomId, true)

        return { success: true, reason: '', data: { roomId } }
    }

    endGame(roomId) {
        this._rooms[roomId].state = 'ended'
        return { success: true, reason: '', data: { roomId } }
    }

    // Players
    updatePlayers(socket, roomId, emitToSender = false) {
        const roomDetails = this.getRoomDetails(roomId)
        if (!roomDetails) return

        const message = {
            success: true,
            reason: '',
            data: { room: roomDetails },
        }
        if (emitToSender) socket.emit('update-players', message)
        socket.in(roomId).emit('update-players', message)
    }

    updateAllPlayers(roomId) {
        const roomDetails = this.getRoomDetails(roomId)
        if (!roomDetails) return

        const message = {
            success: true,
            reason: '',
            data: { room: roomDetails },
        }
        this.io.in(roomId).emit('update-players', message)
    }

    submitAnswer(socket, roomId, answer) {
        const roomDetails = this.getRoomDetails(roomId)
        if (!roomDetails) return

        const playerObj = roomDetails.players.find((i) => i.id === socket.id)
        playerObj.answer = answer

        // If everyone has answered, update all players with player answers`
        if (roomDetails.players.filter((i) => !i.answer).length === 0) {
            const answers = roomDetails.players.reduce((acc, player) => {
                acc[player.id] = player.answer
                return acc
            }, {})
            this.io.in(roomId).emit('vote-ready', {
                success: true,
                reason: '',
                data: {
                    answers,
                },
            })
        }
    }

    submitVote(roomId, playerId) {
        const roomDetails = this.getRoomDetails(roomId)
        if (!roomDetails) return

        if (!roomDetails.votes) roomDetails.votes = {}
        roomDetails.votes[playerId] = (roomDetails.votes[playerId] || 0) + 1
        if (!roomDetails.scores) roomDetails.scores = {}
        roomDetails.scores[playerId] = (roomDetails.scores[playerId] || 0) + 1

        const totalVotes = Object.values(roomDetails.votes).reduce(
            (acc, cur) => acc + cur,
            0
        )
        if (totalVotes === roomDetails.players.length) {
            roomDetails.isGameOver = this.isGameOver(roomId)
            this.io.in(roomId).emit('round-summary-ready', {
                success: true,
                reason: '',
                data: {
                    votes: roomDetails.votes,
                },
            })
        }
    }

    startNextRound(socket, roomId) {
        const room = this.getRoomDetails(roomId)
        room.state = 'playing'
        room.acronym = getRandomAcronym()
        room.prompt = getRandomPrompt()
        room.round += 1
        room.votes = {}
        for (const player of room.players) {
            player.answer = null
        }

        this.updatePlayers(socket, roomId, true)
        this.io.in(roomId).emit('next-round-started', {
            success: true,
            reason: '',
            data: {},
        })
    }

    reviewScores(socket, roomId) {
        const roomDetails = this.getRoomDetails(roomId)
        const scoreArray = []
        for (const player of roomDetails.players) {
            scoreArray.push({
                name: player.name,
                score: roomDetails.scores[player.id] || 0,
            })
        }
        this.updatePlayers(socket, roomId, true)

        // {name, score}[]
        this.io.in(roomId).emit('review-scores', {
            success: true,
            reason: '',
            data: scoreArray,
        })
    }

    isGameOver(roomId) {
        const roomDetails = this.getRoomDetails(roomId)
        return Object.values(roomDetails.scores).some(
            (score) => score >= SCORE_LIMIT
        )
    }

    getRoomIdByPlayerId(playerId) {
        return Object.entries(this._rooms).find(([, roomDetails]) =>
            roomDetails.players.some((p) => p.id === playerId)
        )?.[0]
    }
}
