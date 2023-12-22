import React from 'react';

import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useSelector, useDispatch } from 'react-redux';

import { Player } from '../Player/Player.component';

import socket from '../../socket';

export function PlayRoom() {
    const { roomId, playerType, players, acronym, prompt } = useSelector((state) => state.feState)
    const { connected } = useSelector((state) => state.connectionState)

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
    function endGame() {
        socket.emit("end-game", { roomId })
    }

    return (
        <div className="App">
            <DebugDetails roomName='Play Room'></DebugDetails>
            {
                playerType === "leader" && <button type="button" onClick={endGame}>End Game</button>
            }

            <button type="button" onClick={leaveRoom} >Leave Room</button>

            <div>PLAYERS</div>
            {players.map(({ name: playerName }) => {
                return <Player playerName={playerName}></Player>
            })}

            <div>ACRONYM</div>
            {acronym}
            <div>PROMPT</div>
            {prompt}
        </div>
    );
}