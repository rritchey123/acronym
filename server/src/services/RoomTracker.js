class RoomTrackerService {
    constructor() {
        this._rooms = {}
    }

    static getInstance() {
        if (!this._instance) this._instance = new RoomTrackerService()
        return this._instance
    }

    // Helpers
    _generateId() {
        return (Math.random() + 1).toString(36).substring(7);
    }
    _checkIfRoomExists(roomId) {
        if (this._rooms[roomId]) throw new Error(`Room ${roomId} does not exist.`)
    }
    _checkIfPlayerExists(playerId) {

    }
    getRooms() {
        return this._rooms
    }

    // Room operations
    createRoom() {
        let id = this._generateId()
        while (this._rooms[id]) { id = this._generateI() }

        this._rooms[id] = {
            players: []
        }

        return id
    }
    getRoomDetails(roomId) {
        this._checkIfRoomExists(roomId)
        return this._rooms[roomId]
    }
    deleteRoom(roomId) {
        this._checkIfRoomExists(roomId)
        delete this._rooms[roomId]
    }

    // Player operations
    addPlayer(roomId, playerDetails) {
        const { playerId, playerName } = playerDetails
        const roomDetails = this.getRoomDetails(roomId)

        if (roomDetails.players.find((i) => i.id = playerId)) throw new Error(`Player with id ${playerId} already exists.`)
        if (roomDetails.players.find((i) => i.name = playerName)) throw new Error(`Player with name ${playerName} already exists.`)

        roomDetails.players.push({
            id: playerId, name: playerName
        })
    }

    removePlayer(roomId, playerId) {
        const roomDetails = this.getRoomDetails(roomId)

        if (!roomDetails.players.find((i) => i.id === playerid)) throw new Error(`Player with id ${playerId} does not exist.`)
        roomDetails.players = roomsDetails.players.filter((i) => i.id !== playerId)
    }
}

module.exports = RoomTrackerService