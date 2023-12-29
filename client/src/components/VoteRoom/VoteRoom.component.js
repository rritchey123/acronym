import React, { useState } from 'react';
import socket from '../../socket';
import { useSelector, useDispatch } from 'react-redux';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"


export function VoteRoom() {
    const { roomId, answers } = useSelector((state) => state.feState)

    const dispatch = useDispatch()

    function leaveRoom() {
        socket.emit("leave-room", { roomId }, ({ success, reason, data }) => {
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomId(""))
            dispatch(setState("homeRoom"))
            dispatch(setPlayerType(null))
        })
    }

    // ! Find way to clear textbox
    return (
        <div className='Vote room'>
            <DebugDetails roomName='Vote Room'></DebugDetails>
            <button type="button" onClick={leaveRoom} >Leave Room</button>
            <div>
                {
                    answers.map(({ answer, id }) => {
                        return <li>{answer}</li>
                    })
                }
            </div>
        </div>


    );
}