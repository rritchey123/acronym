import socket from '../../../socket.ts'
import { useSelector, useDispatch } from 'react-redux'
import { setPlayerId, setPlayerType, setRoom } from '../../../redux/feState'
import { Button } from '../../ui/button'
import { errorToast, selectFeState } from '@/lib/utils.ts'
import { PlayerType } from '@shared/index.ts'
import {
    SESSION_STORAGE_PLAYER_ID_KEY,
    SESSION_STORAGE_PLAYER_TYPE_KEY,
    SESSION_STORAGE_ROOM_ID_KEY,
} from '../../../../../shared/constants.ts'

export function LeaveRoomButton({
    buttonText = 'Leave Room',
}: {
    buttonText?: string
}) {
    const { room, playerId } = useSelector(selectFeState)
    const dispatch = useDispatch()
    if (!room) {
        errorToast('Room does not exist')
        return null
    }
    if (!playerId) {
        console.log('No player ID found in Leave Room Button')
        return null
    }
    function leaveRoom() {
        if (!room) {
            errorToast('Room does not exist')
            return null
        }

        socket.emit(
            'leave-room',
            { roomId: room.id, playerId: playerId! },
            ({ success, data }) => {
                if (!success) {
                    errorToast(`Failed to leave room: ${JSON.stringify(data)}`)
                }
                dispatch(setRoom(null))
                dispatch(setPlayerType(PlayerType.NORMAL))
                dispatch(setPlayerId(null))

                sessionStorage.removeItem(SESSION_STORAGE_ROOM_ID_KEY)
                sessionStorage.removeItem(SESSION_STORAGE_PLAYER_ID_KEY)
                sessionStorage.removeItem(SESSION_STORAGE_PLAYER_TYPE_KEY)
            }
        )
    }

    return (
        <Button variant="destructive" onClick={leaveRoom}>
            {buttonText}
        </Button>
    )
}
