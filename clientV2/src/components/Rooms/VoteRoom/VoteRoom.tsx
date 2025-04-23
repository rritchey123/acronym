import { useState } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { Button } from '@/components/ui/button'
import { RoundHeader } from '../../RoundHeader'

export function VoteRoom() {
    const { answers, roomId, playerType } = useSelector(
        (state) => state.feState
    )
    const [hasVoted, setHasVoted] = useState(false)

    const submitVote = (playerId) => {
        return () => {
            socket.emit('submit-vote', { playerId, roomId })
            setHasVoted(true)
        }
    }

    return (
        <>
            <RoundHeader />

            <div className="flex justify-center">
                <div className="w-sm">
                    <div className="text-2xl text-center">
                        {hasVoted
                            ? 'Waiting for other players to finish voting'
                            : 'Vote for the best answer!'}
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {Object.entries(answers).map(([playerId, answer]) => {
                            return (
                                <Button
                                    className={`rounded border bg-primary py-1 w-[100px] text-center text-wrap`}
                                    disabled={hasVoted}
                                    onClick={submitVote(playerId)}
                                >
                                    {answer}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
