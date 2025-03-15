import React, { useState } from 'react'

import { useSelector } from 'react-redux'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'
import socket from '../../../socket'

export function VoteRoom() {
    const { answers, roomId } = useSelector((state) => state.feState)
    const [hasVoted, setHasVoted] = useState(false)

    const submitVote = (playerId) => {
        return () => {
            socket.emit('submit-vote', { playerId, roomId })
            setHasVoted(true)
        }
    }
    return (
        <div className="Vote room">
            <LeaveRoomButton />
            {hasVoted ? (
                <div>Waiting for other players to finish voting</div>
            ) : (
                Object.entries(answers).map(([playerId, answer]) => {
                    return <li onClick={submitVote(playerId)}>{answer}</li>
                })
            )}
        </div>
    )
}
