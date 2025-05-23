import { useState } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { Button } from '@/components/ui/button'
import { RoundHeader } from '../../RoundHeader'
import { selectFeState } from '@/lib/utils.ts'

export function VoteRoom() {
    const [hasVoted, setHasVoted] = useState(false)
    const { room } = useSelector(selectFeState)
    if (!room) {
        alert('Room does not exist')
        return null
    }

    const submitVote = (playerId: string) => {
        return () => {
            setHasVoted(true)
            socket.emit(
                'submit-vote',
                { playerId, roomId: room.id },
                ({ success, data }) => {
                    if (!success) {
                        alert(`Failed to submit vote: ${JSON.stringify(data)}`)
                        return
                    }
                }
            )
        }
    }

    return (
        <>
            <RoundHeader />
            <div className="flex justify-center">
                <div className="w-sm">
                    <div className="text-2xl text-center mb-4">
                        {hasVoted
                            ? 'Waiting for other players to finish voting'
                            : 'Vote for the best answer!'}
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {Object.entries(room.answers).map(
                            ([playerId, answer]) => {
                                return (
                                    <Button
                                        className={`rounded border bg-primary py-1 w-[100px] text-center text-wrap`}
                                        disabled={hasVoted}
                                        onClick={submitVote(playerId)}
                                    >
                                        {answer}
                                    </Button>
                                )
                            }
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
