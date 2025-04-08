import React from 'react'
import { useSelector } from 'react-redux'

import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'
import { Button } from '@/components/ui/button'
import { PlayerCard } from '../../Cards/Player/PlayerCard.component'

export function WaitRoom() {
    const { roomId, playerType, players } = useSelector(
        (state) => state.feState
    )

    function startGame() {
        socket.emit('start-game', { roomId })
    }
    return (
        <>
            <LeaveRoomButton />
            {playerType === 'leader' && (
                <Button className="mt-4 ml-2" onClick={startGame}>
                    Start Game
                </Button>
            )}
            <div className="flex justify-center">
                <div className="w-sm">
                    <div className="text-center text-2xl mt-4">
                        Waiting on leader to start the game...
                    </div>
                    <div className="text-center text-2xl">
                        Room code: {roomId}
                    </div>

                    <div className="text-center text-2xl my-4">PLAYERS</div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {players.map((p, idx) => {
                            return <PlayerCard key={idx} player={p} />
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
