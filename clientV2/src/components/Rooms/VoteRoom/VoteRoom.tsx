import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { shuffleArray } from '@/components/utils.ts'

export function VoteRoom() {
    const [hasVoted, setHasVoted] = useState(false)
    const feState = useSelector(selectFeState)
    const room = feState.room!

    const shuffledIds = useMemo(() => {
        return shuffleArray(Object.keys(room.answers)).filter(
            (playerId) => playerId !== socket.id
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room.round])

    const submitVote = (playerId: string) => {
        return () => {
            setHasVoted(true)
            socket.emit(
                'submit-vote',
                { playerId, roomId: room.id },
                ({ success, data }) => {
                    if (!success) {
                        errorToast(
                            `Failed to submit vote: ${JSON.stringify(data)}`
                        )
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

                    <div className="flex flex-col gap-3">
                        {shuffledIds.map((playerId: string) => (
                            <Button
                                key={playerId}
                                onClick={submitVote(playerId)}
                                disabled={hasVoted}
                                className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words"
                            >
                                {room.answers[playerId]}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
