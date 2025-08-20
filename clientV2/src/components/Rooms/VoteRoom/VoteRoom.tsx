import { useState } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { PlayerType } from '@shared/index.ts'
import { LeaveRoomButton } from '@/components/Buttons/LeaveRoomButton/LeaveRoomButton.tsx'

export function VoteRoom() {
    const [hasVoted, setHasVoted] = useState(false)
    const feState = useSelector(selectFeState)
    const room = feState.room!
    const playerType = feState.playerType
    const currentPlayerId = feState.playerId

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

    const reviewScores = () => {
        socket.emit(
            'review-round-scores',
            { roomId: room.id },
            ({ success, data }) => {
                if (!success) {
                    errorToast(
                        `Failed to navigate to review round scores: ${JSON.stringify(
                            data
                        )}`
                    )
                    return
                }
            }
        )
    }

    return (
        <>
            <RoundHeader />
            <LeaveRoomButton />

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Instruction or Waiting Message */}

                    <div className="flex flex-col gap-3 text-center">
                        {playerType === PlayerType.LEADER &&
                            !room.answers.length && (
                                <Button onClick={reviewScores}>
                                    Review Scores
                                </Button>
                            )}

                        <div className="text-center space-y-1">
                            <div className="text-sm uppercase text-muted-foreground tracking-wider">
                                Acronym
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {room.acronym}
                            </div>
                        </div>

                        {/* Prompt Section */}
                        <div className="text-center space-y-1">
                            <div className="text-sm uppercase text-muted-foreground tracking-wider">
                                Prompt
                            </div>
                            <div className="text-2xl font-semibold text-white break-words">
                                {room.prompt}
                            </div>
                        </div>

                        <div className="text-center text-xl font-semibold text-white">
                            {hasVoted ? (
                                <div className="flex justify-center items-center gap-1 text-muted-foreground text-sm">
                                    Waiting for other players to finish voting
                                    <span className="dot-anim" />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center gap-1 text-muted-foreground text-sm">
                                    Vote for the best answer! You can't vote for
                                    yourself...
                                </div>
                            )}
                        </div>
                        {room.answers.length
                            ? room.answers.map(({ playerId, answer }) => (
                                  <Button
                                      key={playerId}
                                      onClick={submitVote(playerId)}
                                      disabled={
                                          hasVoted ||
                                          playerId === currentPlayerId
                                      }
                                      className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words"
                                  >
                                      {answer}
                                  </Button>
                              ))
                            : 'No one answered! Wait for leader to continue...'}
                    </div>
                </div>
            </div>
        </>
    )
}
