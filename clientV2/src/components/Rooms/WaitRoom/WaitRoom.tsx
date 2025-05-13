import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { Button } from '@/components/ui/button'
import { PlayersContainer } from '@/components/PlayersContainer'
import { selectFeState } from '@/lib/utils.ts'

export function WaitRoom() {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) return null

    function startGame() {
        if (!room) {
            alert('Room does not exist')
            return
        }
        socket.emit('start-game', { roomId: room!.id }, ({ success, data }) => {
            if (!success) {
                alert(`Failed to create room: ${JSON.stringify(data)}`)
                return
            }
        })
    }
    return (
        <>
            <div className="mt-4 mx-2 flex flex-row flex-start gap-2">
                <LeaveRoomButton />
                {playerType === 'leader' && (
                    <Button onClick={startGame}>Start Game</Button>
                )}
            </div>
            <div className="flex justify-center">
                <div className="w-sm">
                    <div className="text-center text-2xl mt-4">
                        Waiting on leader to start the game...
                    </div>
                    <div className="text-center text-2xl">
                        Room code: {room.id}
                    </div>

                    <div className="text-center text-2xl my-4">PLAYERS</div>
                    <PlayersContainer players={room.players} />
                </div>
            </div>
        </>
    )
}
