import {
    Player,
    PlayerStatus,
    Room,
    RoomStatus,
    SuggestionType,
} from '../../../shared/types'
import { getRandomAcronymFromDb, getRandomPromptFromDb } from './Database'
import { generateId } from '../utils.js'
import {
    ADD_TIME_AMOUNT,
    DEFAULT_ROUND_DURATION,
    DEFAULT_SCORE_LIMIT,
    MIN_PLAYER_COUNT,
    PREFER_USER_SUGGESTION_WEIGHT,
} from '../../../shared/constants'

const DEFAULT_ROOM = {
    status: RoomStatus.WAITING,
    acronym: null,
    prompt: null,
    isGameOver: false,
    round: 1,
    answers: [],
    votes: {},
    players: [],
    scores: {},
    acronymSuggestions: [],
    promptSuggestions: [],
    defaultRoundDuration: DEFAULT_ROUND_DURATION,
    currentRoundDuration: DEFAULT_ROUND_DURATION,
    scoreLimit: DEFAULT_SCORE_LIMIT,
}

export default class RoomTrackerService {
    private _rooms: { [roomId: string]: Room }
    private _io: any
    constructor({ io }) {
        this._rooms = {}
        this._io = io
    }
    getRoom(roomId: string): Room | undefined {
        return this._rooms[roomId]
    }
    deleteRoom(roomId): void {
        const room = this.getRoom(roomId)
        this.clearNextRoundCallback(room)
        delete this._rooms[roomId]
    }

