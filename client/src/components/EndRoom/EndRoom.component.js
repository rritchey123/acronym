import React from 'react';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';
import { LeaveRoomButton } from '../LeaveRoomButton/LeaveRoomButton.component';

export function EndRoom() {
    return (
        <div className="Home">
            <DebugDetails roomName='End Room'></DebugDetails>
            <LeaveRoomButton></LeaveRoomButton>
        </div >
    );
}
