import { useSelector } from 'react-redux'
import socket from '../../../socket'
export const ScoreReviewRoom = () => {
    const { playerType, players, roomId, scores } = useSelector(
        (state) => state.feState
    )

    const onClick = () => {
        socket.emit('start-next-round', { roomId })
    }

    return (
        <>
            {playerType === 'leader' && (
                <button onClick={onClick}>Ready for next round?</button>
            )}
            {players.map(({ id, name }) => {
                const score = scores[id] || 999

                return <div key={id}>{`${name} => ${score}`}</div>
            })}
        </>
    )
}
