import { useSelector } from 'react-redux'
import { Separator } from '@/components/ui/separator'
import { selectFeState } from '@/lib/utils'
export const RoundHeader = (
    {
        isRoundSummary,
        isGameSummary,
    }: { isRoundSummary?: boolean; isGameSummary?: boolean } = {
        isRoundSummary: false,
        isGameSummary: false,
    }
) => {
    const { room } = useSelector(selectFeState)
    if (!room) {
        alert('Room does not exist')
        return null
    }
    return (
        <>
            <h3 className="text-2xl text-center my-2">
                Round {room.round}
                {isRoundSummary ? ' Summary' : ''}
                {isGameSummary ? ' Over. Game scores:' : ''}
            </h3>
            <Separator className="mb-2"></Separator>
        </>
    )
}
