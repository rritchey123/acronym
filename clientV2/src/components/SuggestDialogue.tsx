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

export const SuggestPromptDialog = () => {
    const [suggestionType, setSuggestionType] = useState<SuggestionType>(
        SuggestionType.ACRONYM
    )
    const [inputValue, setInputValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!inputValue.trim()) return

        setIsSubmitting(true)
        try {
            // TODO: Replace with API call or store logic
            console.log(`User suggested a ${suggestionType}:`, inputValue)
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
                    <DialogTitle>
                        Suggest a {SuggestionType.ACRONYM}
                    </DialogTitle>
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

                {/* Input depending on selected type */}
                {suggestionType === SuggestionType.ACRONYM ? (
                    <Input
                        placeholder="e.g. LOL, CRM, AI"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-foreground"
                        maxLength={10}
                    />
                ) : (
                    <Textarea
                        placeholder="Enter a full prompt, e.g. 'Funny bumper sticker'"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-foreground"
                        rows={4}
                    />
                )}

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !inputValue.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
