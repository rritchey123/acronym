import { Player, Room, StateValue } from '@shared/index.js'
import { getRandomAcronym, getRandomPrompt } from './Database.js'
import { generateId } from '../utils.js'

const SCORE_LIMIT = 10

const DEFAULT_ROOM = {
    players: [],
    state: {
        stateValue: StateValue.WAITING,
        acronym: null,
        prompt: null,
        votes: {},
        round: 1,
        scores: {},
        isGameOver: false,
    },
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
        const { players, state } = room
        if (state.stateValue !== StateValue.WAITING)
            return {
                success: false,
                reason: `Room ${roomId} has already started`,
                data: {},
            }

        if (players.find((i) => i.id === playerId))
            return {
                success: false,
                reason: `Player with id ${playerId} already in room.`,
            }
        if (players.find((i) => i.name === playerName))
            return {
                success: false,
                reason: `Player with name ${playerName} already in room.`,
            }

        const newPlayer = {
            id: playerId,
            name: playerName,
            type: playerType,
        }
        players.push(newPlayer)

        socket.join(roomId)

        return {
            success: true,
            reason: '',
            data: { roomId, players, ...newPlayer },
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
        const roomDetails = this.getRoom(roomId)
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
    startGame(roomId) {
        const { state } = this.getRoom(roomId)
        state.stateValue = StateValue.PLAYING
        state.acronym = getRandomAcronym()
        state.prompt = getRandomPrompt()
        state.round = 1

        this.updateAllPlayers(roomId)

        return { success: true, reason: '', data: { roomId } }
    }

    endGame(roomId) {
        const { state } = this.getRoom(roomId)
        state.stateValue = StateValue.ENDED
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

        const playerObj = room.players.find((i) => i.id === socket.id)
        playerObj.currentAnswer = answer

        const message = {
            success: true,
            reason: '',
            data: { room },
        }
        this.updateAllPlayers(roomId)

        // If everyone has answered, update all players with player answers`
        if (room.players.filter((i) => !i.currentAnswer).length === 0) {
            const answers = room.players.reduce((acc, player) => {
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
        const { state, players } = room
        if (!state.votes) state.votes = {}
        state.votes[playerId] = (state.votes[playerId] || 0) + 1
        if (!state.scores) state.scores = {}
        state.scores[playerId] = (state.scores[playerId] || 0) + 1

        const totalVotes = Object.values(state.votes).reduce(
            (acc, cur) => acc + cur,
            0
        )
        if (totalVotes === players.length) {
            state.isGameOver = this.isGameOver(roomId)
            this._io.in(roomId).emit('round-summary-ready', {
                success: true,
                reason: '',
                data: {
                    votes: state.votes,
                },
            })
        }
    }

    startNextRound(roomId) {
        const { state, players } = this.getRoom(roomId)
        state.stateValue = StateValue.PLAYING
        state.acronym = getRandomAcronym()
        state.prompt = getRandomPrompt()
        state.round += 1
        state.votes = {}
        for (const player of players) {
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
        const { state, players } = this.getRoom(roomId)
        const scoreArray = []
        for (const player of players) {
            scoreArray.push({
                name: player.name,
                score: state.scores[player.id] || 0,
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
        const { state } = this.getRoom(roomId)
        return Object.values(state.scores).some((score) => score >= SCORE_LIMIT)
    }

    getRoomIdByPlayerId(playerId) {
        return Object.entries(this._rooms).find(([, roomDetails]) =>
            roomDetails.players.some((p) => p.id === playerId)
        )?.[0]
    }
}
