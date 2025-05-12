import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import socket from '../socket.ts'
import { useState } from 'react'
import { PlayerType } from '@shared/index'
import { setPlayerType } from '@/redux/feState.ts'

export function PlayDialogue() {
    const [playerName, setPlayerName] = useState('')
    const [roomId, setRoomId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()
    function createRoom(event: any) {
        event.preventDefault()
        if (!playerName) {
            alert('Please enter a player name')
            return
        }

        setIsLoading(true)

        socket.emit('create-room', ({ success, data }) => {
            if (!success) {
                alert(`Failed to create room: ${JSON.stringify(data)}`)
                setIsLoading(false)
                return
            }
            socket.emit(
                'join-room',
                {
                    roomId: data.roomId,
                    playerName,
                    playerType: PlayerType.LEADER,
                },
                ({ success, data }) => {
                    if (!success) {
                        alert(`Failed to join room: ${JSON.stringify(data)}`)
                    } else {
                        dispatch(setPlayerType(PlayerType.LEADER))
                    }

                    setIsLoading(false)
                }
            )
        })
    }

    function joinRoom(event: any) {
        event.preventDefault()
        setIsLoading(true)
        if (!playerName) {
            alert('Please enter a name')
            setIsLoading(false)
            return
        }
        if (!roomId) {
            alert('Please enter a room ID')
            setIsLoading(false)
            return
        }

        socket.emit(
            'join-room',
            { playerName, roomId, playerType: PlayerType.NORMAL },
            ({ success, data }) => {
                if (!success) {
                    alert(`Failed to join room: ${JSON.stringify(data)}`)
                }
                setIsLoading(false)
            }
        )
    }
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4 w-20">Play</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Play</DialogTitle>
                        <DialogDescription>
                            Enter a player name. Create a new room or join a
                            game with a room code.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="flex flex-col justify-around gap-8"
                        onSubmit={joinRoom}
                    >
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
                        <div>
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
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter a room ID"
                            />
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
