import { selectFeState } from '@/lib/utils.ts'
import { ConnectButton } from '../../Buttons/ConnectButton/ConnectButton.tsx'
import { DisconnectButton } from '../../Buttons/DisconnectButton/DisconnectButton.tsx'

import { useSelector } from 'react-redux'

export function DebugDetails() {
    const { room, playerType, playerId } = useSelector(selectFeState)

    return (
        <div className="App">
            <h1>Room status: {room?.status || 'No room status'}</h1>
            <h1>room ID: {room?.id || 'No room'}</h1>
            <h1>playerId : {playerId || 'No player id'} </h1>
            <h1>playerType : {playerType || 'No player type'} </h1>
            <ConnectButton />
            <DisconnectButton />
            <hr></hr>
        </div>
    )
}
