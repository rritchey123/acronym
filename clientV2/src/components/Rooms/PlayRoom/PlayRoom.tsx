import { useState } from 'react'
import { AnswerEntry } from '../../Forms/AnswerEntry/AnswerEntry'
import { useSelector } from 'react-redux'
import { RoundHeader } from '../../RoundHeader'
import { selectFeState } from '@/lib/utils'
import { CountdownTimer } from '@/components/CountdownTimer'

export function PlayRoom() {
    const [hasAnswered, setHasAnswered] = useState(false)

    const { room } = useSelector(selectFeState)
    if (!room) {
        alert('Room does not exist')
        return null
    }

    return (
        <>
            <RoundHeader />
            <div className="flex justify-center items-center">
                <div className="w-full max-w-sm mx-auto space-y-8 p-4">
                    {/* Acronym Section */}
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
                    {/* Timer */}
                    {!!room.roundStartTime && !!room.roundDuration ? (
                        <CountdownTimer
                            roundStartTime={room.roundStartTime}
                            duration={room.roundDuration}
                        />
                    ) : (
                        <>Missing roundStartTime or roundDuration</>
                    )}
                    {/* Answer Entry or Waiting */}
                    {hasAnswered ? (
                        <div className="text-center text-muted-foreground text-sm flex justify-center items-center gap-1">
                            <span>Waiting for other players to answer</span>
                            <span className="dot-anim" />
                        </div>
                    ) : (
                        <AnswerEntry setHasAnswered={setHasAnswered} />
                    )}

                    {/* Player List */}
                    <div className="space-y-2">
                        <div className="text-lg font-semibold text-white text-center">
                            Players
                        </div>
                        <div className="flex flex-col gap-2">
                            {Object.values(room.players).map((player) => {
                                const score = room.scores[player.id] || 0
                                return (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between border border-border rounded-lg bg-card px-4 py-3"
                                    >
                                        <div className="text-sm font-medium text-muted-foreground truncate max-w-[70%]">
                                            {player.name}
                                        </div>
                                        <div className="text-sm text-primary font-semibold">
                                            {score} vote{score !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
