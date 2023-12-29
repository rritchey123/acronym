import React from 'react';

import { useSelector } from 'react-redux';
import { DebugDetails } from '../../Misc/DebugDetails/DebugDetails.component';
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component';



export function VoteRoom() {
    const { answers } = useSelector((state) => state.feState)

    return (
        <div className='Vote room'>
            <DebugDetails roomName='Vote Room'></DebugDetails>
            <LeaveRoomButton></LeaveRoomButton>
            <div>
                {
                    answers.map(({ answer, id }) => {
                        return <li>{answer}</li>
                    })
                }
            </div>
        </div>


    );
}