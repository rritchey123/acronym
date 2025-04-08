export function PlayerCard({ player }) {
    return (
        <div className="rounded border bg-primary py-1 min-w-[100px] text-center">
            {player.name}
        </div>
    )
}
