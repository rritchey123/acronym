import { useState } from 'react'
import { AnswerEntry } from '../../Forms/AnswerEntry/AnswerEntry'
import { useSelector } from 'react-redux'
import { PlayersContainer } from '../../PlayersContainer'
import { RoundHeader } from '../../RoundHeader'

export function PlayRoom() {
    const [hasAnswered, setHasAnswered] = useState(false)

    const { roomId, playerType, players, acronym, prompt, round } = useSelector(
        (state) => state.feState
    )

    return (
        <>
            <RoundHeader />
            <div className="flex justify-center items-center">
                <div className="w-sm">
                    <div className="text-2xl text-center">ACRONAYM</div>
                    <div className="text-3xl text-center">{acronym}</div>
                    <div className="text-2xl text-center">PROMPT</div>
                    <div className="text-3xl text-center">{prompt}</div>

                    {hasAnswered ? (
                        <div className="text-center">
                            WAITING FOR OTHER PLAYERS TO ANSWER
                        </div>
                    ) : (
                        <AnswerEntry
                            setHasAnswered={setHasAnswered}
                        ></AnswerEntry>
                    )}

                    <div className="text-2xl text-center">PLAYERS</div>
                    <PlayersContainer players={players} />
                </div>
            </div>
        </>
    )
}
