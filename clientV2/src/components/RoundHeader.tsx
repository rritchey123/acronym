import { useSelector } from 'react-redux'
import { Separator } from '@/components/ui/separator'
import { selectFeState } from '@/lib/utils'
export const RoundHeader = (
    { isSummary }: { isSummary?: boolean } = { isSummary: false }
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
                {isSummary ? ' Summary' : ''}
            </h3>
            <Separator className="mb-2"></Separator>
        </>
    )
}
