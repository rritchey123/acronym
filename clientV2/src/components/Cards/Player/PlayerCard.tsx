export function PlayerCard({ player }) {
    const bgColor = !player.answer ? 'bg-primary' : 'bg-secondary'
    return (
        <div
            className={`overflow-auto rounded border py-1 w-[100px] text-center flex justify-center items-center ${bgColor}`}
        >
            {player.name}
        </div>
    )
}
