import { useEffect } from 'react'
import socket from './socket.ts'

import { setConnectionState } from './redux/connectionState'
import { setRoom, ReduxState } from './redux/feState'

import { useSelector, useDispatch } from 'react-redux'
import { Room } from '@shared/index'
import { getRoom } from './components/Rooms/index.tsx'

export default function App() {
    const { room } = useSelector((state: ReduxState) => state.feState)
    const status = room?.status || null
    const dispatch = useDispatch()

    useEffect(() => {
        function onConnect() {
            dispatch(setConnectionState(true))
        }

        function onDisconnect() {
            dispatch(setConnectionState(false))
        }

        function updatePlayers(payload: Room) {
            dispatch(setRoom(payload))
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('update-players', updatePlayers)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('update-players', updatePlayers)
        }
    }, [dispatch])

    return (
        <div className="pt-16 bg-background h-screen">
            {/* <DebugDetails roomName="Home Room"></DebugDetails> */}
            {getRoom(status)}
        </div>
    )
}
