import { errorToast, selectFeState } from '@/lib/utils.ts'
import { ConnectButton } from '../../Buttons/ConnectButton/ConnectButton.tsx'
import { DisconnectButton } from '../../Buttons/DisconnectButton/DisconnectButton.tsx'

import { useSelector } from 'react-redux'

export function DebugDetails() {
    const { room, playerType } = useSelector(selectFeState)
    if (!room) {
        errorToast('Room does not exist')
        return null
    }

    return (
        <div className="App">
            <h1>Room status: {room.status}</h1>
            <h1>room ID: {room.id || 'No room'}</h1>
            <h1>playerType : {playerType || 'No player type'} </h1>
            <ConnectButton />
            <DisconnectButton />
            <hr></hr>
        </div>
    )
}
