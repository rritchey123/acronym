import React, { useState } from 'react';
import socket from '../../socket';

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function createRoom(event) {
    event.preventDefault();
    if (!value) {
      alert("Please enter a name")
      return
    }
    setIsLoading(true);

    socket.timeout(1000).emit('create-room', value, () => {
      setIsLoading(false);
    });
    return
  }

  function joinRoom(event) {

    event.preventDefault();
    if (!value) {
      alert("Please enter a name")
      return
    }
    setIsLoading(true);

    socket.timeout(1000).emit('join-room', value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={joinRoom}>
      <input onChange={e => setValue(e.target.value)} placeholder='Enter a name' />
      <button type="button" onClick={createRoom} disabled={isLoading}>Create Room</button>
      <button type="submit" disabled={isLoading}>Join Room</button>
    </form>
  );
}