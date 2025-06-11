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

export function InfoDialogue() {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4 w-40">Info</Button>
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
                            and an <strong>acronym</strong>.
                        </p>
                        <p>
                            Your job is to submit what you think the acronym
                            stands for, based on the prompt.
                        </p>
                        <p>
                            Once all submissions are in, vote for the answer you
                            think is best.
                        </p>
                        <p>
                            You earn <strong>1 point</strong> for every vote
                            your answer receives.
                        </p>
                        <p>
                            The first player to reach <strong>10 points</strong>{' '}
                            wins the game!
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
