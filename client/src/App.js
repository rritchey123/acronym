import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { setRoomId, setState, setPlayerType } from "./redux/feState"

import { useSelector, useDispatch } from 'react-redux';

import { HomeRoom } from './components/HomeRoom/HomeRoom.component';
import { WaitRoom } from './components/WaitRoom/WaitRoom.component';
import { PlayRoom } from './components/PlayRoom/PlayRoom.component';

export default function App() {
  console.log('RE-RENDERING APP COMPONENT')
  const { state } = useSelector((state) => state.feState)
  const dispatch = useDispatch()

  useEffect(() => {

    function onConnect() {
      dispatch(setConnectionState(true));
    }

    function onDisconnect() {
      dispatch(setConnectionState(false));
    }

    function gameStarted(payload) {
      const { success, reason, data } = payload
      if (!success) {
        alert(reason)
        return
      }
      console.log('GAME STARTED')

      dispatch(setState("playRoom"))

    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game-started', gameStarted)

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("game-started", gameStarted)

    };
  }, []);

  if (state === "homeRoom") {
    return (
      <HomeRoom></HomeRoom>
    )
  } else if (state === "waitRoom") {
    return (
      <WaitRoom></WaitRoom>
    )
  } else if (state === "playRoom") {
    return (
      <PlayRoom></PlayRoom>
    )
  } else {
    return (<HomeRoom></HomeRoom>)
  }


}