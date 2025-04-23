import { useSelector } from 'react-redux'
import socket from '../../../socket'
import { RoundHeader } from '../../RoundHeader'
import { Button } from '../../ui/button'
import { PlayerCard } from '../../Cards/Player/PlayerCard'

const TmpCard = ({ answer }) => {
    return (
        <div
            className={`rounded border bg-primary py-1 min-w-[100px] text-center justify-center`}
        >
            {answer}
        </div>
    )
}

export function RoundSummaryRoom() {
    const { answers, votes, playerType, players, roomId } = useSelector(
        (state) => state.feState
    )

    const onClick = () => {
        socket.emit('review-scores', { roomId })
    }

    return (
        <>
            <RoundHeader isSummary />
            {playerType === 'leader' && (
                <Button className="m-4" onClick={onClick}>
                    Review scores?
                </Button>
            )}
            <div className="flex justify-center">
                <div className="w-sm text-center flex-col">
                    <div className="mb-8 text-2xl text-center">
                        Waiting for leader to continue!
                    </div>
                    {players.map((p) => {
                        const { id, name } = p
                        const voteCount = votes[id] || 0
                        const answer = answers[id] || 'No answer :/'

                        return (
                            <div
                                key={id}
                                className="flex gap-2 items-center justify-around my-2"
                            >
                                <PlayerCard player={p} />
                                <TmpCard answer={answer} />
                                <div className='className="text-3xl text-center"'>{`${voteCount} vote${
                                    voteCount !== 1 ? 's' : ''
                                }`}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
