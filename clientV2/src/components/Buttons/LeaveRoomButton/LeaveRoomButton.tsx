import socket from '../../../socket.ts'
import { useSelector, useDispatch } from 'react-redux'
import { setPlayerType, setRoom } from '../../../redux/feState'
import { Button } from '../../ui/button'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index.ts'

export function LeaveRoomButton({
    buttonText = 'Leave Room',
}: {
    buttonText?: string
}) {
    const { room } = useSelector(selectFeState)
    const dispatch = useDispatch()
    if (!room) {
        errorToast('Room does not exist')
        return null
    }
    function leaveRoom() {
        if (!room) {
            errorToast('Room does not exist')
            return null
        }
        dispatch(setPlayerType(PlayerType.NORMAL))
        socket.emit('leave-room', { roomId: room.id }, ({ success, data }) => {
            if (!success) {
                errorToast(`Failed to leave room: ${JSON.stringify(data)}`)
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
