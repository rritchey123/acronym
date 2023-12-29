import React from 'react';
import socket from '../../../socket';

export function DisconnectButton() {
    function disconnect() {
        socket.disconnect();
    }

    return (
        <button onClick={disconnect}>Disconnect</button>
    );
}