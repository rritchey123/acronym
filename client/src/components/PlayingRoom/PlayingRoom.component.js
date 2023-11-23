import React from 'react';
// import { MyForm } from '../MyForm/MyForm.component';
// import { ConnectButton } from '../ConnectButton/ConnectButton.component';
// import { DisconnectButton } from '../DisconnectButton/DisconnectButton.component';

import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useSelector, useDispatch } from 'react-redux';

import socket from '../../socket';

export function PlayingRoom() {
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
            <h1>PLAYING ROOM SCREEN</h1>
            <h1>roomId: {roomId || "No room"}</h1>
            <h1>connected : {connected ? "We connected" : "Negatory on that connection son"}</h1>
            <h1>playerType : {playerType} </h1>
            {
                playerType === "leader" && <button type="button" onClick={startGame}>Start Game</button>
            }
            <button type="button" onClick={leaveRoom} >Leave Room</button>
        </div>
    );
}