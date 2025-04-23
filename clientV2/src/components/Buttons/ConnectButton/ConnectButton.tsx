import React from 'react'
import socket from '../../../socket.ts'

export function ConnectButton() {
    function connect() {
        socket.connect()
    }

    return <button onClick={connect}>Connect</button>
}
