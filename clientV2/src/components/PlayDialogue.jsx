import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from './ThemeProvider'
import { useDispatch } from 'react-redux'
import socket from '../socket'
import { useState } from 'react'
import {
    setRoomId,
    setRoomName,
    setPlayerType,
    setPlayers,
} from '../redux/feState'

export function PlayDialogue() {
    const { theme } = useTheme()
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
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4">Play</Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[425px]"
                    dataTheme={`${theme.color}-${theme.mode}`}
                >
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={joinRoom}>
                        <Input
                            className="mb-1 text-foreground"
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter a player name"
                        />
                        <Button
                            className="w-full"
                            type="button"
                            onClick={createRoom}
                            disabled={isLoading}
                        >
                            Create Room
                        </Button>
                        <p className="text-foreground text-2xl text-center mb-1">
                            or
                        </p>
                        <Button
                            className="w-full mb-1"
                            type="submit"
                            onClick={joinRoom}
                            disabled={isLoading}
                        >
                            Join Room
                        </Button>
                        <Input
                            className="mb-1 text-foreground"
                            onChange={(e) => setRoomIdInput(e.target.value)}
                            placeholder="Enter a room ID"
                        />
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
