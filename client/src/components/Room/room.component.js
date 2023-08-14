import React from 'react';
import { MyForm } from '../MyForm/MyForm.component';
import { ConnectButton } from '../ConnectButton/ConnectButton.component';
import { DisconnectButton } from '../DisconnectButton/DisconnectButton.component';

import { useSelector } from 'react-redux';

export function Room() {
    const { roomId } = useSelector((state) => state.feState)
    const { connected } = useSelector((state) => state.connectionState)

    return (
        <div className="App">
            <h1>ROOM SCREEN</h1>
            <h1>roomId: {roomId || "No room"}</h1>
            <h1>connected : {connected ? "We connected" : "Negatory on that connection son"}</h1>

        </div>
    );
}