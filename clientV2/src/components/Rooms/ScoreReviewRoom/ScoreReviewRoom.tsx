import { useSelector } from 'react-redux'
import socket from '../../../socket'
import { LeaveRoomButton } from '../../Buttons/LeaveRoomButton/LeaveRoomButton'
import { PlayerCard } from '../../Cards/Player/PlayerCard'
import { Button } from '../../ui/button'
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
                <Button className="m-4" onClick={onNextRountButtonClick}>
                    Next round
                </Button>
            )}
            {isGameOver && <LeaveRoomButton buttonText="back to home page" />}
            <div className="flex justify-center">
                <div className="w-sm text-center flex-col">
                    <div className="mb-8 text-2xl text-center">
                        Waiting for leader to continue!
                    </div>
                    {scores.map(({ name, score }, id) => {
                        return (
                            <div
                                key={id}
                                className="flex gap-2 items-center justify-around my-2"
                            >
                                <PlayerCard player={{ name }} />
                                <div className='w-20 className="text-3xl text-center"'>{`${score} vote${
                                    score !== 1 ? 's' : ''
                                }`}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
