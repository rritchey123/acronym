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
    getRooms() {
        return this._rooms
    }

    // Room operations
    createRoom(playerName, playerId) {
        let id = this._generateId()
        while (this._rooms[id]) { id = this._generateId() }

        this._rooms[id] = {
            players: [{ name: playerName, id: playerId }]
        }

        return { success: true, reason: "", data: { roomId: id, playerId, playerName } }
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
    joinRoom(roomId, playerDetails) {
        console.log("ROOM TRACKER JOIN ROOM")
        const { playerId, playerName } = playerDetails
        const roomDetails = this.getRoomDetails(roomId)
        console.log(roomDetails)
        if (!roomDetails) return { success: false, reason: `Room ${roomId} does not exist.`, data: {} }

        if (roomDetails.players.find((i) => i.id === playerId)) return { success: false, reason: `Player with id ${playerId} already in room.` }
        if (roomDetails.players.find((i) => i.name === playerName)) return { success: false, reason: `Player with name ${playerName} already in room.` }

        roomDetails.players.push({
            id: playerId, name: playerName
        })
        return { success: true, reason: "", data: { roomId, playerId, playerName } }
    }

    leaveRoom(roomId, playerId) {
        console.log("ROOM TRACKER LEAVE ROOM")
        const roomDetails = this.getRoomDetails(roomId)

        if (!roomDetails) return { success: false, reason: `Room ${roomId} does not exist.`, data: {} }

        if (!roomDetails.players.find((i) => i.id === playerId)) return { success: false, reason: `Player with id ${playerId} does not exist.` }
        roomDetails.players = roomDetails.players.filter((i) => i.id !== playerId)


        if (roomDetails.players.length === 0) this.deleteRoom(roomId)

        return { success: true, reason: "", data: {} }
    }
}

module.exports = RoomTrackerService