    createRoom() {
        let id = generateId()
        // In case id already exists
        while (this._rooms[id]) {
            id = generateId()
        }

        this._rooms[id] = {
            ...structuredClone(DEFAULT_ROOM),
            id,
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
        console.log('Joining room', player)
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

        if (room.players.find((i) => i.name === playerName)) {
            throw new Error(`Player with name ${playerName} already in room.`)
        }

        room.players.push({
            id: playerId,
            socketId: socket.id,
            name: playerName,
            type: playerType,
            status: PlayerStatus.CONNECTED,
        })

        socket.join(roomId)

        this.updateAllPlayers(roomId)
    }

    leaveRoom({
        socket,
        roomId,
        playerId,
    }: {
        socket: any
        roomId: string
        playerId: string
    }) {
        const room = this.getRoom(roomId)

        socket.leave(roomId)

        if (!room) {
            throw new Error(`Room ${roomId} does not exist.`)
        }

        const playerIndex = room.players.findIndex(
            (player) => player.id === playerId
        )
        if (!playerIndex) {
            throw new Error(`Player with id ${playerId} does not exist.`)
        }

        room.players.splice(playerIndex, 1)

        if (room.players.length === 0) this.deleteRoom(roomId)

        this.updateAllPlayers(roomId)
    }

    // Game operation
    startGame(roomId) {
        const room = this.getRoom(roomId)
        if (room.players.length < MIN_PLAYER_COUNT) {
            throw new Error('3 or more players are required to start the game.')
        }
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

    updateAllPlayers(roomId: string) {
        const room = this.getRoom(roomId)
        if (!room) return
        const { nextRoundCallback, ...roomWithoutCallback } = room
        this._io.in(roomId).emit('update-players', roomWithoutCallback)
    }

    submitAnswer({
        roomId,
        playerId,
        answer,
    }: {
        roomId: string
        playerId: string
        answer: string
    }) {
        const room = this.getRoom(roomId)
        if (!room) return

        room.answers.push({
            playerId,
            answer,
        })

        const numAnswers = room.answers.length
        const numConncetedPlayers = room.players.filter(
            (player) => player.status === PlayerStatus.CONNECTED
        ).length

        // If everyone has answered, update all players with player answers`
        if (numAnswers >= numConncetedPlayers) {
            // Randomize answers
            room.answers.sort(() => Math.random() - 0.5)
            this.setRoomState(roomId, RoomStatus.VOTING)
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
        const totalPlayers = room.players.filter(
            (player) => player.status === PlayerStatus.CONNECTED
        ).length
        if (
            room.answers.length === 1
                ? totalVotes === totalPlayers - 1
                : totalVotes === totalPlayers
        ) {
            room.isGameOver = this.isGameOver(roomId)
            this.setRoomState(roomId, RoomStatus.REVIEWING_ROUND_SUMMARY)
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
        this.setRoomState(room.id, RoomStatus.PLAYING)
        room.acronym = this.getRandomAcronym(room)
        room.prompt = this.getRandomPrompt(room)
        room.roundStartTime = new Date().toISOString()
        room.currentRoundDuration = room.defaultRoundDuration
        room.votes = {}
        room.answers = []
        room.nextRoundCallback = this.getNextRoundCallback(room)
    }

    reviewGameScores(roomId) {
        const room = this.getRoom(roomId)
        this.clearNextRoundCallback(room)
        room.status = RoomStatus.REVIEWING_SCORE_SUMMARY
        this.updateAllPlayers(roomId)
    }

    isGameOver(roomId) {
        const { scores, scoreLimit } = this.getRoom(roomId)
        return Object.values(scores).some((score) => score >= scoreLimit)
    }

    handleSuggestion(roomId, suggestionType, suggestion) {
        if (suggestionType === SuggestionType.ACRONYM) {
            this.getRoom(roomId).acronymSuggestions.push(suggestion)
        } else if (suggestionType === SuggestionType.PROMPT) {
            this.getRoom(roomId).promptSuggestions.push(suggestion)
        } else {
            throw new Error(`Invalid suggestion type ${suggestionType}`)
        }
        this.updateAllPlayers(roomId)
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
            return getRandomPromptFromDb()
        }
    }

    handleUpdateGameRules(roomId, roundDuration, scoreLimit) {
        const room = this.getRoom(roomId)
        room.defaultRoundDuration = roundDuration
        room.currentRoundDuration = roundDuration
        room.scoreLimit = scoreLimit
        this.updateAllPlayers(roomId)
    }

    addTime(roomId: string) {
        const room = this.getRoom(roomId)
        room.currentRoundDuration += ADD_TIME_AMOUNT
        room.nextRoundCallback = this.getNextRoundCallback(room)
        this.updateAllPlayers(roomId)
    }

    getNextRoundCallback(room: Room) {
        this.clearNextRoundCallback(room)
        return setTimeout(
            () => {
                this.setRoomState(room.id, RoomStatus.VOTING)
                this.updateAllPlayers(room.id)
            },
            room.currentRoundDuration * 1000 + 1000
        )
    }

    clearNextRoundCallback(room) {
        if (room.nextRoundCallback) {
            clearTimeout(room.nextRoundCallback)
        }
    }

    reviewRoundScores(roomId) {
        const room = this.getRoom(roomId)
        this.clearNextRoundCallback(room)
        this.setRoomState(room.id, RoomStatus.REVIEWING_ROUND_SUMMARY)
        this.updateAllPlayers(roomId)
    }

    // Always clear callback when updating room
    setRoomState(roomId, state) {
        const room = this.getRoom(roomId)
        this.clearNextRoundCallback(room)
        room.status = state
    }

    playerDisconnected(socket) {
        console.log('Disconnected: ' + socket.id)
        console.log(
            'from playerDisconnected',
            Object.values(this._rooms).map((room) => room.players)
        )
        const roomId = Object.entries(this._rooms).find(
            ([_, room]) =>
                !!room.players.find((player) => player.socketId === socket.id)
        )?.[0]
        if (!roomId) {
            console.log('No room found for disconnected player')
            return
        }

        const room = this.getRoom(roomId)
        const player = room.players.find(
            (player) => player.socketId === socket.id
        )
        player.status = PlayerStatus.DISCONNECTED

        const atLeastOneConnectedPlayer = room.players.find(
            (player) => player.status === PlayerStatus.CONNECTED
        )
        if (atLeastOneConnectedPlayer) {
            console.log('Updating all players after player disconnected')
            this.updateAllPlayers(roomId)
        } else {
            console.log('All players in room disconnected, deleting room')
            this.deleteRoom(roomId)
        }
    }

    reconnect(socket: any, playerId: string, roomId: string) {
        console.log(`Trying reconnect for ${playerId} in ${roomId}`)
        const room = this.getRoom(roomId)
        if (!room) {
            throw new Error(`Room ${roomId} does not exist.`)
        }
        const player = room.players.find((player) => player.id === playerId)

        if (!player) throw new Error(`Player not in room.`)
        console.log(player)
        if (player.status !== PlayerStatus.DISCONNECTED)
            throw new Error(`Player already connected in room.`)

        player.status = PlayerStatus.CONNECTED
        player.socketId = socket.id
        socket.join(roomId)

        this.updateAllPlayers(roomId)
    }
}
