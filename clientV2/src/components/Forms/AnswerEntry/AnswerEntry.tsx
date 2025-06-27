import { useState } from 'react'
import socket from '../../../socket.ts'
import { useSelector } from 'react-redux'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { errorToast, selectFeState } from '@/lib/utils.ts'

interface AnswerEntryProps {
    setHasAnswered: (hasAnswered: boolean) => void
}
export function AnswerEntry({ setHasAnswered }: AnswerEntryProps) {
    const [answer, setAnswer] = useState('')
    const { room } = useSelector(selectFeState)
    if (!room) {
        errorToast('Room does not exist')
        return null
    }

    function sendAnswer(event: any) {
        if (!room) {
            errorToast('Room does not exist')
            return null
        }
        event.preventDefault()
        setHasAnswered(true)
        socket.emit(
            'submit-answer',
            { roomId: room.id, answer },
            ({ success, data }) => {
                if (!success) {
                    errorToast(
                        `Failed to submit answer: ${JSON.stringify(data)}`
                    )
                    return
                }
            }
        )
    }
    return (
        <form
            className="flex justify-center items-center mt-4 mx-4"
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
