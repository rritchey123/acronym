import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { setRoomId, setState, setPlayerType } from "./redux/feState"

import { useSelector, useDispatch } from 'react-redux';
import { Home } from './components/Home/Home.component';
import { WaitingRoom } from './components/WaitingRoom/WaitingRoom.component'
import { PlayingRoom } from './components/PlayingRoom/PlayingRoom.component';

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

      dispatch(setState("playingRoom"))

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

  if (state === "home") {
    return (
      <Home></Home>
    )
  } else if (state === "waitingRoom") {
    return (
      <WaitingRoom></WaitingRoom>
    )
  } else if (state === "playingRoom") {
    return (
      <PlayingRoom></PlayingRoom>
    )
  } else {
    return (<Home></Home>)
  }


}