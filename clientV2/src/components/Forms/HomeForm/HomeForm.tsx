import React, { useState } from 'react'
import socket from '../../../socket.ts'
import {
    setRoomId,
    setRoomName,
    setPlayerType,
    setPlayers,
} from '../../../redux/feState'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'

export function HomeForm() {
    const [playerName, setPlayerName] = useState('')
    const [roomId, setRoomIdInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    function createRoom(event) {
        event.preventDefault()
        if (!playerName) {
            alert('Please enter a player name')
            return
        }
        //setIsLoading(true);

        socket.emit('create-room', ({ success, reason, data }) => {
            const { roomId } = data

            socket.emit(
                'join-room',
                { roomId, playerName, playerType: 'leader' },
                ({ success, reason, data }) => {
                    if (!success) {
                        alert(reason)
                        return
                    }
                    const { players } = data
                    dispatch(setRoomId(roomId))
                    dispatch(setRoomName('waitRoom'))
                    dispatch(setPlayerType('leader'))
                    dispatch(setPlayers(players))
                }
            )
            // setIsLoading(false);
        })
        return
    }

    function joinRoom(event) {
        event.preventDefault()
        if (!playerName) {
            alert('Please enter a name')
            return
        }
        if (!roomId) {
            alert('Please enter a room ID')
            return
        }
        //setIsLoading(true);

        socket.emit(
            'join-room',
            { playerName, roomId, playerType: 'player' },
            ({ success, reason, data }) => {
                if (!success) {
                    alert(reason)
                    return
                }
                const { players } = data
                dispatch(setRoomId(roomId))
                dispatch(setRoomName('waitRoom'))
                dispatch(setPlayerType('player'))
                dispatch(setPlayers(players))
                // setIsLoading(false);
            }
        )
    }

    return (
        <form onSubmit={joinRoom}>
            <input
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter a player name"
            />
            <div></div>
            <Button type="button" onClick={createRoom} disabled={isLoading}>
                Create Room
            </Button>
            <button type="submit" onClick={joinRoom} disabled={isLoading}>
                Join Room
            </button>
            <div></div>
            <input
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Enter a room ID"
            />
        </form>
    )
}
