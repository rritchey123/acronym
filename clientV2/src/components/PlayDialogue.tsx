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
import { errorToast, warningToast } from '@/lib/utils.ts'

const PLAYER_NAME_MAX_LENGTH = 25

/**
 * A dialog for creating a room or joining a room with a given room id.
 *
 * The dialog has two main sections:
 * - A player name input field, with a "Create Room" button that creates a new room when clicked.
 * - A room code input field, with a "Join Room" button that joins an existing room when clicked.
 *
 * The dialog also has a "Play" button that toggles the visibility of the dialog.
 *
 * The dialog is displayed when the user clicks the "Play" button in the navigation bar.
 */
export function PlayDialogue() {
    const [playerName, setPlayerName] = useState('')
    const [roomId, setRoomId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()
    function createRoom(event: any) {
        event.preventDefault()
        if (!playerName) {
            warningToast('Please enter a name')
            return
        }

        setIsLoading(true)

        socket.emit('create-room', ({ success, data }) => {
            if (!success) {
                errorToast(`Failed to create room: ${JSON.stringify(data)}`)
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
                        errorToast(
                            `Failed to join room: ${JSON.stringify(data)}`
                        )
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
            warningToast('Please enter a name')
            setIsLoading(false)
            return
        }
        if (!roomId) {
            warningToast('Please enter a room ID')
            setIsLoading(false)
            return
        }

        socket.emit(
            'join-room',
            {
                playerName,
                roomId: roomId.toLocaleLowerCase(),
                playerType: PlayerType.NORMAL,
            },
            ({ success, data }) => {
                if (!success) {
                    errorToast(`Failed to join room: ${JSON.stringify(data)}`)
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
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (value.length <= PLAYER_NAME_MAX_LENGTH)
                                        setPlayerName(value)
                                }}
                                className="text-foreground"
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {playerName.length} / {PLAYER_NAME_MAX_LENGTH}
                            </div>
                            <Button
                                onClick={createRoom}
                                // disabled={isLoading || !playerName}
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
