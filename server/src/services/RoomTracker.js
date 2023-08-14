class RoomTrackerService {
    constructor() {
        this._rooms = {}
    }

    static getInstance() {
        if (!this._instance) this._instance = new RoomTrackerService()
        return this._instance
    }

    _generateId() {
        return (Math.random() + 1).toString(36).substring(7);
    }

    getRooms() {
        return this._rooms
    }

    createRoom() {
        let id = this._generateId()
        while (this._rooms[id]) { id = this._generateI() }

        this._rooms[id] = {
            players: []
        }

        return id
    }

    getRoomDetails(roomId) {
        if (this._rooms[roomId]) throw new Error(`Room ${roomId} does not exist.`)
        return this._rooms[roomId]
    }

    deleteRoom(roomId) {
        this.getRoomDetails(roomId)
        delete this._rooms[roomId]
    }

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
        const roomDetials = this.getRoomDetails(roomId)

        if (!roomDetails.players.find((i) => i.id === playerid)) throw new Error(`Player with id ${playerId} does not exist.`)
        roomDetails.players = roomsDetails.players.filter((i) => i.id !== playerId)
    }
}

module.exports = RoomTrackerService