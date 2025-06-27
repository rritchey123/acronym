import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SuggestionType } from '@shared/index'
import socket from '@/socket'
import { useSelector } from 'react-redux'
import { errorToast, selectFeState, successToast } from '@/lib/utils'

const MAX_ACRONYM_LENGTH = 5
const MAX_PROMPT_LENGTH = 75

export const SuggestDialog = () => {
    const { room } = useSelector(selectFeState)

    const [suggestionType, setSuggestionType] = useState<SuggestionType>(
        SuggestionType.ACRONYM
    )
    const [inputValue, setInputValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!room) {
        errorToast('Room does not exist')
        return null
    }

    const maxChar =
        suggestionType === SuggestionType.ACRONYM
            ? MAX_ACRONYM_LENGTH
            : MAX_PROMPT_LENGTH
    const isInputValid = inputValue.trim().length <= maxChar

    const handleSubmit = async () => {
        if (!isInputValid) return

        setIsSubmitting(true)
        try {
            socket.emit(
                'suggest',
                {
                    roomId: room.id,
                    suggestionType,
                    suggestion: inputValue.trim(),
                },
                ({ success, data }) => {
                    if (!success) {
                        errorToast(
                            `Failed to suggest ${suggestionType}: ${JSON.stringify(
                                data
                            )}`
                        )
                    } else {
                        successToast(`Successfully suggested ${suggestionType}`)
                    }
                }
            )
            setInputValue('')
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
                    <MessageSquarePlus className="w-5 h-5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] space-y-4">
                <DialogHeader>
                    <DialogTitle>Suggest a {suggestionType}</DialogTitle>
                    <DialogDescription>
                        Choose the type of suggestion you'd like to submit.
                    </DialogDescription>
                </DialogHeader>

                {/* Toggle between Acronym and Prompt */}
                <ToggleGroup
                    type="single"
                    value={suggestionType}
                    onValueChange={(val) => {
                        if (val) {
                            setSuggestionType(val as SuggestionType)
                            setInputValue('')
                        }
                    }}
                    className="w-full justify-center"
                >
                    <ToggleGroupItem
                        value={SuggestionType.ACRONYM}
                        className="px-4 py-2 text-sm"
                    >
                        {SuggestionType.ACRONYM}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value={SuggestionType.PROMPT}
                        className="px-4 py-2 text-sm"
                    >
                        {SuggestionType.PROMPT}
                    </ToggleGroupItem>
                </ToggleGroup>

                {/* Input field */}
                <div className="space-y-1">
                    {suggestionType === SuggestionType.ACRONYM ? (
                        <Input
                            placeholder="e.g. LOL, CRM, AI"
                            value={inputValue}
                            onChange={(e) => {
                                if (e.target.value.length <= maxChar) {
                                    setInputValue(e.target.value.toUpperCase())
                                }
                            }}
                            className="text-foreground"
                        />
                    ) : (
                        <Textarea
                            placeholder="Enter a full prompt, e.g. 'Funny bumper sticker'"
                            value={inputValue}
                            onChange={(e) =>
                                e.target.value.length <= maxChar &&
                                setInputValue(e.target.value)
                            }
                            className="text-foreground"
                            rows={4}
                        />
                    )}

                    {/* Character counter */}
                    <div className="text-xs text-muted-foreground text-right">
                        {inputValue.trim().length} / {maxChar}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isInputValid}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
