import React, { useState, useEffect } from 'react';
import socket from './socket';

import { ConnectionManager } from './components/ConnectionManager/ConnectionManager.component';
import { MyForm } from './components/MyForm/MyForm.component';
import { Events } from './components/Events/Events.component';

import { useSelector } from 'react-redux';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const { feState } = useSelector((state) => state.feStateASDF)
  const { connected } = useSelector((state) => state.connectionState)

  useEffect(() => {

    function onConnect() {
      console.log("CONNECTED TO THE SERVER")
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("DISCONNECTED FROM THE SERVER")
      setIsConnected(false);
    }


    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <h1>feState : {feState}</h1>
      <h1>connected : {connected ? "We connected" : "Negatory on that connection son"}</h1>
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}