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
                    <Button className="mb-4 w-40">Play</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px] space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Play
                        </DialogTitle>
                        <DialogDescription>
                            Enter your player name, then create or join a game
                            with a room code.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={joinRoom} className="space-y-4">
                        {/* Player Name */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter player name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="text-foreground"
                            />
                            <Button
                                onClick={createRoom}
                                disabled={isLoading || !playerName}
                                className="w-full"
                                type="button"
                            >
                                Create Room
                            </Button>
                        </div>

                        {/* Room Code */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter room code"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="text-foreground"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !playerName || !roomId}
                                className="w-full"
                            >
                                Join Room
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
