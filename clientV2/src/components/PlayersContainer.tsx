import { PlayerCard } from './Cards/Player/PlayerCard'
export const PlayersContainer = ({ players }) => {
    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {players.map((p, idx) => {
                return <PlayerCard key={idx} player={p} />
            })}
        </div>
    )
}
