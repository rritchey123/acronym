import React from 'react';
import { useSelector } from 'react-redux';

import socket from '../../socket';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { LeaveRoomButton } from '../LeaveRoomButton/LeaveRoomButton.component';

export function WaitRoom() {
    const { roomId, playerType } = useSelector((state) => state.feState)

    function startGame() {
        socket.emit("start-game", { roomId })
    }

    return (
        <div className="App">
            <DebugDetails roomName='Wait room'></DebugDetails>
            {
                playerType === "leader" && <button type="button" onClick={startGame}>Start Game</button>
            }
            <LeaveRoomButton></LeaveRoomButton>
        </div>
    );
}