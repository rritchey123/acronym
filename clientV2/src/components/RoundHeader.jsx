import { useSelector } from 'react-redux'
import { Separator } from '@/components/ui/separator'
export const RoundHeader = () => {
    const { round } = useSelector((state) => state.feState)
    return (
        <>
            <h3 className="text-2xl text-center my-2">Round {round}</h3>
            <Separator className="mb-2"></Separator>
        </>
    )
}
