import { useEffect } from 'react'
import socket, { AcronaymClientSocket } from './socket.ts'

import { setConnectionState } from './redux/connectionState'
import {
    setRoom,
    ReduxState,
    setPlayerType,
    setPlayerId,
} from './redux/feState'

import { useSelector, useDispatch } from 'react-redux'
import { PlayerType, Room } from '@shared/index'
import { getRoom } from './components/Rooms/index.tsx'
import {
    SESSION_STORAGE_PLAYER_ID_KEY,
    SESSION_STORAGE_PLAYER_TYPE_KEY,
    SESSION_STORAGE_ROOM_ID_KEY,
} from '../../shared/constants.ts'

export default function App() {
    const { room } = useSelector((state: ReduxState) => state.feState)
    const status = room?.status || null
    const dispatch = useDispatch()

    const handleReconnect = async (socket: AcronaymClientSocket) => {
        console.log('Attempting to reconnect...')
        const playerId = sessionStorage.getItem(SESSION_STORAGE_PLAYER_ID_KEY)
        const roomId = sessionStorage.getItem(SESSION_STORAGE_ROOM_ID_KEY)
        if (playerId && roomId) {
            socket.emit(
                'reconnect',
                { playerId, roomId },
                ({ success, data }) => {
                    if (!success) {
                        console.log('Error while reconnecting:', data)
                        sessionStorage.removeItem(SESSION_STORAGE_PLAYER_ID_KEY)
                        sessionStorage.removeItem(
                            SESSION_STORAGE_PLAYER_TYPE_KEY
                        )
                        sessionStorage.removeItem(SESSION_STORAGE_ROOM_ID_KEY)
                        dispatch(setPlayerType(PlayerType.NORMAL))
                    } else {
                        console.log(`${playerId} reconnected to room ${roomId}`)
                        dispatch(
                            setPlayerType(
                                sessionStorage.getItem(
                                    SESSION_STORAGE_PLAYER_TYPE_KEY
                                )
                            )
                        )
                        dispatch(
                            setPlayerId(
                                sessionStorage.getItem(
                                    SESSION_STORAGE_PLAYER_ID_KEY
                                )
                            )
                        )
                    }
                }
            )
        } else {
            sessionStorage.removeItem(SESSION_STORAGE_PLAYER_ID_KEY)
            sessionStorage.removeItem(SESSION_STORAGE_PLAYER_TYPE_KEY)
            sessionStorage.removeItem(SESSION_STORAGE_ROOM_ID_KEY)
        }
    }

    useEffect(() => {
        function onConnect(socket: AcronaymClientSocket) {
            console.log('Connected to server!!!')
            handleReconnect(socket)
            dispatch(setConnectionState(true))
        }

        function onDisconnect() {
            dispatch(setConnectionState(false))
        }

        function updatePlayers(payload: Room) {
            console.log(payload.players)
            dispatch(setRoom(payload))
        }

        socket.on('connect', () => {
            onConnect(socket)
        })
        socket.on('disconnect', onDisconnect)
        socket.on('update-players', updatePlayers)

        return () => {
            socket.off('connect', () => {
                onConnect(socket)
            })
            socket.off('disconnect', onDisconnect)
            socket.off('update-players', updatePlayers)
        }
    }, [dispatch])

    return (
        <div className="pt-16 bg-background h-screen">
            {/* <DebugDetails /> */}
            {getRoom(status)}
        </div>
    )
}
