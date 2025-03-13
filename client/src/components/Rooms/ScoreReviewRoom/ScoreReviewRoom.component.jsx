import { useSelector } from 'react-redux'
import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton.component'
export const ScoreReviewRoom = () => {
    const { playerType, players, roomId, scores, isGameOver } = useSelector(
        (state) => state.feState
    )

    const onNextRountButtonClick = () => {
        socket.emit('start-next-round', { roomId })
    }

    return (
        <>
            {isGameOver && (
                <>
                    <h1>GAME OVER</h1>
                </>
            )}
            {!isGameOver && playerType === 'leader' && (
                <button onClick={onNextRountButtonClick}>
                    Ready for next round?
                </button>
            )}
            {isGameOver && <LeaveRoomButton buttonText="back to home page" />}
            {players.map(({ id, name }) => {
                const score = scores[id] || 0

                return <div key={id}>{`${name} => ${score}`}</div>
            })}
        </>
    )
}
