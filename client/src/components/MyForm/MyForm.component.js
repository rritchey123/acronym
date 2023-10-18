import React, { useState } from 'react';
import socket from '../../socket';

export function MyForm() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function createRoom(event) {
    event.preventDefault();
    if (!playerName) {
      alert("Please enter a player name")
      return
    }
    setIsLoading(true);

    socket.timeout(1000).emit('create-room', { playerName }, () => {
      setIsLoading(false);
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
    setIsLoading(true);

    socket.timeout(1000).emit('join-room', { playerName, roomId }, () => {
      setIsLoading(false);
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