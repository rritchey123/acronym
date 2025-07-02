import { ClientToServerEvents, ServerToClientEvents } from '@shared/index'
import { io, Socket } from 'socket.io-client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()

socket.on('connect', function () {
    console.log('Front end connected to backend!')
})

export default socket
