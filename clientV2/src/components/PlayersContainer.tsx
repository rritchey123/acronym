import { AnswersMap, PlayersMap } from '@shared/index'
import { PlayerCard } from './Cards/Player/PlayerCard'
export const PlayersContainer = ({
    players,
    answers,
}: {
    players: PlayersMap
    answers?: AnswersMap
}) => {
    return (
        // <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col items-center gap-4 my-2">
            <div className="text-center text-2xl mt-4">Players</div>
            {Object.values(players).map((p, idx) => {
                return (
                    <PlayerCard
                        key={idx}
                        playerName={p.name}
                        answer={answers?.[p.id]}
                    />
                )
            })}
        </div>
    )
}
