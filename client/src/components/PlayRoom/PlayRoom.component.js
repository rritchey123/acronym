import React from 'react';

import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useSelector, useDispatch } from 'react-redux';

import socket from '../../socket';

export function PlayRoom() {
    const { roomId, playerType } = useSelector((state) => state.feState)
    const { connected } = useSelector((state) => state.connectionState)

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
            <DebugDetails roomName='Play Room'></DebugDetails>
            <button type="button" onClick={leaveRoom} >Leave Room</button>
        </div>
    );
}