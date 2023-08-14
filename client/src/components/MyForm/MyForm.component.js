import React, { useState } from 'react';
import socket from '../../socket';

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function joinRoom(event) {
    event.preventDefault();
    setIsLoading(true);
    console.log("JOINING ROOM")

    if (!value) return alert("Please enter a name")

    socket.timeout(1000).emit('join-room', value, () => {
      setIsLoading(false);
    });
  }

  function createRoom() {
    console.log("CREATING ROOM")
    setIsLoading(true);

    if (!value) alert("Please enter a name")

    socket.timeout(1000).emit('create-room', value, () => {
      setIsLoading(false);
    });
    return
  }

  return (
    <form onSubmit={joinRoom}>
      <input onChange={e => setValue(e.target.value)} />
      <button type="button" onClick={createRoom} disabled={isLoading}>Create Room</button>
      <button type="submit" disabled={isLoading}>Join Room</button>
    </form>
  );
}