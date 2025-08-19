import { ClientToServerEvents, ServerToClientEvents } from '@shared/index'
import { io, Socket } from 'socket.io-client'

export type AcronaymClientSocket = Socket<
    ServerToClientEvents,
    ClientToServerEvents
>

const socket: AcronaymClientSocket = io()

export default socket
