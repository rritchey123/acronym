import React, { useState } from 'react'
import { AnswerEntry } from '../../Forms/AnswerEntry/AnswerEntry.component'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'
import { useSelector } from 'react-redux'
import { PlayerCard } from '../../Cards/Player/PlayerCard.component'
import socket from '../../../socket'
import { Separator } from '../../ui/separator'
import { Button } from '../../ui/button'

export function PlayRoom() {
    const [hasAnswered, setHasAnswered] = useState(false)

    const { roomId, playerType, players, acronym, prompt, round } = useSelector(
        (state) => state.feState
    )
    function endGame() {
        socket.emit('end-game', { roomId })
    }

    return (
        <>
            <div>
                <h3 className="text-2xl text-center my-2">Round {round}</h3>
                <Separator className="mb-2"></Separator>
                {playerType === 'leader' && (
                    <Button className={'mr-2'} onClick={endGame}>
                        End Game
                    </Button>
                )}

                <LeaveRoomButton />
            </div>
            <div className="flex flex-col justify-center items-center">
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
                    <div className="flex flex-wrap gap-4 justify-center">
                        {players.map((p, idx) => {
                            return (
                                <PlayerCard key={idx} player={p}></PlayerCard>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
