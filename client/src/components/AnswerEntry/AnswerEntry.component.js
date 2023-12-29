import React, { useState } from 'react';
import socket from '../../socket';
import { useSelector } from 'react-redux';

export function AnswerEntry(props) {
    const [answer, setAnswer] = useState('');
    const { setHasAnswered } = props
    const { roomId } = useSelector((state) => state.feState)



    function sendAnswer(event) {
        event.preventDefault()
        console.log('inside send answer callback!!!')
        setAnswer('')

        socket.emit('submit-answer', { roomId, answer });

        setHasAnswered(true)
    }
    // ! Find way to clear textbox
    return (
        <form onSubmit={sendAnswer}>
            <input onChange={e => setAnswer(e.target.value)} placeholder='Enter an answer' />
            <div></div>
            <button type="submit">Submit</button>

        </form>
    );
}