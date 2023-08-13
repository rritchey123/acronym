import React, { useState, useEffect } from 'react';
import socket from './socket';
import { ConnectionState } from './components/ConnectionState/ConnectionState.component';
import { ConnectionManager } from './components/ConnectionManager/ConnectionManager.component';
import { MyForm } from './components/MyForm/MyForm.component';
import { Events } from './components/Events/Events.component';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

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
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}