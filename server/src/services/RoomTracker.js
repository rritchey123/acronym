import { getRandomAcronym, getRandomPrompt } from './Database.js'
export default class RoomTrackerService {
    constructor() {
        this._rooms = {}
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
        console.log('ROOM TRACKER JOIN ROOM')
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

    leaveRoom(roomId, playerId) {
        console.log('ROOM TRACKER LEAVE ROOM')
        const roomDetails = this.getRoomDetails(roomId)

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
        console.log('STARTING GAME')
        const room = this.getRoomDetails(roomId)
        room.state = 'playing'
        room.acronym = getRandomAcronym()
        room.prompt = getRandomPrompt()

        this.updatePlayers(socket, roomId, true)

        return { success: true, reason: '', data: { roomId } }
    }

    endGame(roomId) {
        console.log('ENDING GAME')
        this._rooms[roomId].state = 'ended'
        return { success: true, reason: '', data: { roomId } }
    }

    // Players
    updatePlayers(socket, roomId, emitToSender = false) {
        console.log('UPDATE PLAYERS')
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

    submitAnswer(socket, roomId, answer) {
        console.log('SUBMIT ANSWER')
        const roomDetails = this.getRoomDetails(roomId)
        if (!roomDetails) return

        const playerObj = roomDetails.players.find((i) => i.id === socket.id)
        playerObj.answer = answer

        // If everyone has answered, update all players with player answers`
        if (roomDetails.players.filter((i) => !i.answer).length === 0) {
            socket.emit('vote-ready', {
                success: true,
                reason: '',
                data: {
                    answers: roomDetails.players.map(({ id, answer }) => ({
                        id,
                        answer,
                    })),
                },
            })
        }
    }
}
