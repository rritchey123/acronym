import React, { useState } from 'react';
import socket from '../../socket';
import { setRoomId, setState, setPlayerType } from "../../redux/feState"
import { useDispatch } from 'react-redux';

export function MyForm() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch()

  function createRoom(event) {
    event.preventDefault();
    if (!playerName) {
      alert("Please enter a player name")
      return
    }
    //setIsLoading(true);

    socket.emit('create-room', ({ success, reason, data }) => {
      const { roomId } = data

      socket.emit('join-room', { roomId, playerName, playerType: "leader" }, ({ success, reason, data }) => {
        if (!success) {
          alert(reason)
          return
        }
        dispatch(setRoomId(roomId))
        dispatch(setState("waitRoom"))
        dispatch(setPlayerType("leader"))
      })
      // setIsLoading(false);
    });
    return
  }

  function joinRoom(event) {

    event.preventDefault();
    if (!playerName) {
      alert("Please enter a name")
      return
    }
    if (!roomId) {
      alert("Please enter a room ID")
      return
    }
    //setIsLoading(true);

    socket.emit('join-room', { playerName, roomId, playerName: "player" }, ({ success, reason, data }) => {
      if (!success) {
        alert(reason)
        return
      }
      dispatch(setRoomId(roomId))
      dispatch(setState("waitRoom"))
      dispatch(setPlayerType("player"))
      // setIsLoading(false);
    });
  }

  return (
    <form onSubmit={joinRoom}>
      <input onChange={e => setPlayerName(e.target.value)} placeholder='Enter a player name' />
      <div></div>
      <button type="button" onClick={createRoom} disabled={isLoading}>Create Room</button>
      <button type="submit" onClick={joinRoom} disabled={isLoading}>Join Room</button>
      <div></div>
      <input onChange={e => setRoomIdInput(e.target.value)} placeholder='Enter a room ID' />
    </form>
  );
}