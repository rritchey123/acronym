import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import socket from '../../../socket.ts'
import { RoundHeader } from '../../RoundHeader'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { PlayerType } from '@shared/index.ts'
import { LeaveRoomButton } from '@/components/Buttons/LeaveRoomButton/LeaveRoomButton.tsx'
import { ReduxState } from '@/redux/feState.ts'

const REVEAL_DELAY_MS = 2500

export function VoteRoom() {
    const [hasVoted, setHasVoted] = useState(false)
    const [revealedIndex, setRevealedIndex] = useState(0)

    const acronym = useSelector(
        (s: ReduxState) => selectFeState(s).room!.acronym
    )
    const prompt = useSelector((s: ReduxState) => selectFeState(s).room!.prompt)
    const playerType = useSelector(
        (s: ReduxState) => selectFeState(s).playerType
    )
    const currentPlayerId = useSelector(
        (s: ReduxState) => selectFeState(s).playerId
    )
    const roomId = useSelector((s: ReduxState) => selectFeState(s).room!.id)

    const answers = useSelector(
        (s: ReduxState) => selectFeState(s).room!.answers
    )

    const intervalRef = useRef<number | null>(null)

    // Start/advance the reveal timer whenever answers change
    useEffect(() => {
        if (!answers.length) return
        // reset when the answer list changes
        setRevealedIndex(1)

        // then reveal the rest every REVEAL_DELAY_MS
        intervalRef.current = window.setInterval(() => {
            setRevealedIndex((c) => {
                const next = c + 1
                if (next >= answers.length) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current)
                        intervalRef.current = null
                    }
                }
                return next
            })
        }, REVEAL_DELAY_MS)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [answers])

    const submitVote = (playerId: string) => () => {
        // guard: don’t let someone vote before the button is revealed
        if (
            revealedIndex < answers.length &&
            !answers
                .slice(0, revealedIndex)
                .some((a) => a.playerId === playerId)
        ) {
            return
        }

        setHasVoted(true)
        socket.emit(
            'submit-vote',
            { playerId, roomId },
            ({ success, data }) => {
                if (!success) {
                    errorToast(`Failed to submit vote: ${JSON.stringify(data)}`)
                }
            }
        )
    }

    const reviewScores = () => {
        socket.emit('review-round-scores', { roomId }, ({ success, data }) => {
            if (!success) {
                errorToast(
                    `Failed to navigate to review round scores: ${JSON.stringify(
                        data
                    )}`
                )
            }
        })
    }

    // animation variants: start huge/above, fall/settle into place with a spring
    const itemVariants: any = {
        hidden: { opacity: 0, y: -120, scale: 2.2, filter: 'blur(8px)' },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 260, damping: 20 },
        },
    }

    return (
        <>
            <RoundHeader />
            <LeaveRoomButton />

            <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Leader control if no answers */}
                    <div className="flex flex-col gap-3 text-center">
                        {playerType === PlayerType.LEADER &&
                            !answers.length && (
                                <Button onClick={reviewScores}>
                                    Review Scores
                                </Button>
                            )}

                        {/* Acronym */}
                        <div className="text-center space-y-1">
                            <div className="text-sm uppercase text-muted-foreground tracking-wider">
                                Acronym
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {acronym}
                            </div>
                        </div>

                        {/* Prompt */}
                        <div className="text-center space-y-1">
                            <div className="text-sm uppercase text-muted-foreground tracking-wider">
                                Prompt
                            </div>
                            <div className="text-2xl font-semibold text-white break-words">
                                {prompt}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="text-center text-xl font-semibold text-white">
                            {hasVoted ? (
                                <div className="flex justify-center items-center gap-1 text-muted-foreground text-sm">
                                    Waiting for other players to finish voting{' '}
                                    <span className="dot-anim" />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center gap-1 text-muted-foreground text-sm">
                                    Vote for the best answer! You can't vote for
                                    yourself...
                                </div>
                            )}
                        </div>

                        {/* Answers with staged reveal + animation */}
                        {answers.length ? (
                            <AnimatePresence>
                                {answers
                                    .slice(0, revealedIndex)
                                    .map(({ playerId, answer }) => {
                                        const isMine =
                                            playerId === currentPlayerId
                                        const disabled = hasVoted || isMine

                                        return (
                                            <motion.div
                                                key={playerId}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="show"
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                layout
                                            >
                                                <Button
                                                    asChild
                                                    disabled={disabled}
                                                    className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm break-words w-full"
                                                >
                                                    <motion.button
                                                        whileHover={
                                                            !disabled
                                                                ? {
                                                                      scale: 1.02,
                                                                  }
                                                                : undefined
                                                        }
                                                        whileTap={
                                                            !disabled
                                                                ? {
                                                                      scale: 0.98,
                                                                  }
                                                                : undefined
                                                        }
                                                        onClick={submitVote(
                                                            playerId
                                                        )}
                                                    >
                                                        {answer}
                                                    </motion.button>
                                                </Button>
                                            </motion.div>
                                        )
                                    })}
                            </AnimatePresence>
                        ) : (
                            'No one answered! Wait for leader to continue...'
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
