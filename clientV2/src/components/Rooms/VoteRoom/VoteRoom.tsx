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

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Instruction or Waiting Message */}
                    <div className="text-center text-xl font-semibold text-white">
                        {hasVoted ? (
                            <div className="flex justify-center items-center gap-1 text-muted-foreground text-sm">
                                Waiting for other players to finish voting
                                <span className="dot-anim" />
                            </div>
                        ) : (
                            'Vote for the best answer!'
                        )}
                    </div>

                    {/* Answer Options */}
                    <div className="flex flex-col gap-3">
                        {Object.entries(room.answers).map(
                            ([playerId, answer]) => (
                                <Button
                                    key={playerId}
                                    onClick={submitVote(playerId)}
                                    disabled={hasVoted}
                                    className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words"
                                >
                                    {answer}
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
