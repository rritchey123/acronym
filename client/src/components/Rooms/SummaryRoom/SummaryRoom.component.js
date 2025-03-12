import { useSelector } from 'react-redux'

export function SummaryRoom() {
    const { answers, votes, playerType, players } = useSelector(
        (state) => state.feState
    )

    return (
        <>
            {playerType === 'leader' && <button>Play again?</button>}
            {players.map(({ id, name }) => {
                const voteCount = votes[id]
                const answer = answers[id]

                return <div>{`${name} => ${answer} => ${voteCount} votes`}</div>
            })}
        </>
    )
}
