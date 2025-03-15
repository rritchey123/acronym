import React from 'react'
import socket from '../../../socket'
import { useSelector, useDispatch } from 'react-redux'
import { setRoomId, setRoomName, setPlayerType } from '../../../redux/feState'

export function LeaveRoomButton({ buttonText = 'Leave Room' }) {
    const { roomId } = useSelector((state) => state.feState)

    const dispatch = useDispatch()

    function leaveRoom() {
        socket.emit('leave-room', { roomId }, ({ success, reason, data }) => {
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomId(''))
            dispatch(setRoomName('homeRoom'))
            dispatch(setPlayerType(null))
        })
    }

    return (
        <button type="button" onClick={leaveRoom}>
            {buttonText}
        </button>
    )
}
