import React from 'react'
import { useSelector } from 'react-redux'

import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'

export function WaitRoom() {
    const { roomId, playerType, players } = useSelector(
        (state) => state.feState
    )

    function startGame() {
        socket.emit('start-game', { roomId })
    }

    return (
        <div className="App">
            <h1>Waiting on leader to start the game...</h1>
            <h2>Room code: {roomId}</h2>
            {playerType === 'leader' && (
                <button type="button" onClick={startGame}>
                    Start Game
                </button>
            )}
            {players.map((player) => {
                return <h3>{player.name}</h3>
            })}

            <LeaveRoomButton />
        </div>
    )
}
