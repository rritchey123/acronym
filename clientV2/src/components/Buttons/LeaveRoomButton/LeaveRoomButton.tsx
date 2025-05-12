import socket from '../../../socket.ts'
import { useSelector, useDispatch } from 'react-redux'
import { setRoom } from '../../../redux/feState'
import { Button } from '../../ui/button'
import { selectFeState } from '@/lib/utils.ts'

export function LeaveRoomButton({ buttonText = 'Leave Room' }) {
    const { room } = useSelector(selectFeState)
    const dispatch = useDispatch()
    if (!room) {
        alert('Room does not exist')
        return null
    }
    function leaveRoom() {
        if (!room) {
            alert('Room does not exist')
            return null
        }
        socket.emit('leave-room', { roomId: room.id }, ({ success, data }) => {
            if (!success) {
                alert(`Failed to leave room: ${JSON.stringify(data)}`)
            }
            dispatch(setRoom(null))
        })
    }

    return (
        <Button variant="destructive" onClick={leaveRoom}>
            {buttonText}
        </Button>
    )
}
