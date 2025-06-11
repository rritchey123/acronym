export function PlayerCard({
    answer,
    playerName,
}: {
    answer?: string
    playerName: string
}) {
    const bgColor = !answer ? 'bg-primary' : 'bg-secondary'
    return (
        <div
            className={`whitespace-nowrap overflow-scroll rounded border py-1 w-[300px] text-center ${bgColor} `}
        >
            {playerName}
        </div>
    )
}
