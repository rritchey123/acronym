import React from 'react';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useSelector, useDispatch } from 'react-redux';

import socket from '../../socket';





export function EndRoom() {
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



    return (
        <div className="Home">
            <DebugDetails roomName='End Room'></DebugDetails>

            <button onClick={leaveRoom}>Go home</button >
        </div >
    );
}
