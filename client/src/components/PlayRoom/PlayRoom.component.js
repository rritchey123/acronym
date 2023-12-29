import React, { useState } from 'react';

import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { AnswerEntry } from '../AnswerEntry/AnswerEntry.component';
import { LeaveRoomButton } from '../LeaveRoomButton/LeaveRoomButton.component';

import { useSelector } from 'react-redux';

import { Player } from '../Player/Player.component';

import socket from '../../socket';

export function PlayRoom() {
    const [hasAnswered, setHasAnswered] = useState(false)

    const { roomId, playerType, players, acronym, prompt } = useSelector((state) => state.feState)

    function endGame() {
        socket.emit("end-game", { roomId })
    }

    return (
        <div className="App">
            <DebugDetails roomName='Play Room'></DebugDetails>
            {
                playerType === "leader" && <button type="button" onClick={endGame}>End Game</button>
            }

            <LeaveRoomButton></LeaveRoomButton>

            <div>PLAYERS</div>
            {players.map(({ name: playerName }) => {
                return <Player playerName={playerName}></Player>
            })}

            <div>ACRONYM</div>
            {acronym}
            <div>PROMPT</div>
            {prompt}

            {
                hasAnswered ? <div>WAITING FOR OTHER PLAYERS</div> : <AnswerEntry setHasAnswered={setHasAnswered}></AnswerEntry>
            }

        </div>
    );
}