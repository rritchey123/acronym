import { Player, Room, RoomStatus, SuggestionType } from '@shared/index'
import { getRandomAcronymFromDb, getRandomPromptFromDb } from './Database.js'
import { generateId } from '../utils.js'
import { PREFER_USER_SUGGESTION_WEIGHT } from '../constants.js'

const SCORE_LIMIT = 5

const DEFAULT_ROOM = {
    status: RoomStatus.WAITING,
    acronym: null,
    prompt: null,
    isGameOver: false,
    round: 1,
    answers: {},
    votes: {},
    players: {},
    scores: {},
    acronymSuggestions: [],
    promptSuggestions: [],
}

export default class RoomTrackerService {
    private _rooms: { [roomId: string]: Room }
    private _io: any
    constructor({ io }) {
        this._rooms = {}
        this._io = io
    }
    getRoom(roomId): Room | undefined {
        return this._rooms[roomId]
    }
    deleteRoom(roomId): void {
        delete this._rooms[roomId]
    }

    createRoom({ defaultRoundDuration }) {
        let id = generateId()
        // In case id already exists
        while (this._rooms[id]) {
            id = generateId()
        }

        this._rooms[id] = {
            ...structuredClone(DEFAULT_ROOM),
            id,
            defaultRoundDuration,
        }
        return id
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

        if (!room) {
            throw new Error(`Room ${roomId} does not exist.`)
        }

        if (room.status !== RoomStatus.WAITING) {
            throw new Error(`Room ${roomId} has already started.`)
        }

        if (room.players[playerId]) {
            throw new Error(`Player with id ${playerId} already in room.`)
        }

        if (Object.values(room.players).find((i) => i.name === playerName)) {
            throw new Error(`Player with name ${playerName} already in room.`)
        }

        room.players[playerId] = {
            id: playerId,
            name: playerName,
            type: playerType,
        }

        socket.join(roomId)

        this.updateAllPlayers(roomId)
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

        if (!room) {
            throw new Error(`Room ${roomId} does not exist.`)
        }

        if (!room.players[playerId]) {
            throw new Error(`Player with id ${playerId} does not exist.`)
        }

        delete room.players[playerId]

        if (Object.keys(room.players).length === 0) this.deleteRoom(roomId)

        this.updateAllPlayers(roomId)
    }

    // Game operation
    startGame(roomId) {
        const room = this.getRoom(roomId)
        this.newRound(room)
        room.round = 1
        this.updateAllPlayers(roomId)
    }

    // Players
    updatePlayersExceptSelf(socket, roomId) {
        const room = this.getRoom(roomId)
        if (!room) return
        socket.in(roomId).emit('update-players', room)
    }

    updateAllPlayers(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return
        this._io.in(roomId).emit('update-players', room)
    }

    submitAnswer(socket, roomId, answer) {
        const room = this.getRoom(roomId)
        if (!room) return

        room.answers[socket.id] = answer

        const numAnswers = Object.keys(room.answers).length
        const numPlayers = Object.keys(room.players).length
        // If everyone has answered, update all players with player answers`
        if (numAnswers === numPlayers) {
            room.status = RoomStatus.VOTING
        }
        this.updateAllPlayers(roomId)
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
        const totalPlayers = Object.keys(room.players).length
        if (totalVotes === totalPlayers) {
            room.isGameOver = this.isGameOver(roomId)
            room.status = RoomStatus.REVIEWING_ROUND_SUMMARY
        }

        this.updateAllPlayers(roomId)
    }

    startNextRound(roomId) {
        const room = this.getRoom(roomId)
        this.newRound(room)
        room.round += 1
        this.updateAllPlayers(roomId)
    }

    newRound(room) {
        room.status = RoomStatus.PLAYING
        room.acronym = this.getRandomAcronym(room)
        room.prompt = this.getRandomPrompt(room)
        room.roundStartTime = new Date().toISOString()
        room.roundDuration = room.defaultRoundDuration
        room.votes = {}
        room.answers = {}
    }

    reviewScores(roomId) {
        const room = this.getRoom(roomId)
        room.status = RoomStatus.REVIEWING_SCORE_SUMMARY
        this.updateAllPlayers(roomId)
    }

    isGameOver(roomId) {
        return Object.values(this.getRoom(roomId).scores).some(
            (score) => score >= SCORE_LIMIT
        )
    }

    playerDisconnected(socket) {
        const roomId = Object.entries(this._rooms).find(
            ([, room]) => !!room.players[socket.id]
        )?.[0]
        if (!roomId) return
        this.leaveRoom({ roomId, socket, onDisconnect: true })
        this.updateAllPlayers(roomId)
    }

    handleSuggestion(roomId, suggestionType, suggestion) {
        if (suggestionType === SuggestionType.ACRONYM) {
            this.getRoom(roomId).acronymSuggestions.push(suggestion)
            console.log(this.getRoom(roomId).acronymSuggestions)
        } else if (suggestionType === SuggestionType.PROMPT) {
            this.getRoom(roomId).promptSuggestions.push(suggestion)
            console.log(this.getRoom(roomId).promptSuggestions)
        } else {
            throw new Error(`Invalid suggestion type ${suggestionType}`)
        }
    }

    getRandomAcronym(room: Room) {
        if (
            room.acronymSuggestions.length &&
            Math.random() < PREFER_USER_SUGGESTION_WEIGHT
        ) {
            const index = Math.floor(
                Math.random() * room.acronymSuggestions.length
            )
            return room.acronymSuggestions.splice(index, 1)
        } else {
            return getRandomAcronymFromDb()
        }
    }

    getRandomPrompt(room: Room) {
        if (
            room.promptSuggestions.length &&
            Math.random() < PREFER_USER_SUGGESTION_WEIGHT
        ) {
            const index = Math.floor(
                Math.random() * room.promptSuggestions.length
            )
            return room.promptSuggestions.splice(index, 1)
        } else {
            return getRandomAcronymFromDb()
        }
    }
}
