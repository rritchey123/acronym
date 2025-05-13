import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { PlayerCard } from '../../Cards/Player/PlayerCard'
import { Button } from '../../ui/button'
import { selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index'
import { RoundHeader } from '@/components/RoundHeader.tsx'
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
            <RoundHeader isGameSummary />
            {!room.isGameOver && playerType === PlayerType.LEADER && (
                <Button className="m-4" onClick={onNextRountButtonClick}>
                    Next round
                </Button>
            )}
            {room.isGameOver && (
                <div className="ml-2">
                    <LeaveRoomButton buttonText="back to home" />
                </div>
            )}
            <div className="flex justify-center">
                <div className="w-sm text-center flex-col">
                    {!room.isGameOver ? (
                        <div className="mb-8 text-md text-center">
                            Waiting for leader to continue!
                        </div>
                    ) : (
                        <div className="mb-8 text-md text-center">
                            Game over!
                        </div>
                    )}
                    {Object.entries(room.players).map(([playerId, player]) => {
                        const { name } = player
                        const score = room.scores[playerId] || 0
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
