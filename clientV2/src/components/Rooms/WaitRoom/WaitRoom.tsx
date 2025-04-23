import { useSelector } from 'react-redux'
import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { Button } from '@/components/ui/button'
import { PlayersContainer } from '@/components/PlayersContainer'

export function WaitRoom() {
    const { roomId, playerType, players } = useSelector(
        (state) => state.feState
    )

    function startGame() {
        socket.emit('start-game', { roomId })
    }
    return (
        <>
            <div>
                <LeaveRoomButton />
                {playerType === 'leader' && (
                    <Button className="mt-4 ml-2" onClick={startGame}>
                        Start Game
                    </Button>
                )}
            </div>
            <div className="flex justify-center">
                <div className="w-sm">
                    <div className="text-center text-2xl mt-4">
                        Waiting on leader to start the game...
                    </div>
                    <div className="text-center text-2xl">
                        Room code: {roomId}
                    </div>

                    <div className="text-center text-2xl my-4">PLAYERS</div>
                    <PlayersContainer players={players} />
                </div>
            </div>
        </>
    )
}
