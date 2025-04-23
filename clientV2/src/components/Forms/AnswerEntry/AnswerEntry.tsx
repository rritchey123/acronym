import React, { useState } from 'react'
import socket from '../../../socket'
import { useSelector } from 'react-redux'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export function AnswerEntry(props) {
    const [answer, setAnswer] = useState('')
    const { setHasAnswered } = props
    const { roomId } = useSelector((state) => state.feState)

    function sendAnswer(event) {
        event.preventDefault()
        socket.emit('submit-answer', { roomId, answer })
        setHasAnswered(true)
    }
    return (
        <form
            className="flex justify-center items-center mt-4"
            onSubmit={sendAnswer}
        >
            <Input
                className="w-sm"
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter an answer"
            />
            <Button className="ml-2">Submit</Button>
        </form>
    )
}
