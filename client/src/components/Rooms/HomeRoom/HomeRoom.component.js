import React from 'react';
import { HomeForm } from '../../Forms/HomeForm/HomeForm.component';
import { DebugDetails } from '../../Misc/DebugDetails/DebugDetails.component';


export function HomeRoom() {
    return (
        <div className="Home">
            <DebugDetails roomName='Home Room'></DebugDetails>
            <HomeForm />
        </div>
    );
}