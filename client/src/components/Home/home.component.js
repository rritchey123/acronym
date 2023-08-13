import React from 'react';

import { ConnectionManager } from '../ConnectionManager/ConnectionManager.component';
import { MyForm } from '../MyForm/MyForm.component';

import { useSelector } from 'react-redux';
export function Home() {
    const { feState } = useSelector((state) => state.feStateASDF)
    const { connected } = useSelector((state) => state.connectionState)
    return (
        <div className="App">
            <h1>feState : {feState}</h1>
            <h1>connected : {connected ? "We connected" : "Negatory on that connection son"}</h1>
            <ConnectionManager />
            <MyForm />
        </div>
    );
}