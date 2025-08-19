import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { Button } from '@/components/ui/button'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { EditRulesDialog } from '@/components/EditRulesDialogue.tsx'
import { InfoDialogue } from '@/components/InfoDialogue.tsx'
import { getConnectedPlayers } from '@/components/utils.ts'

export function WaitRoom() {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) return null

    function startGame() {
        if (!room) {
            errorToast('Room does not exist')
            return
        }
        socket.emit('start-game', { roomId: room!.id }, ({ success, data }) => {
            if (!success) {
                errorToast(`Failed to start game: ${JSON.stringify(data)}`)
                return
            }
        })
    }
    return (
        <>
            {/* Top Buttons */}
            <div className="mt-4 mx-4 flex justify-between items-center">
                <LeaveRoomButton />
                {playerType === 'leader' && (
                    <>
                        <EditRulesDialog />
                        <Button onClick={startGame}>Start Game</Button>
                    </>
                )}
            </div>

            {/* Main Lobby Content */}
            <div className="flex justify-center px-4 mt-6">
                <div className="w-full max-w-md space-y-8">
                    {/* Waiting Message */}
                    <div className="text-center space-y-2">
                        <div className="text-xl text-white font-semibold">
                            Waiting on leader to start the game...
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Room code:{' '}
                            <span className="font-mono text-white">
                                {room.id}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <InfoDialogue />
                    </div>
                    {/* Player List */}
                    <div className="space-y-4">
                        <div className="text-lg font-semibold text-white text-center">
                            Players
                        </div>

                        <div className="flex flex-col gap-3">
                            {getConnectedPlayers(room).map((player) => (
                                <div
                                    key={player.id}
                                    className="flex items-center justify-between border border-border bg-card rounded-lg px-4 py-3"
                                >
                                    <div className="text-sm font-medium text-muted-foreground truncate w-full">
                                        {player.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
