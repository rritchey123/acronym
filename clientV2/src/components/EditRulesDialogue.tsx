import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { selectFeState } from '@/lib/utils'
import { useSelector } from 'react-redux'
import {
    MAX_ROUND_DURATION,
    MAX_SCORE_LIMIT,
    MIN_ROUND_DURATION,
    MIN_SCORE_LIMIT,
} from './constants'
import socket from '@/socket'

export function EditRulesDialog() {
    const { room } = useSelector(selectFeState)
    const [defaultRoundDuration, setDefaultRoundDuration] = useState<
        number | null
    >(null)
    const [scoreLimit, setScoreLimit] = useState<number | null>(null)
    // const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!room) return
        setDefaultRoundDuration(room.currentRoundDuration)
        setScoreLimit(room.scoreLimit)
    }, [room])

    if (!room) {
        alert('EditRulesDialog: Room does not exist')
        return null
    }

    const handleSave = () => {
        socket.emit(
            'update-game-rules',
            {
                roomId: room.id,
                defaultRoundDuration: defaultRoundDuration as number,
                scoreLimit: scoreLimit as number,
            },
            ({ success, data }) => {
                if (!success) {
                    alert(
                        `Failed to update game rules: ${JSON.stringify(data)}`
                    )
                    return
                }
                alert('Game rules updated!')
            }
        )
    }
    const handleDialogToggle = (open: boolean) => {
        if (!open) {
            // Reset fields when dialog closes
            setDefaultRoundDuration(room.defaultRoundDuration)
            setScoreLimit(room.scoreLimit)
        }
    }

    return (
        <Dialog onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
                <Button variant="secondary">Edit Rules</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px] space-y-6">
                <DialogHeader>
                    <DialogTitle>Edit Game Rules</DialogTitle>
                    <DialogDescription>
                        Change the settings for this game.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Round Duration */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">
                            Round Duration (seconds)
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Must be between {MIN_ROUND_DURATION} and{' '}
                            {MAX_ROUND_DURATION} seconds
                        </p>
                        <Input
                            inputMode="numeric"
                            value={defaultRoundDuration ?? ''}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setDefaultRoundDuration(Number(value))
                                }
                            }}
                        />
                    </div>

                    {/* Score Limit */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground">
                            Score Limit
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Must be between {MIN_SCORE_LIMIT} and{' '}
                            {MAX_SCORE_LIMIT}
                        </p>
                        <Input
                            inputMode="numeric"
                            value={scoreLimit ?? ''}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setScoreLimit(Number(value))
                                }
                            }}
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={
                            // isSubmitting ||
                            !defaultRoundDuration ||
                            defaultRoundDuration < MIN_ROUND_DURATION ||
                            defaultRoundDuration > MAX_ROUND_DURATION ||
                            !scoreLimit ||
                            scoreLimit < MIN_SCORE_LIMIT ||
                            scoreLimit > MAX_SCORE_LIMIT ||
                            defaultRoundDuration === null ||
                            scoreLimit === null
                        }
                        className="w-full"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
