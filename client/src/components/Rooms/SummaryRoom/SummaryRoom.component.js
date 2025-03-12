import { useSelector } from 'react-redux'
import socket from '../../../socket'

export function SummaryRoom() {
    const { answers, votes, playerType, players, roomId } = useSelector(
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
                const voteCount = votes[id] || 0
                const answer = answers[id] || 'No answer :/'

                return (
                    <div
                        key={id}
                    >{`${name} => ${answer} => ${voteCount} votes`}</div>
                )
            })}
        </>
    )
}
