import React, { useEffect } from 'react';
import socket from './socket';

import { setConnectionState } from "./redux/connectionState"
import { setRoomId, setState, setPlayerType, setPlayers, setAcronym, setPrompt, setAnswers } from "./redux/feState"

import { useSelector, useDispatch } from 'react-redux';

import { HomeRoom } from './components/HomeRoom/HomeRoom.component';
import { WaitRoom } from './components/WaitRoom/WaitRoom.component';
import { PlayRoom } from './components/PlayRoom/PlayRoom.component';
import { EndRoom } from './components/EndRoom/EndRoom.component';
import { VoteRoom } from './components/VoteRoom/VoteRoom.component';


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

    function gameEnded(payload) {
      const { success, reason, data } = payload
      if (!success) {
        alert(reason)
        return
      }
      console.log('GAME ENDED')

      dispatch(setState("endRoom"))
    }

    function updatePlayers(payload) {
      const { success, reason, data } = payload
      const { room } = data
      if (!success) {
        alert(reason)
        return
      }
      console.log('UPDATING PLAYERS')
      dispatch(setPlayers(room.players))
      dispatch(setAcronym(room.acronym))
      dispatch(setPrompt(room.prompt))
    }

    function voteReady(payload) {
      const { success, reason, data } = payload
      const { room } = data
      if (!success) {
        alert(reason)
        return
      }
      console.log('SETTING STATE TO VOTE READY')
      dispatch(setState("voteRoom"))
      dispatch(setAnswers(data.answers))
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game-started', gameStarted)
    socket.on('game-ended', gameEnded)
    socket.on('update-players', updatePlayers)
    socket.on('vote-ready', voteReady)

    return () => {
      // ! TODO: WHAT IS SOCKET.OFF?
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("game-started", gameStarted)
      socket.off('game-ended', gameEnded)
      socket.off('update-players', updatePlayers)
      socket.off('vote-ready', voteReady)
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
  } else if (state === "endRoom") {
    return (
      <EndRoom></EndRoom>
    )
  } else if (state === 'voteRoom') {
    return (<VoteRoom></VoteRoom>)
  }
  else {
    return (<HomeRoom></HomeRoom>)
  }


}