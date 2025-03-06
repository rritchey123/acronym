import React, { useState } from 'react'

import { AnswerEntry } from '../../Forms/AnswerEntry/AnswerEntry.component'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'

import { useSelector } from 'react-redux'

import { Player } from '../../Cards/Player/Player.component'

import socket from '../../../socket'

export function PlayRoom() {
    const [hasAnswered, setHasAnswered] = useState(false)

    const { roomId, playerType, players, acronym, prompt } = useSelector(
        (state) => state.feState
    )

    function endGame() {
        socket.emit('end-game', { roomId })
    }

    return (
        <div className="App">
            {playerType === 'leader' && (
                <button type="button" onClick={endGame}>
                    End Game
                </button>
            )}

            <LeaveRoomButton />

            <div>PLAYERS</div>
            {players.map(({ name: playerName }) => {
                return <Player playerName={playerName}></Player>
            })}

            <div>ACRONYM</div>
            {acronym}
            <div>PROMPT</div>
            {prompt}

            {hasAnswered ? (
                <div>WAITING FOR OTHER PLAYERS</div>
            ) : (
                <AnswerEntry setHasAnswered={setHasAnswered}></AnswerEntry>
            )}
        </div>
    )
}
