import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { setRoomId, setState } from "./redux/feState"

import { useSelector, useDispatch } from 'react-redux';
import { Home } from './components/Home/home.component';
import { Room } from './components/Room/room.component';

export default function App() {
  const { state } = useSelector((state) => state.feState)
  const dispatch = useDispatch()

  useEffect(() => {

    function onConnect() {
      dispatch(setConnectionState(true));
    }

    function onDisconnect() {
      dispatch(setConnectionState(false));
    }

    function roomCreated(payload) {
      dispatch(setRoomId(payload))
      dispatch(setState("room"))
    }

    function roomLeft() {
      dispatch(setRoomId(""))
      dispatch(setState("home"))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-created', roomCreated)
    socket.on('room-left', roomLeft)

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("room-created", roomCreated)

    };
  }, []);

  if (state === "home") {
    return (
      <Home></Home>
    )
  } else {
    return (
      <Room></Room>
    )
  }


}