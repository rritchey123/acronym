import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { useSelector, useDispatch } from 'react-redux';
import { Home } from './components/Home/home.component';

export default function App() {
  const { feState } = useSelector((state) => state.feStateASDF)
  const dispatch = useDispatch()

  useEffect(() => {

    function onConnect() {
      console.log("CONNECTED TO THE SERVER")
      dispatch(setConnectionState(true));
    }

    function onDisconnect() {
      console.log("DISCONNECTED FROM THE SERVER")
      dispatch(setConnectionState(false));
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    // socket.on('foo', onFooEvent);

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // socket.off('foo', onFooEvent);
    };
  }, []);

  if (feState === "home") {
    return (
      <Home></Home>
    )
  } else {
    return (
      <Home></Home>
    )
  }


}