import React from 'react';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useSelector, useDispatch } from 'react-redux';

import socket from '../../socket';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';

export function WaitRoom() {
    const { roomId, playerType } = useSelector((state) => state.feState)

    const dispatch = useDispatch()

    function leaveRoom() {
        socket.emit("leave-room", { roomId }, ({ success, reason, data }) => {
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomId(""))
            dispatch(setState("home"))
            dispatch(setPlayerType(null))
        })
    }

    function startGame() {
        socket.emit("start-game", { roomId })
    }

    return (
        <div className="App">
            <DebugDetails roomName='Wait room'></DebugDetails>
            {
                playerType === "leader" && <button type="button" onClick={startGame}>Start Game</button>
            }
            <button type="button" onClick={leaveRoom} >Leave Room</button>
        </div>
    );
}