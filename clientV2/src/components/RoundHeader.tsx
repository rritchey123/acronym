import { useSelector } from 'react-redux'
import { Separator } from '@/components/ui/separator'
import { selectFeState } from '@/lib/utils'
export const RoundHeader = ({ isSummary } = { isSummary: false }) => {
    const { round } = useSelector(selectFeState)
    return (
        <>
            <h3 className="text-2xl text-center my-2">
                Round {round}
                {isSummary ? ' Summary' : ''}
            </h3>
            <Separator className="mb-2"></Separator>
        </>
    )
}
