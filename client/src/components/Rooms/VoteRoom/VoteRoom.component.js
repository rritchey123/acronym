import React from 'react'

import { useSelector } from 'react-redux'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'

export function VoteRoom() {
    const { answers } = useSelector((state) => state.feState)

    return (
        <div className="Vote room">
            <LeaveRoomButton />
            <div>
                {answers.map(({ answer, id }) => {
                    return <li>{answer}</li>
                })}
            </div>
        </div>
    )
}
