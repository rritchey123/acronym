import { Player, Room, RoomStatus } from '@shared/index.js'
import { getRandomAcronym, getRandomPrompt } from './Database.js'
import { generateId } from '../utils.js'

const SCORE_LIMIT = 10

const DEFAULT_ROOM = {
    status: RoomStatus.WAITING,
    acronym: null,
    prompt: null,
    isGameOver: false,
    round: 1,
    votes: {},
    players: {},
    scores: {},
}

export default class RoomTrackerService {
    private _rooms: { [roomId: string]: Room }
    private _io: any
    constructor({ io }) {
        this._rooms = {}
        this._io = io
    }

    createRoom() {
        let id = generateId()
        // In case id already exists
        while (this._rooms[id]) {
            id = generateId()
        }

        this._rooms[id] = structuredClone(DEFAULT_ROOM)

        return { success: true, reason: '', data: { roomId: id } }
    }
    getRoom(roomId): Room | undefined {
        return this._rooms[roomId]
    }
    deleteRoom(roomId): void {
        delete this._rooms[roomId]
    }

    joinRoom({
        socket,
        roomId,
        player,
    }: {
        socket: any
        roomId: string
        player: Player
    }) {
        const { id: playerId, name: playerName, type: playerType } = player
        const room = this.getRoom(roomId)

        if (!room)
            return {
                success: false,
                reason: `Room ${roomId} does not exist.`,
                data: {},
            }
        if (room.status !== RoomStatus.WAITING)
            return {
                success: false,
                reason: `Room ${roomId} has already started`,
                data: {},
            }

        if (room.players[playerId])
            return {
                success: false,
                reason: `Player with id ${playerId} already in room.`,
            }
        if (Object.values(room.players).find((i) => i.name === playerName))
            return {
                success: false,
                reason: `Player with name ${playerName} already in room.`,
            }

        const newPlayer = {
            id: playerId,
            name: playerName,
            type: playerType,
        }
        room.players[playerId] = newPlayer

        socket.join(roomId)

        return {
            success: true,
            reason: '',
            data: { roomId, players: room.players },
        }
    }

    leaveRoom({
        socket,
        roomId,
        onDisconnect,
    }: {
        socket: any
        roomId: string
        onDisconnect?: boolean
    }) {
        const room = this.getRoom(roomId)
        const playerId = socket.id

        if (!onDisconnect) socket.leave(roomId)

        if (!room)
            return {
                success: false,
                reason: `Room ${roomId} does not exist.`,
                data: {},
            }

        if (!room.players[playerId])
            return {
                success: false,
                reason: `Player with id ${playerId} does not exist.`,
            }
        delete room.players[playerId]

        if (Object.keys(room.players).length === 0) this.deleteRoom(roomId)

        return { success: true, reason: '', data: {} }
    }

    // Game operation
    startGame(roomId) {
        const room = this.getRoom(roomId)
        room.status = RoomStatus.PLAYING
        room.acronym = getRandomAcronym()
        room.prompt = getRandomPrompt()
        room.round = 1

        this.updateAllPlayers(roomId)

        return { success: true, reason: '', data: { roomId } }
    }

    endGame(roomId) {
        const room = this.getRoom(roomId)
        room.status = RoomStatus.ENDED
        return { success: true, reason: '', data: { roomId } }
    }

    // Players
    updatePlayersExceptSelf(socket, roomId) {
        const room = this.getRoom(roomId)
        if (!room) return

        const message = {
            success: true,
            reason: '',
            data: { room },
        }
        socket.in(roomId).emit('update-players', message)
    }

    updateAllPlayers(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return

        const message = {
            success: true,
            reason: '',
            data: { room },
        }
        this._io.in(roomId).emit('update-players', message)
    }

    submitAnswer(socket, roomId, answer) {
        const room = this.getRoom(roomId)
        if (!room) return

        room.players[socket.id].currentAnswer = answer

        this.updateAllPlayers(roomId)

        const playersArray = Object.values(room.players)

        // If everyone has answered, update all players with player answers`
        if (playersArray.filter((i) => !i.currentAnswer).length === 0) {
            const answers = playersArray.reduce((acc, player) => {
                acc[player.id] = player.currentAnswer
                return acc
            }, {})

            this._io.in(roomId).emit('vote-ready', {
                success: true,
                reason: '',
                data: {
                    answers,
                },
            })
        }
    }

    submitVote(roomId, playerId) {
        const room = this.getRoom(roomId)
        if (!room) return

        if (!room.votes) room.votes = {}
        room.votes[playerId] = (room.votes[playerId] || 0) + 1
        if (!room.scores) room.scores = {}
        room.scores[playerId] = (room.scores[playerId] || 0) + 1

        const totalVotes = Object.values(room.votes).reduce(
            (acc, cur) => acc + cur,
            0
        )
        if (totalVotes === Object.keys(room.votes).length) {
            room.isGameOver = this.isGameOver(roomId)
            this._io.in(roomId).emit('round-summary-ready', {
                success: true,
                reason: '',
                data: {
                    votes: room.votes,
                },
            })
        }
    }

    startNextRound(roomId) {
        const room = this.getRoom(roomId)
        room.status = RoomStatus.PLAYING
        room.acronym = getRandomAcronym()
        room.prompt = getRandomPrompt()
        room.round += 1
        room.votes = {}
        for (const player of Object.values(room.players)) {
            player.currentAnswer = null
        }

        this.updateAllPlayers(roomId)
        this._io.in(roomId).emit('next-round-started', {
            success: true,
            reason: '',
            data: {},
        })
    }

    reviewScores(roomId) {
        const room = this.getRoom(roomId)
        const scoreArray = []
        for (const player of Object.values(room.players)) {
            scoreArray.push({
                name: player.name,
                score: room.scores[player.id] || 0,
            })
        }
        this.updateAllPlayers(roomId)

        this._io.in(roomId).emit('review-scores', {
            success: true,
            reason: '',
            data: scoreArray,
        })
    }

    isGameOver(roomId) {
        return Object.values(this.getRoom(roomId).scores).some(
            (score) => score >= SCORE_LIMIT
        )
    }

    getRoomIdByPlayerId(playerId) {
        return Object.entries(this._rooms).find(
            ([, room]) => !!room.players[playerId]
        )?.[0]
    }
}
