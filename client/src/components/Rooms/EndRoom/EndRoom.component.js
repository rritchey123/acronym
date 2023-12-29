import React from 'react';
import { DebugDetails } from '../../Misc/DebugDetails/DebugDetails.component';
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component';

export function EndRoom() {
    return (
        <div className="Home">
            <DebugDetails roomName='End Room'></DebugDetails>
            <LeaveRoomButton></LeaveRoomButton>
        </div >
    );
}
