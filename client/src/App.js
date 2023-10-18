import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { setRoomId, setState, setPlayerType } from "./redux/feState"

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
      const { success, reason, data } = payload
      const { roomId, playerId, playerName, type } = data
      dispatch(setRoomId(roomId))
      dispatch(setState("room"))
      dispatch(setPlayerType(type))
    }

    function roomJoined(payload) {
      const { success, reason, data } = payload
      if (!success) {
        alert(reason)
        return
      }

      console.log("room-joined event RECEIVED:", payload)
      const { roomId, playerId, playerName, type } = data

      dispatch(setRoomId(roomId))
      dispatch(setState("room"))
      dispatch(setPlayerType(type))
    }

    function roomLeft(payload) {
      const { success, reason, data } = payload
      if (!success) {
        alert(reason)
        return
      }
      dispatch(setRoomId(""))
      dispatch(setState("home"))
      dispatch(setPlayerType(null))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-created', roomCreated)
    socket.on('room-left', roomLeft)
    socket.on("room-joined", roomJoined)

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("room-created", roomCreated)
      socket.off("room-left", roomLeft)
      socket.off("room-joined", roomJoined)

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