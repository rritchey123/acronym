import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { PlayerCard } from '../../Cards/Player/PlayerCard'
import { Button } from '../../ui/button'
import { selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index'
export const ScoreReviewRoom = () => {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) {
        alert('Room does not exist')
        return null
    }
    const onNextRountButtonClick = () => {
        socket.emit(
            'start-next-round',
            { roomId: room.id },
            ({ success, data }) => {
                if (!success) {
                    alert(`Failed to start next round: ${JSON.stringify(data)}`)
                    return
                }
            }
        )
    }

    return (
        <>
            {room.isGameOver && (
                <>
                    <h1>GAME OVER</h1>
                </>
            )}
            {!room.isGameOver && playerType === PlayerType.LEADER && (
                <Button className="m-4" onClick={onNextRountButtonClick}>
                    Next round
                </Button>
            )}
            {room.isGameOver && (
                <LeaveRoomButton buttonText="back to home page" />
            )}
            <div className="flex justify-center">
                <div className="w-sm text-center flex-col">
                    <div className="mb-8 text-2xl text-center">
                        Waiting for leader to continue!
                    </div>
                    {Object.entries(room.scores).map(([playerId, score]) => {
                        const { name } = room.players[playerId]
                        return (
                            <div
                                key={playerId}
                                className="flex gap-2 items-center justify-around my-2"
                            >
                                <PlayerCard playerName={name} />
                                <div className='w-20 className="text-3xl text-center"'>{`${score} vote${
                                    score !== 1 ? 's' : ''
                                }`}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
