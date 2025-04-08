export function PlayerCard({ player }) {
    const bgColor = !player.answer ? 'bg-primary' : 'bg-secondary'
    return (
        <div
            className={`rounded border bg-primary py-1 min-w-[100px] text-center ${bgColor}`}
        >
            {player.name}
        </div>
    )
}
