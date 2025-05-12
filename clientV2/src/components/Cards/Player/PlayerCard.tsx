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
            className={`overflow-auto rounded border py-1 w-[100px] text-center flex justify-center items-center ${bgColor}`}
        >
            {playerName}
        </div>
    )
}
