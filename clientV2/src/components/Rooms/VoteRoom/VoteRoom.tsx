import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { getConnectedPlayers, shuffleArray } from '@/components/utils.ts'
import { PlayerType } from '@shared/index.ts'
import { LeaveRoomButton } from '@/components/Buttons/LeaveRoomButton/LeaveRoomButton.tsx'

export function VoteRoom() {
    const [hasVoted, setHasVoted] = useState(false)
    const feState = useSelector(selectFeState)
    const room = feState.room!
    const playerType = feState.playerType
    const playerId = feState.playerId

    const shuffledIds = useMemo(() => {
        const connectedPlayerIdsExceptSelf = getConnectedPlayers(room)
            .filter((p) => p.id !== playerId)
            .map((p) => p.id)
        console.log(connectedPlayerIdsExceptSelf)
        console.log(Object.keys(room.answers))
        return shuffleArray(Object.keys(room.answers)).filter((pId) =>
            connectedPlayerIdsExceptSelf.includes(pId)
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
    const numAnswers = Object.keys(room.answers).length
    console.log(shuffledIds)
    const isOnlyPersonToVote = numAnswers > 0 && !shuffledIds.length

    return (
        <>
            <RoundHeader />
            <LeaveRoomButton />

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Instruction or Waiting Message */}

                    <div className="flex flex-col gap-3 text-center">
                        {playerType === PlayerType.LEADER && !numAnswers && (
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
                                    Vote for the best answer!
                                </div>
                            )}
                        </div>

                        {isOnlyPersonToVote
                            ? 'You are the only person to vote. Wait for others to vote...'
                            : shuffledIds.length
                            ? shuffledIds.map((playerId: string) => (
                                  <Button
                                      key={playerId}
                                      onClick={submitVote(playerId)}
                                      disabled={hasVoted}
                                      className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words"
                                  >
                                      {room.answers[playerId]}
                                  </Button>
                              ))
                            : 'No one answered! Wait for leader to continue...'}
                    </div>
                </div>
            </div>
        </>
    )
}
