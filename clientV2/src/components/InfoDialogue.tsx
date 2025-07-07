import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { AlarmClockPlus, MessageSquarePlus } from 'lucide-react'

export function InfoDialogue() {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className={'mb-4 w-40'}>Info</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            How to Play
                        </DialogTitle>
                        <DialogDescription>
                            Learn how the game works before you dive in.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 text-sm text-foreground leading-relaxed">
                        <p>
                            Each round, you’ll receive a <strong>prompt</strong>{' '}
                            and an <strong>acronym</strong>. Your job is to
                            submit what you think the <strong>acronym</strong>{' '}
                            stands for, based on the <strong>prompt</strong>.
                        </p>
                        <p>
                            Once all submissions are in, vote for the answer you
                            think is best. You earn <strong>1 point</strong> for
                            every vote your answer receives. The first player to
                            reach <strong>10 points</strong> wins the game!
                        </p>
                        <p>
                            Suggest prompts and acronyms using the{' '}
                            <p className="inline-block">
                                <MessageSquarePlus />
                            </p>{' '}
                            button. Add more time to the round using the{' '}
                            <p className="inline-block">
                                <AlarmClockPlus />
                            </p>{' '}
                            button.
                        </p>
                    </div>

                    <DialogFooter>
                        <p className="text-center w-full font-medium text-muted-foreground">
                            Have fun and get creative!
                        </p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
