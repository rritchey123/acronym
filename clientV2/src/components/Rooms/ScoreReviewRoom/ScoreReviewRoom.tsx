import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { Button } from '../../ui/button'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index'
import { RoundHeader } from '@/components/RoundHeader.tsx'
export const ScoreReviewRoom = () => {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) {
        errorToast('Room does not exist')
        return null
    }
    const onNextRountButtonClick = () => {
        socket.emit(
            'start-next-round',
            { roomId: room.id },
            ({ success, data }) => {
                if (!success) {
                    errorToast(
                        `Failed to start next round: ${JSON.stringify(data)}`
                    )
                    return
                }
            }
        )
    }

    const waitingPropmpt =
        playerType === PlayerType.LEADER
            ? 'Click button to start next round!'
            : 'Waiting for leader to continue!'

    return (
        <>
            <RoundHeader isGameSummary />

            {!room.isGameOver && playerType === PlayerType.LEADER && (
                <div className="flex justify-center">
                    <Button className="m-4" onClick={onNextRountButtonClick}>
                        Next round
                    </Button>
                </div>
            )}

            {room.isGameOver && <div className="flex justify-center m-4"></div>}
            <LeaveRoomButton
                buttonText={room.isGameOver ? 'Back to home' : undefined}
            />

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center text-muted-foreground text-sm mb-4">
                        {room.isGameOver ? 'Game over!' : waitingPropmpt}
                    </div>

                    {room.players.map(({ name, id: playerId }) => {
                        const score = room.scores[playerId] || 0

                        return (
                            <div
                                key={playerId}
                                className="flex items-center justify-between border border-border rounded-lg bg-card px-4 py-3"
                            >
                                <div className="text-sm font-medium text-muted-foreground truncate max-w-[70%]">
                                    {name}
                                </div>
                                <div className="text-sm text-primary font-semibold">
                                    {score} vote{score !== 1 ? 's' : ''}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
