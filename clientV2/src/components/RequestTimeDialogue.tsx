import { useState } from 'react'
import { AlarmClockPlus } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import socket from '@/socket'
import { useSelector } from 'react-redux'
import { selectFeState } from '@/lib/utils'

export const AddTimeDialog = () => {
    const { room } = useSelector(selectFeState)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasAddedTime, setHasAddedTime] = useState(false)
    if (!room) {
        alert('Room does not exist')
        return null
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            socket.emit(
                'add-time',
                { roomId: room.id },
                ({ success, data }) => {
                    if (!success) {
                        alert(
                            `Failed to request more time: ${JSON.stringify(
                                data
                            )}`
                        )
                    } else {
                        alert(`Successfully added time`)
                        setHasAddedTime(true)
                    }
                }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground"
                >
                    <AlarmClockPlus className="w-5 h-5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] space-y-4">
                <DialogHeader>
                    <DialogTitle>Need more time?</DialogTitle>
                    <DialogDescription>Request more time.</DialogDescription>
                </DialogHeader>
                {hasAddedTime && (
                    <p className="text-sm text-muted-foreground">
                        You have already requested more time.
                    </p>
                )}
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || hasAddedTime}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
