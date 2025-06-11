import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { Button } from '../../ui/button'
import { selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index'

export function RoundSummaryRoom() {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) {
        alert('Room does not exist')
        return null
    }

    const onClick = () => {
        socket.emit(
            'review-scores',
            { roomId: room.id },
            ({ success, data }) => {
                if (!success) {
                    alert(`Failed to review scores: ${JSON.stringify(data)}`)
                    return
                }
            }
        )
    }

    return (
        <>
            <RoundHeader isRoundSummary />

            {playerType === PlayerType.LEADER && (
                <div className="flex justify-center">
                    <Button className="m-4" onClick={onClick}>
                        Review game scores?
                    </Button>
                </div>
            )}

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center text-muted-foreground text-sm mb-4">
                        {playerType === PlayerType.LEADER
                            ? 'Click button to review game scores!'
                            : 'Waiting for leader to continue!'}
                    </div>

                    {Object.values(room.players).map((p) => {
                        const voteCount = room.votes[p.id] || 0
                        const answer = room.answers[p.id] || 'No answer :/'

                        return (
                            <div
                                key={p.id}
                                className="rounded-lg border border-border p-4 bg-card space-y-2"
                            >
                                {/* Player name */}
                                <div className="text-sm font-medium text-muted-foreground truncate">
                                    {p.name}
                                </div>

                                {/* Answer */}
                                <div className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words">
                                    {answer}
                                </div>

                                {/* Vote count */}
                                <div className="text-xs text-right text-muted-foreground">
                                    {voteCount} vote{voteCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
