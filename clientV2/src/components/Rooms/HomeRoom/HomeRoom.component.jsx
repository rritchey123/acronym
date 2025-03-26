import { useState } from 'react'
import socket from '../../../socket'
import { useDispatch } from 'react-redux'
import {
    setRoomId,
    setRoomName,
    setPlayerType,
    setPlayers,
} from '../../../redux/feState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HomeRoom() {
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
        <div className="mt-8 flex flex-col justify-center items-center">
            <p className="text-foreground text-4xl">text-foreground</p>
            {/* <p className="text-primary-foreground text-4xl">
                text-primary-foreground
            </p>
            <p className="text-secondary-foreground text-4xl">
                text-secondary-foreground
            </p>
            <p className="text-accent-foreground text-4xl">
                text-accent-foreground
            </p>
            <p className="text-destructive-foreground text-4xl">
                text-destructive-foreground
            </p> */}
            <form onSubmit={joinRoom}>
                <Input
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter a player name"
                />
                <div></div>
                <Button type="button" onClick={createRoom} disabled={isLoading}>
                    Create Room
                </Button>
                <p className="text-foreground text-2xl">or</p>
                <Button type="submit" onClick={joinRoom} disabled={isLoading}>
                    Join Room
                </Button>
                <div></div>
                <Input
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="Enter a room ID"
                />
            </form>
        </div>
    )
}
