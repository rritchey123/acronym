import React from 'react';
import { MyForm } from '../MyForm/MyForm.component';
import { DebugDetails } from '../DebugDetails/DebugDetails.component';


export function HomeRoom() {
    return (
        <div className="Home">
            <DebugDetails roomName='Home'></DebugDetails>
            <MyForm />
        </div>
    );
}