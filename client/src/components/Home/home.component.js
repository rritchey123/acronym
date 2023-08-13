import React from 'react';
import { MyForm } from '../MyForm/MyForm.component';
import { ConnectButton } from '../ConnectButton/ConnectButton.component';
import { DisconnectButton } from '../DisconnectButton/DisconnectButton.component';

import { useSelector } from 'react-redux';
export function Home() {
    const { feState } = useSelector((state) => state.feStateASDF)
    const { connected } = useSelector((state) => state.connectionState)
    return (
        <div className="App">
            <h1>feState : {feState}</h1>
            <h1>connected : {connected ? "We connected" : "Negatory on that connection son"}</h1>
            <ConnectButton />
            <DisconnectButton />
            <MyForm />
        </div>
    );
}