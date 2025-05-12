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
                    <Button className="mb-4 w-20">Info</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Info</DialogTitle>
                        <DialogDescription>How this works:</DialogDescription>
                    </DialogHeader>
                    <div>
                        Each round, you will be given a prompt and an acronym.
                    </div>
                    <div>
                        Submit what you think the acronym stands for given the
                        prompt.
                    </div>
                    <div>Vote for the best answers each round.</div>
                    <div>Earn points for each vote you get.</div>
                    <div>First player to 10 total votes wins!</div>
                    <DialogFooter>
                        <div>Have fun!</div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
