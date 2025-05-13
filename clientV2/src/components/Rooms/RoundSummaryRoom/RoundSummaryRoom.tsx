import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { Button } from '../../ui/button'
import { PlayerCard } from '../../Cards/Player/PlayerCard'
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
                <Button className="m-4" onClick={onClick}>
                    Review game scores?
                </Button>
            )}
            <div className="flex justify-center">
                <div className="w-sm text-center flex-col">
                    <div className="mb-8 text-md text-center">
                        Waiting for leader to continue!
                    </div>
                    {Object.values(room.players).map((p) => {
                        const voteCount = room.votes[p.id] || 0
                        const answer = room.answers[p.id] || 'No answer :/'

                        return (
                            <div
                                key={p.id}
                                className="flex gap-2 items-center justify-around my-2"
                            >
                                <PlayerCard
                                    playerName={p.name}
                                    answer={answer}
                                />
                                <div
                                    className={`rounded border bg-primary py-1 min-w-[100px] text-center justify-center`}
                                >
                                    {answer}
                                </div>
                                <div className='className="text-3xl text-center"'>{`${voteCount} vote${
                                    voteCount !== 1 ? 's' : ''
                                }`}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
