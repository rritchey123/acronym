import React from 'react'
import { ConnectButton } from '../../Buttons/ConnectButton/ConnectButton.component'
import { DisconnectButton } from '../../Buttons/DisconnectButton/DisconnectButton.component'

import { useSelector } from 'react-redux'

export function DebugDetails() {
    const { roomId, roomName, playerType } = useSelector(
        (state) => state.feState
    )
    const { connected } = useSelector((state) => state.connectionState)

    return (
        <div className="App">
            <h1>Room: {roomName}</h1>
            <h1>roomId: {roomId || 'No room'}</h1>
            <h1>
                connected :{' '}
                {connected ? 'We connected' : 'Negatory on that connection son'}
            </h1>
            <h1>playerType : {playerType || 'No player type'} </h1>
            <ConnectButton />
            <DisconnectButton />
            <hr></hr>
        </div>
    )
}
