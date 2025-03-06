import React from 'react'
import { useSelector } from 'react-redux'

import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'

export function WaitRoom() {
    const { roomId, playerType } = useSelector((state) => state.feState)

    function startGame() {
        socket.emit('start-game', { roomId })
    }

    return (
        <div className="App">
            {playerType === 'leader' && (
                <button type="button" onClick={startGame}>
                    Start Game
                </button>
            )}
            <LeaveRoomButton />
        </div>
    )
}
