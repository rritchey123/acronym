import React, { useState } from 'react';
import socket from '../../../socket';
import { useSelector } from 'react-redux';

export function AnswerEntry(props) {
    const [answer, setAnswer] = useState('');
    const { setHasAnswered } = props
    const { roomId } = useSelector((state) => state.feState)



    function sendAnswer(event) {
        event.preventDefault()
        socket.emit('submit-answer', { roomId, answer });
        setHasAnswered(true)
    }
    return (
        <form onSubmit={sendAnswer}>
            <input onChange={e => setAnswer(e.target.value)} placeholder='Enter an answer' />
            <div></div>
            <button type="submit">Submit</button>

        </form>
    );
}